using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class User : AuditableEntity
{
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public Currency DefaultCurrency { get; set; } = Currency.USD;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public ICollection<Stock> Stocks { get; set; } = [];
    public ICollection<Property> Properties { get; set; } = [];
    public ICollection<CashAccount> CashAccounts { get; set; } = [];
    public ICollection<Loan> Loans { get; set; } = [];
    public ICollection<Transaction> Transactions { get; set; } = [];
    public ICollection<RecurringPayment> RecurringPayments { get; set; } = [];
    public ICollection<CalendarEvent> CalendarEvents { get; set; } = [];
}
