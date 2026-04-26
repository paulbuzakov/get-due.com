using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class RecurringPayment : AuditableEntity
{
    public Guid UserId { get; set; }
    public required string Name { get; set; }
    public decimal Amount { get; set; }
    public PaymentFrequency Frequency { get; set; }
    public TransactionCategory Category { get; set; }
    public DateTime NextPaymentDate { get; set; }
    public Currency Currency { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Notes { get; set; }

    public User User { get; set; } = null!;
}
