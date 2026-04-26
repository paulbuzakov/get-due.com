using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Transactions;

public record UpdateTransactionRequest
{
    public Guid? CashAccountId { get; init; }
    public decimal Amount { get; init; }
    public TransactionType Type { get; init; }
    public TransactionCategory Category { get; init; }
    public string? Description { get; init; }
    public DateTime TransactionDate { get; init; }
    public Currency Currency { get; init; }
}
