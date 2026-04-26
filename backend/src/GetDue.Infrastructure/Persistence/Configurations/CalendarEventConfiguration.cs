using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class CalendarEventConfiguration : IEntityTypeConfiguration<CalendarEvent>
{
    public void Configure(EntityTypeBuilder<CalendarEvent> builder)
    {
        builder.ToTable("calendar_events");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Description)
            .HasMaxLength(2000);

        builder.Property(c => c.EventDate)
            .IsRequired();

        builder.Property(c => c.EventType)
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.HasIndex(c => c.UserId);
        builder.HasIndex(c => new { c.UserId, c.EventDate });
        builder.HasIndex(c => c.RelatedEntityId);
    }
}
