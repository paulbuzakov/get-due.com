using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Analytics;

public record PortfolioSummaryDto
{
    public decimal NetWorth { get; init; }
    public decimal TotalAssets { get; init; }
    public decimal TotalLiabilities { get; init; }
    public Dictionary<AssetType, decimal> AssetAllocation { get; init; } = new();
    public decimal MonthlyIncome { get; init; }
    public decimal MonthlyExpenses { get; init; }
    public decimal PassiveIncome { get; init; }
    public decimal DebtToIncomeRatio { get; init; }
}
