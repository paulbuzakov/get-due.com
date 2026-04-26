using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.RecurringPayments;

public record RecurringPaymentDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public decimal Amount { get; init; }
    public PaymentFrequency Frequency { get; init; }
    public TransactionCategory Category { get; init; }
    public DateTime NextPaymentDate { get; init; }
    public Currency Currency { get; init; }
    public bool IsActive { get; init; }
    public string? Notes { get; init; }
}
