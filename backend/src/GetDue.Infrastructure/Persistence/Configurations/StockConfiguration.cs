using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class StockConfiguration : IEntityTypeConfiguration<Stock>
{
    public void Configure(EntityTypeBuilder<Stock> builder)
    {
        builder.ToTable("stocks");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Ticker)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(s => s.CompanyName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(s => s.Quantity)
            .HasPrecision(18, 4);

        builder.Property(s => s.BuyPrice)
            .HasPrecision(18, 2);

        builder.Property(s => s.CurrentPrice)
            .HasPrecision(18, 2);

        builder.Property(s => s.Currency)
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.Property(s => s.Notes)
            .HasMaxLength(2000);

        builder.HasIndex(s => new { s.UserId, s.Ticker })
            .IsUnique();

        builder.HasMany(s => s.Dividends)
            .WithOne(d => d.Stock)
            .HasForeignKey(d => d.StockId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
