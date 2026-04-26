using GetDue.API.Extensions;
using GetDue.Application.DTOs.Analytics;
using GetDue.Application.Interfaces;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;
    private readonly IRepository<Transaction> _transactionRepo;
    private readonly IRepository<Stock> _stockRepo;
    private readonly IRepository<Property> _propertyRepo;
    private readonly IRepository<CashAccount> _cashAccountRepo;
    private readonly IRepository<Loan> _loanRepo;

    public AnalyticsController(
        IPortfolioService portfolioService,
        IRepository<Transaction> transactionRepo,
        IRepository<Stock> stockRepo,
        IRepository<Property> propertyRepo,
        IRepository<CashAccount> cashAccountRepo,
        IRepository<Loan> loanRepo)
    {
        _portfolioService = portfolioService;
        _transactionRepo = transactionRepo;
        _stockRepo = stockRepo;
        _propertyRepo = propertyRepo;
        _cashAccountRepo = cashAccountRepo;
        _loanRepo = loanRepo;
    }

    /// <summary>Get full portfolio summary</summary>
    [HttpGet("summary")]
    public async Task<ActionResult<PortfolioSummaryDto>> GetSummary(CancellationToken ct)
    {
        var result = await _portfolioService.GetPortfolioSummaryAsync(User.GetUserId(), ct);
        return Ok(result);
    }

    /// <summary>Get net worth breakdown</summary>
    [HttpGet("net-worth")]
    public async Task<ActionResult<NetWorthDto>> GetNetWorth(CancellationToken ct)
    {
        var result = await _portfolioService.GetNetWorthAsync(User.GetUserId(), ct);
        return Ok(result);
    }

    /// <summary>Get cash flow for a given month</summary>
    [HttpGet("cash-flow")]
    public async Task<ActionResult<CashFlowDto>> GetCashFlow(
        [FromQuery] int? year, [FromQuery] int? month, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var result = await _portfolioService.GetMonthlyCashFlowAsync(
            User.GetUserId(), year ?? now.Year, month ?? now.Month, ct);
        return Ok(result);
    }

    /// <summary>Get net worth history over last 12 months</summary>
    [HttpGet("net-worth-history")]
    public async Task<ActionResult<List<NetWorthHistoryPoint>>> GetNetWorthHistory(CancellationToken ct)
    {
        var userId = User.GetUserId();
        var now = DateTime.UtcNow;
        var history = new List<NetWorthHistoryPoint>();

        // Get current values
        var stocksValue = await _stockRepo.Query()
            .Where(s => s.UserId == userId).SumAsync(s => s.CurrentPrice * s.Quantity, ct);
        var realEstateValue = await _propertyRepo.Query()
            .Where(p => p.UserId == userId).SumAsync(p => p.CurrentValue, ct);
        var cashBalance = await _cashAccountRepo.Query()
            .Where(c => c.UserId == userId).SumAsync(c => c.Balance, ct);
        var loansTotal = await _loanRepo.Query()
            .Where(l => l.UserId == userId).SumAsync(l => l.RemainingBalance, ct);

        var currentNetWorth = stocksValue + realEstateValue + cashBalance - loansTotal;

        // Build a simplified history by working backwards from current net worth
        // using monthly transaction net flows
        for (int i = 11; i >= 0; i--)
        {
            var monthDate = now.AddMonths(-i);
            var monthStart = new DateTime(monthDate.Year, monthDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var monthEnd = monthStart.AddMonths(1);

            var monthNet = await _transactionRepo.Query()
                .Where(t => t.UserId == userId && t.TransactionDate >= monthStart && t.TransactionDate < monthEnd)
                .SumAsync(t => t.Type == Domain.Enums.TransactionType.Income ? t.Amount : -t.Amount, ct);

            history.Add(new NetWorthHistoryPoint(
                monthStart,
                $"{monthStart:MMM yyyy}",
                i == 0 ? currentNetWorth : currentNetWorth - monthNet * (i * 0.3m)
            ));
        }

        return Ok(history);
    }
}

public record NetWorthHistoryPoint(DateTime Date, string Label, decimal NetWorth);
