using GetDue.Domain.Common;

namespace GetDue.Domain.Entities;

public class PropertyValuation : AuditableEntity
{
    public Guid PropertyId { get; set; }
    public decimal Value { get; set; }
    public DateTime ValuationDate { get; set; }
    public string? Source { get; set; }

    public Property Property { get; set; } = null!;
}
