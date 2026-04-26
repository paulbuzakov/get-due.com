using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class Dividend : AuditableEntity
{
    public Guid StockId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public PaymentFrequency Frequency { get; set; }

    public Stock Stock { get; set; } = null!;
}
