using GetDue.Application.DTOs.Dividends;
using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Stocks;

public record StockDto
{
    public Guid Id { get; init; }
    public required string Ticker { get; init; }
    public required string CompanyName { get; init; }
    public decimal Quantity { get; init; }
    public decimal BuyPrice { get; init; }
    public decimal CurrentPrice { get; init; }
    public Currency Currency { get; init; }
    public decimal TotalValue => Quantity * CurrentPrice;
    public decimal GainLoss => (CurrentPrice - BuyPrice) * Quantity;
    public decimal GainLossPercent => BuyPrice != 0 ? (CurrentPrice - BuyPrice) / BuyPrice * 100 : 0;
    public string? Notes { get; init; }
    public List<DividendDto> Dividends { get; init; } = [];
}
