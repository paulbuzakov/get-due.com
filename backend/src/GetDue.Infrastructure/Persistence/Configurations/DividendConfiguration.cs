using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class DividendConfiguration : IEntityTypeConfiguration<Dividend>
{
    public void Configure(EntityTypeBuilder<Dividend> builder)
    {
        builder.ToTable("dividends");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Amount)
            .HasPrecision(18, 2);

        builder.Property(d => d.PaymentDate)
            .IsRequired();

        builder.Property(d => d.Frequency)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasIndex(d => d.StockId);
    }
}
