using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class PropertyConfiguration : IEntityTypeConfiguration<Property>
{
    public void Configure(EntityTypeBuilder<Property> builder)
    {
        builder.ToTable("properties");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Address)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(p => p.PurchasePrice)
            .HasPrecision(18, 2);

        builder.Property(p => p.CurrentValue)
            .HasPrecision(18, 2);

        builder.Property(p => p.PurchaseDate)
            .IsRequired();

        builder.Property(p => p.Currency)
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.Property(p => p.Notes)
            .HasMaxLength(2000);

        builder.HasIndex(p => p.UserId);

        builder.HasMany(p => p.Valuations)
            .WithOne(v => v.Property)
            .HasForeignKey(v => v.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
