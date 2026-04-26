using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using GetDue.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Quartz;

namespace GetDue.Infrastructure.Jobs;

[DisallowConcurrentExecution]
public class RecurringPaymentJob : IJob
{
    private readonly IRepository<RecurringPayment> _recurringPaymentRepository;
    private readonly IRepository<Transaction> _transactionRepository;
    private readonly IRepository<CalendarEvent> _calendarEventRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RecurringPaymentJob> _logger;

    public RecurringPaymentJob(
        IRepository<RecurringPayment> recurringPaymentRepository,
        IRepository<Transaction> transactionRepository,
        IRepository<CalendarEvent> calendarEventRepository,
        IUnitOfWork unitOfWork,
        ILogger<RecurringPaymentJob> logger)
    {
        _recurringPaymentRepository = recurringPaymentRepository;
        _transactionRepository = transactionRepository;
        _calendarEventRepository = calendarEventRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        _logger.LogInformation("RecurringPaymentJob started at {Time}", DateTime.UtcNow);

        var today = DateTime.UtcNow.Date;

        var duePayments = await _recurringPaymentRepository.Query()
            .Where(rp => rp.IsActive && rp.NextPaymentDate.Date <= today)
            .ToListAsync(context.CancellationToken);

        _logger.LogInformation("Found {Count} due recurring payments", duePayments.Count);

        foreach (var payment in duePayments)
        {
            try
            {
                // Create transaction for the due payment
                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = payment.UserId,
                    Amount = payment.Amount,
                    Type = TransactionType.Expense,
                    Category = payment.Category,
                    Description = $"Recurring: {payment.Name}",
                    TransactionDate = payment.NextPaymentDate,
                    Currency = payment.Currency
                };

                await _transactionRepository.AddAsync(transaction, context.CancellationToken);

                // Advance NextPaymentDate based on frequency
                payment.NextPaymentDate = AdvanceDate(payment.NextPaymentDate, payment.Frequency);

                await _recurringPaymentRepository.UpdateAsync(payment, context.CancellationToken);

                // Create calendar event for next occurrence
                var calendarEvent = new CalendarEvent
                {
                    Id = Guid.NewGuid(),
                    UserId = payment.UserId,
                    Title = $"Upcoming: {payment.Name}",
                    Description = $"Recurring payment of {payment.Amount:N2} {payment.Currency}",
                    EventDate = payment.NextPaymentDate,
                    EventType = CalendarEventType.RecurringPayment,
                    RelatedEntityId = payment.Id,
                    IsCompleted = false
                };

                await _calendarEventRepository.AddAsync(calendarEvent, context.CancellationToken);

                _logger.LogInformation(
                    "Processed recurring payment '{Name}' for user {UserId}. Next payment: {NextDate}",
                    payment.Name, payment.UserId, payment.NextPaymentDate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing recurring payment '{Name}' (Id: {Id})", payment.Name, payment.Id);
            }
        }

        await _unitOfWork.SaveChangesAsync(context.CancellationToken);

        _logger.LogInformation("RecurringPaymentJob completed at {Time}", DateTime.UtcNow);
    }

    private static DateTime AdvanceDate(DateTime current, PaymentFrequency frequency)
    {
        return frequency switch
        {
            PaymentFrequency.Daily => current.AddDays(1),
            PaymentFrequency.Weekly => current.AddDays(7),
            PaymentFrequency.BiWeekly => current.AddDays(14),
            PaymentFrequency.Monthly => current.AddMonths(1),
            PaymentFrequency.Quarterly => current.AddMonths(3),
            PaymentFrequency.SemiAnnually => current.AddMonths(6),
            PaymentFrequency.Annually => current.AddYears(1),
            PaymentFrequency.OneTime => current, // One-time payments don't advance
            _ => current.AddMonths(1)
        };
    }
}
