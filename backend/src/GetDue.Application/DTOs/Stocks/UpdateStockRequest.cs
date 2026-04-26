using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Stocks;

public record UpdateStockRequest
{
    public required string Ticker { get; init; }
    public required string CompanyName { get; init; }
    public decimal Quantity { get; init; }
    public decimal BuyPrice { get; init; }
    public decimal CurrentPrice { get; init; }
    public Currency Currency { get; init; }
    public string? Notes { get; init; }
}
