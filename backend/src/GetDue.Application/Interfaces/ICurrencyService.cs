using GetDue.Domain.Enums;

namespace GetDue.Application.Interfaces;

public interface ICurrencyService
{
    Task<decimal> ConvertAsync(decimal amount, Currency from, Currency to, CancellationToken ct = default);
    Task<Dictionary<Currency, decimal>> GetExchangeRatesAsync(Currency baseCurrency, CancellationToken ct = default);
}
