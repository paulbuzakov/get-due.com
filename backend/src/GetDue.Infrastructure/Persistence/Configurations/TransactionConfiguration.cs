using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Amount)
            .HasPrecision(18, 2);

        builder.Property(t => t.Type)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(t => t.Category)
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(t => t.Description)
            .HasMaxLength(500);

        builder.Property(t => t.TransactionDate)
            .IsRequired();

        builder.Property(t => t.Currency)
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.HasIndex(t => new { t.UserId, t.TransactionDate });
        builder.HasIndex(t => new { t.UserId, t.Type, t.TransactionDate });
        builder.HasIndex(t => t.CashAccountId);
    }
}
