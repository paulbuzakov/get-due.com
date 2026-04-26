using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class RecurringPaymentConfiguration : IEntityTypeConfiguration<RecurringPayment>
{
    public void Configure(EntityTypeBuilder<RecurringPayment> builder)
    {
        builder.ToTable("recurring_payments");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(r => r.Amount)
            .HasPrecision(18, 2);

        builder.Property(r => r.Frequency)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(r => r.Category)
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(r => r.NextPaymentDate)
            .IsRequired();

        builder.Property(r => r.Currency)
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.Property(r => r.Notes)
            .HasMaxLength(2000);

        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => new { r.IsActive, r.NextPaymentDate });
    }
}
