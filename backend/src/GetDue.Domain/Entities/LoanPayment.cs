using GetDue.Domain.Common;

namespace GetDue.Domain.Entities;

public class LoanPayment : AuditableEntity
{
    public Guid LoanId { get; set; }
    public decimal Amount { get; set; }
    public decimal PrincipalPortion { get; set; }
    public decimal InterestPortion { get; set; }
    public DateTime PaymentDate { get; set; }

    public Loan Loan { get; set; } = null!;
}
