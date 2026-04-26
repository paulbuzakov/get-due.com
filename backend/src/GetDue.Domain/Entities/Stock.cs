using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class Stock : AuditableEntity
{
    public Guid UserId { get; set; }
    public required string Ticker { get; set; }
    public required string CompanyName { get; set; }
    public decimal Quantity { get; set; }
    public decimal BuyPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public Currency Currency { get; set; }
    public string? Notes { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Dividend> Dividends { get; set; } = [];
}
