using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class Property : AuditableEntity
{
    public Guid UserId { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
    public decimal PurchasePrice { get; set; }
    public decimal CurrentValue { get; set; }
    public DateTime PurchaseDate { get; set; }
    public Currency Currency { get; set; }
    public string? Notes { get; set; }

    public User User { get; set; } = null!;
    public ICollection<PropertyValuation> Valuations { get; set; } = [];
}
