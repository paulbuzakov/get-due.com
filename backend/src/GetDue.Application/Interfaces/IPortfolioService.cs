using GetDue.Application.DTOs.Analytics;

namespace GetDue.Application.Interfaces;

public interface IPortfolioService
{
    Task<PortfolioSummaryDto> GetPortfolioSummaryAsync(Guid userId, CancellationToken ct = default);
    Task<NetWorthDto> GetNetWorthAsync(Guid userId, CancellationToken ct = default);
    Task<CashFlowDto> GetMonthlyCashFlowAsync(Guid userId, int year, int month, CancellationToken ct = default);
}
