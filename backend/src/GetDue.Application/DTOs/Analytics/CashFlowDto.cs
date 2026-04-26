using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Analytics;

public record CashFlowDto
{
    public int Year { get; init; }
    public int Month { get; init; }
    public decimal TotalIncome { get; init; }
    public decimal TotalExpenses { get; init; }
    public decimal NetCashFlow { get; init; }
    public Dictionary<TransactionCategory, decimal> IncomeByCategory { get; init; } = new();
    public Dictionary<TransactionCategory, decimal> ExpensesByCategory { get; init; } = new();
}
