using GetDue.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class LoanPaymentConfiguration : IEntityTypeConfiguration<LoanPayment>
{
    public void Configure(EntityTypeBuilder<LoanPayment> builder)
    {
        builder.ToTable("loan_payments");

        builder.HasKey(lp => lp.Id);

        builder.Property(lp => lp.Amount)
            .HasPrecision(18, 2);

        builder.Property(lp => lp.PrincipalPortion)
            .HasPrecision(18, 2);

        builder.Property(lp => lp.InterestPortion)
            .HasPrecision(18, 2);

        builder.Property(lp => lp.PaymentDate)
            .IsRequired();

        builder.HasIndex(lp => lp.LoanId);
    }
}
