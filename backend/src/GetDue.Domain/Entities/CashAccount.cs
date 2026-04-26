using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class CashAccount : AuditableEntity
{
    public Guid UserId { get; set; }
    public required string Name { get; set; }
    public required string Institution { get; set; }
    public decimal Balance { get; set; }
    public Currency Currency { get; set; }
    public string? AccountNumber { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = [];
}
