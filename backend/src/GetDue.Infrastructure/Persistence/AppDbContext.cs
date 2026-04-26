using GetDue.Domain.Common;
using GetDue.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GetDue.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Dividend> Dividends => Set<Dividend>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyValuation> PropertyValuations => Set<PropertyValuation>();
    public DbSet<CashAccount> CashAccounts => Set<CashAccount>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Loan> Loans => Set<Loan>();
    public DbSet<LoanPayment> LoanPayments => Set<LoanPayment>();
    public DbSet<RecurringPayment> RecurringPayments => Set<RecurringPayment>();
    public DbSet<CalendarEvent> CalendarEvents => Set<CalendarEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedBy ??= "system";
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedBy = "system";
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
