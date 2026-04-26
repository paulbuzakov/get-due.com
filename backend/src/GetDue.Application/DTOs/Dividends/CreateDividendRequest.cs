using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Dividends;

public record CreateDividendRequest
{
    public Guid StockId { get; init; }
    public decimal Amount { get; init; }
    public DateTime PaymentDate { get; init; }
    public PaymentFrequency Frequency { get; init; }
}
