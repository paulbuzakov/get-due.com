using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GetDue.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email).IsRequired().HasMaxLength(256);

        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(512);

        builder.Property(u => u.FirstName).IsRequired().HasMaxLength(100);

        builder.Property(u => u.LastName).IsRequired().HasMaxLength(100);

        builder.Property(u => u.DefaultCurrency).HasConversion<string>().HasMaxLength(10);

        builder.Property(u => u.RefreshToken).HasMaxLength(512);

        builder.HasIndex(u => u.Email).IsUnique();

        builder
            .HasMany(u => u.Stocks)
            .WithOne(s => s.User)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(u => u.Properties)
            .WithOne(p => p.User)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(u => u.CashAccounts)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(u => u.Loans)
            .WithOne(l => l.User)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(u => u.Transactions)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(u => u.RecurringPayments)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(u => u.CalendarEvents)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
