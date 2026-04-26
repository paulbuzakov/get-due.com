using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using GetDue.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync())
            return;

        var userId = Guid.NewGuid();
        var now = DateTime.UtcNow;

        var user = new User
        {
            Id = userId,
            Email = "demo@getdue.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
            FirstName = "Demo",
            LastName = "User",
            DefaultCurrency = Currency.USD,
        };
        db.Users.Add(user);

        // Stocks
        var stocks = new[]
        {
            CreateStock(userId, "AAPL", "Apple Inc.", 50, 142.50m, 198.30m),
            CreateStock(userId, "MSFT", "Microsoft Corp.", 30, 280.00m, 415.60m),
            CreateStock(userId, "GOOGL", "Alphabet Inc.", 20, 105.00m, 172.40m),
            CreateStock(userId, "AMZN", "Amazon.com Inc.", 15, 120.00m, 185.90m),
            CreateStock(userId, "TSLA", "Tesla Inc.", 25, 190.00m, 245.70m),
        };
        db.Stocks.AddRange(stocks);

        // Dividends
        var dividends = new[]
        {
            new Dividend
            {
                Id = Guid.NewGuid(),
                StockId = stocks[0].Id,
                Amount = 24.00m,
                PaymentDate = now.AddDays(-30),
                Frequency = PaymentFrequency.Quarterly,
            },
            new Dividend
            {
                Id = Guid.NewGuid(),
                StockId = stocks[0].Id,
                Amount = 24.00m,
                PaymentDate = now.AddDays(-120),
                Frequency = PaymentFrequency.Quarterly,
            },
            new Dividend
            {
                Id = Guid.NewGuid(),
                StockId = stocks[1].Id,
                Amount = 20.40m,
                PaymentDate = now.AddDays(-15),
                Frequency = PaymentFrequency.Quarterly,
            },
            new Dividend
            {
                Id = Guid.NewGuid(),
                StockId = stocks[2].Id,
                Amount = 4.00m,
                PaymentDate = now.AddDays(-45),
                Frequency = PaymentFrequency.Quarterly,
            },
        };
        db.Dividends.AddRange(dividends);

        // Properties
        var properties = new[]
        {
            new Property
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Downtown Apartment",
                Address = "123 Main St, Apt 4B, New York, NY 10001",
                PurchasePrice = 450000m,
                CurrentValue = 520000m,
                PurchaseDate = now.AddYears(-3),
                Currency = Currency.USD,
            },
            new Property
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Suburban House",
                Address = "456 Oak Avenue, Greenwich, CT 06830",
                PurchasePrice = 680000m,
                CurrentValue = 750000m,
                PurchaseDate = now.AddYears(-5),
                Currency = Currency.USD,
            },
        };
        db.Properties.AddRange(properties);

        // Property Valuations
        db.PropertyValuations.AddRange(
            new PropertyValuation
            {
                Id = Guid.NewGuid(),
                PropertyId = properties[0].Id,
                Value = 470000m,
                ValuationDate = now.AddYears(-2),
                Source = "Appraisal",
            },
            new PropertyValuation
            {
                Id = Guid.NewGuid(),
                PropertyId = properties[0].Id,
                Value = 495000m,
                ValuationDate = now.AddYears(-1),
                Source = "Appraisal",
            },
            new PropertyValuation
            {
                Id = Guid.NewGuid(),
                PropertyId = properties[0].Id,
                Value = 520000m,
                ValuationDate = now.AddMonths(-1),
                Source = "Manual",
            }
        );

        // Cash Accounts
        var accounts = new[]
        {
            new CashAccount
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Checking Account",
                Institution = "Chase Bank",
                Balance = 15420.50m,
                Currency = Currency.USD,
                AccountNumber = "****4521",
            },
            new CashAccount
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Savings Account",
                Institution = "Chase Bank",
                Balance = 48750.00m,
                Currency = Currency.USD,
                AccountNumber = "****8832",
            },
        };
        db.CashAccounts.AddRange(accounts);

        // Loans
        var mortgage = new Loan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = "Home Mortgage",
            LoanType = LoanType.Mortgage,
            Principal = 540000m,
            InterestRate = 6.5m,
            MonthlyPayment = 3415.00m,
            RemainingBalance = 485000m,
            StartDate = now.AddYears(-5),
            EndDate = now.AddYears(25),
            Currency = Currency.USD,
        };
        var personalLoan = new Loan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = "Personal Loan",
            LoanType = LoanType.Personal,
            Principal = 20000m,
            InterestRate = 8.9m,
            MonthlyPayment = 620.00m,
            RemainingBalance = 12500m,
            StartDate = now.AddYears(-1),
            EndDate = now.AddYears(2),
            Currency = Currency.USD,
        };
        db.Loans.AddRange(mortgage, personalLoan);

        // Transactions (last 3 months)
        var transactions = new List<Transaction>();
        var categories = new[]
        {
            TransactionCategory.Salary,
            TransactionCategory.Groceries,
            TransactionCategory.Utilities,
            TransactionCategory.Entertainment,
            TransactionCategory.Healthcare,
            TransactionCategory.Transportation,
            TransactionCategory.Education,
            TransactionCategory.Subscription,
        };

        for (int monthOffset = 0; monthOffset < 3; monthOffset++)
        {
            var monthDate = now.AddMonths(-monthOffset);
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CashAccountId = accounts[0].Id,
                    Amount = 8500m,
                    Type = TransactionType.Income,
                    Category = TransactionCategory.Salary,
                    Description = "Monthly Salary",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        1,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CashAccountId = accounts[0].Id,
                    Amount = 1200m,
                    Type = TransactionType.Income,
                    Category = TransactionCategory.Rental,
                    Description = "Apartment rental income",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        5,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CashAccountId = accounts[0].Id,
                    Amount = 650m,
                    Type = TransactionType.Expense,
                    Category = TransactionCategory.Groceries,
                    Description = "Monthly groceries",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        8,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CashAccountId = accounts[0].Id,
                    Amount = 280m,
                    Type = TransactionType.Expense,
                    Category = TransactionCategory.Utilities,
                    Description = "Utilities",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        10,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CashAccountId = accounts[0].Id,
                    Amount = 150m,
                    Type = TransactionType.Expense,
                    Category = TransactionCategory.Entertainment,
                    Description = "Entertainment",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        15,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CashAccountId = accounts[0].Id,
                    Amount = 3415m,
                    Type = TransactionType.Expense,
                    Category = TransactionCategory.LoanPayment,
                    Description = "Mortgage payment",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        15,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CashAccountId = accounts[0].Id,
                    Amount = 620m,
                    Type = TransactionType.Expense,
                    Category = TransactionCategory.LoanPayment,
                    Description = "Personal loan payment",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        20,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
            transactions.Add(
                new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Amount = 85m,
                    Type = TransactionType.Expense,
                    Category = TransactionCategory.Transportation,
                    Description = "Metro pass",
                    TransactionDate = new DateTime(
                        monthDate.Year,
                        monthDate.Month,
                        3,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    ),
                    Currency = Currency.USD,
                }
            );
        }
        db.Transactions.AddRange(transactions);

        // Recurring Payments
        db.RecurringPayments.AddRange(
            new RecurringPayment
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Netflix",
                Amount = 15.99m,
                Frequency = PaymentFrequency.Monthly,
                Category = TransactionCategory.Subscription,
                NextPaymentDate = now.AddDays(12),
                Currency = Currency.USD,
                IsActive = true,
            },
            new RecurringPayment
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Gym Membership",
                Amount = 49.99m,
                Frequency = PaymentFrequency.Monthly,
                Category = TransactionCategory.Healthcare,
                NextPaymentDate = now.AddDays(5),
                Currency = Currency.USD,
                IsActive = true,
            },
            new RecurringPayment
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Car Insurance",
                Amount = 180.00m,
                Frequency = PaymentFrequency.Monthly,
                Category = TransactionCategory.Transportation,
                NextPaymentDate = now.AddDays(20),
                Currency = Currency.USD,
                IsActive = true,
            }
        );

        // Calendar Events
        db.CalendarEvents.AddRange(
            new CalendarEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Mortgage Payment Due",
                EventDate = now.AddDays(10),
                EventType = CalendarEventType.LoanPayment,
                RelatedEntityId = mortgage.Id,
            },
            new CalendarEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "AAPL Dividend Payout",
                EventDate = now.AddDays(25),
                EventType = CalendarEventType.DividendPayout,
                RelatedEntityId = stocks[0].Id,
            },
            new CalendarEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Review Portfolio",
                EventDate = now.AddDays(30),
                EventType = CalendarEventType.Custom,
                Description = "Quarterly portfolio review",
            },
            new CalendarEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Personal Loan Payment",
                EventDate = now.AddDays(15),
                EventType = CalendarEventType.LoanPayment,
                RelatedEntityId = personalLoan.Id,
            },
            new CalendarEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Tax Filing Deadline",
                EventDate = now.AddDays(60),
                EventType = CalendarEventType.Custom,
                Description = "Submit quarterly estimated taxes",
            }
        );

        await db.SaveChangesAsync();
    }

    private static Stock CreateStock(
        Guid userId,
        string ticker,
        string name,
        decimal qty,
        decimal buyPrice,
        decimal currentPrice
    ) =>
        new()
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Ticker = ticker,
            CompanyName = name,
            Quantity = qty,
            BuyPrice = buyPrice,
            CurrentPrice = currentPrice,
            Currency = Currency.USD,
        };
}
