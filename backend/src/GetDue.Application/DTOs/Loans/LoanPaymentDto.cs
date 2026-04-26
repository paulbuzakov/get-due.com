namespace GetDue.Application.DTOs.Loans;

public record LoanPaymentDto
{
    public Guid Id { get; init; }
    public Guid LoanId { get; init; }
    public decimal Amount { get; init; }
    public decimal PrincipalPortion { get; init; }
    public decimal InterestPortion { get; init; }
    public DateTime PaymentDate { get; init; }
}
