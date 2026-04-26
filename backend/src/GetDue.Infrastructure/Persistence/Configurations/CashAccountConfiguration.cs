using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class CashAccountConfiguration : IEntityTypeConfiguration<CashAccount>
{
    public void Configure(EntityTypeBuilder<CashAccount> builder)
    {
        builder.ToTable("cash_accounts");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Institution)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Balance)
            .HasPrecision(18, 2);

        builder.Property(c => c.Currency)
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.Property(c => c.AccountNumber)
            .HasMaxLength(50);

        builder.HasIndex(c => c.UserId);

        builder.HasMany(c => c.Transactions)
            .WithOne(t => t.CashAccount)
            .HasForeignKey(t => t.CashAccountId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
