namespace GetDue.Application.DTOs.Analytics;

public record NetWorthDto
{
    public decimal TotalAssets { get; init; }
    public decimal TotalLiabilities { get; init; }
    public decimal NetWorth { get; init; }
    public decimal StocksValue { get; init; }
    public decimal RealEstateValue { get; init; }
    public decimal CashValue { get; init; }
    public decimal LoansTotal { get; init; }
}
