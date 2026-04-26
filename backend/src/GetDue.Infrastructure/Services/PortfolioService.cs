using GetDue.Application.DTOs.Analytics;
using GetDue.Application.Interfaces;
using GetDue.Domain.Entities;
using GetDue.Domain.Enums;
using GetDue.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GetDue.Infrastructure.Services;

public class PortfolioService : IPortfolioService
{
    private readonly IRepository<Stock> _stockRepository;
    private readonly IRepository<Property> _propertyRepository;
    private readonly IRepository<CashAccount> _cashAccountRepository;
    private readonly IRepository<Loan> _loanRepository;
    private readonly IRepository<Transaction> _transactionRepository;

    public PortfolioService(
        IRepository<Stock> stockRepository,
        IRepository<Property> propertyRepository,
        IRepository<CashAccount> cashAccountRepository,
        IRepository<Loan> loanRepository,
        IRepository<Transaction> transactionRepository)
    {
        _stockRepository = stockRepository;
        _propertyRepository = propertyRepository;
        _cashAccountRepository = cashAccountRepository;
        _loanRepository = loanRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<PortfolioSummaryDto> GetPortfolioSummaryAsync(Guid userId, CancellationToken ct = default)
    {
        var stocks = await _stockRepository.Query()
            .Where(s => s.UserId == userId).ToListAsync(ct);
        var properties = await _propertyRepository.Query()
            .Where(p => p.UserId == userId).ToListAsync(ct);
        var cashAccounts = await _cashAccountRepository.Query()
            .Where(c => c.UserId == userId).ToListAsync(ct);
        var loans = await _loanRepository.Query()
            .Where(l => l.UserId == userId).ToListAsync(ct);

        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var monthEnd = monthStart.AddMonths(1);

        var monthTransactions = await _transactionRepository.Query()
            .Where(t => t.UserId == userId && t.TransactionDate >= monthStart && t.TransactionDate < monthEnd)
            .ToListAsync(ct);

        var stocksValue = stocks.Sum(s => s.CurrentPrice * s.Quantity);
        var realEstateValue = properties.Sum(p => p.CurrentValue);
        var cashBalance = cashAccounts.Sum(c => c.Balance);
        var totalAssets = stocksValue + realEstateValue + cashBalance;
        var totalLiabilities = loans.Sum(l => l.RemainingBalance);

        var monthlyIncome = monthTransactions
            .Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
        var monthlyExpenses = monthTransactions
            .Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);
        var passiveIncome = monthTransactions
            .Where(t => t.Type == TransactionType.Income &&
                        (t.Category == TransactionCategory.Dividend || t.Category == TransactionCategory.Rental))
            .Sum(t => t.Amount);

        var debtToIncomeRatio = monthlyIncome > 0
            ? loans.Sum(l => l.MonthlyPayment) / monthlyIncome
            : 0;

        var assetAllocation = new Dictionary<AssetType, decimal>
        {
            [AssetType.Stock] = stocksValue,
            [AssetType.RealEstate] = realEstateValue,
            [AssetType.Cash] = cashBalance
        };

        return new PortfolioSummaryDto
        {
            NetWorth = totalAssets - totalLiabilities,
            TotalAssets = totalAssets,
            TotalLiabilities = totalLiabilities,
            AssetAllocation = assetAllocation,
            MonthlyIncome = monthlyIncome,
            MonthlyExpenses = monthlyExpenses,
            PassiveIncome = passiveIncome,
            DebtToIncomeRatio = debtToIncomeRatio
        };
    }

    public async Task<NetWorthDto> GetNetWorthAsync(Guid userId, CancellationToken ct = default)
    {
        var stocksValue = await _stockRepository.Query()
            .Where(s => s.UserId == userId).SumAsync(s => s.CurrentPrice * s.Quantity, ct);
        var realEstateValue = await _propertyRepository.Query()
            .Where(p => p.UserId == userId).SumAsync(p => p.CurrentValue, ct);
        var cashBalance = await _cashAccountRepository.Query()
            .Where(c => c.UserId == userId).SumAsync(c => c.Balance, ct);
        var loansTotal = await _loanRepository.Query()
            .Where(l => l.UserId == userId).SumAsync(l => l.RemainingBalance, ct);

        var totalAssets = stocksValue + realEstateValue + cashBalance;

        return new NetWorthDto
        {
            TotalAssets = totalAssets,
            TotalLiabilities = loansTotal,
            NetWorth = totalAssets - loansTotal,
            StocksValue = stocksValue,
            RealEstateValue = realEstateValue,
            CashValue = cashBalance,
            LoansTotal = loansTotal
        };
    }

    public async Task<CashFlowDto> GetMonthlyCashFlowAsync(Guid userId, int year, int month, CancellationToken ct = default)
    {
        var monthStart = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var monthEnd = monthStart.AddMonths(1);

        var transactions = await _transactionRepository.Query()
            .Where(t => t.UserId == userId && t.TransactionDate >= monthStart && t.TransactionDate < monthEnd)
            .ToListAsync(ct);

        var totalIncome = transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
        var totalExpenses = transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);

        var incomeByCategory = transactions
            .Where(t => t.Type == TransactionType.Income)
            .GroupBy(t => t.Category)
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        var expensesByCategory = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .GroupBy(t => t.Category)
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        return new CashFlowDto
        {
            Year = year,
            Month = month,
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            NetCashFlow = totalIncome - totalExpenses,
            IncomeByCategory = incomeByCategory,
            ExpensesByCategory = expensesByCategory
        };
    }
}
