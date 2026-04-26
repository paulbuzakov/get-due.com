using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.CashAccounts;

public record UpdateCashAccountRequest
{
    public required string Name { get; init; }
    public required string Institution { get; init; }
    public decimal Balance { get; init; }
    public Currency Currency { get; init; }
    public string? AccountNumber { get; init; }
}
