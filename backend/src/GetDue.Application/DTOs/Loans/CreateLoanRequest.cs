using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Loans;

public record CreateLoanRequest
{
    public required string Name { get; init; }
    public LoanType LoanType { get; init; }
    public decimal Principal { get; init; }
    public decimal InterestRate { get; init; }
    public decimal MonthlyPayment { get; init; }
    public decimal RemainingBalance { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public Currency Currency { get; init; }
    public string? Notes { get; init; }
}
