using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class Transaction : AuditableEntity
{
    public Guid UserId { get; set; }
    public Guid? CashAccountId { get; set; }
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public TransactionCategory Category { get; set; }
    public string? Description { get; set; }
    public DateTime TransactionDate { get; set; }
    public Currency Currency { get; set; }

    public User User { get; set; } = null!;
    public CashAccount? CashAccount { get; set; }
}
