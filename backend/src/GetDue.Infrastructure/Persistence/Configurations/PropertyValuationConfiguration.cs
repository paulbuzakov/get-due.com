using GetDue.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class PropertyValuationConfiguration : IEntityTypeConfiguration<PropertyValuation>
{
    public void Configure(EntityTypeBuilder<PropertyValuation> builder)
    {
        builder.ToTable("property_valuations");

        builder.HasKey(pv => pv.Id);

        builder.Property(pv => pv.Value)
            .HasPrecision(18, 2);

        builder.Property(pv => pv.ValuationDate)
            .IsRequired();

        builder.Property(pv => pv.Source)
            .HasMaxLength(200);

        builder.HasIndex(pv => pv.PropertyId);
    }
}
