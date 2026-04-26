using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class LoanConfiguration : IEntityTypeConfiguration<Loan>
{
    public void Configure(EntityTypeBuilder<Loan> builder)
    {
        builder.ToTable("loans");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(l => l.LoanType)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(l => l.Principal)
            .HasPrecision(18, 2);

        builder.Property(l => l.InterestRate)
            .HasPrecision(8, 4);

        builder.Property(l => l.MonthlyPayment)
            .HasPrecision(18, 2);

        builder.Property(l => l.RemainingBalance)
            .HasPrecision(18, 2);

        builder.Property(l => l.Currency)
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.Property(l => l.Notes)
            .HasMaxLength(2000);

        builder.HasIndex(l => l.UserId);

        builder.HasMany(l => l.Payments)
            .WithOne(p => p.Loan)
            .HasForeignKey(p => p.LoanId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
