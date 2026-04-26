using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class Loan : AuditableEntity
{
    public Guid UserId { get; set; }
    public required string Name { get; set; }
    public LoanType LoanType { get; set; }
    public decimal Principal { get; set; }
    public decimal InterestRate { get; set; }
    public decimal MonthlyPayment { get; set; }
    public decimal RemainingBalance { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public Currency Currency { get; set; }
    public string? Notes { get; set; }

    public User User { get; set; } = null!;
    public ICollection<LoanPayment> Payments { get; set; } = [];
}
