using GetDue.Application.Common;
using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Transactions;

public class TransactionQueryParameters : QueryParameters
{
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public TransactionType? Type { get; init; }
    public TransactionCategory? Category { get; init; }
    public Guid? CashAccountId { get; init; }
}
