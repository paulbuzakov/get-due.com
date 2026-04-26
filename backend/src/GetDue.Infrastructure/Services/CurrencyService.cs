using GetDue.Application.Interfaces;
using GetDue.Domain.Enums;

namespace GetDue.Infrastructure.Services;

// TODO: Integrate a real exchange rate API (e.g., Open Exchange Rates, Fixer.io, or ECB)
public class CurrencyService : ICurrencyService
{
    private static readonly Dictionary<Currency, decimal> UsdRates = new()
    {
        { Currency.USD, 1.0000m },
        { Currency.EUR, 0.9200m },
        { Currency.GBP, 0.7900m },
        { Currency.RUB, 92.5000m },
        { Currency.KZT, 455.0000m },
        { Currency.CHF, 0.8800m },
        { Currency.JPY, 154.5000m },
        { Currency.CNY, 7.2500m },
        { Currency.CAD, 1.3600m },
        { Currency.AUD, 1.5300m }
    };

    public Task<decimal> ConvertAsync(decimal amount, Currency from, Currency to, CancellationToken ct = default)
    {
        if (from == to) return Task.FromResult(amount);

        var fromRate = UsdRates[from];
        var toRate = UsdRates[to];
        var result = amount / fromRate * toRate;

        return Task.FromResult(Math.Round(result, 2));
    }

    public Task<Dictionary<Currency, decimal>> GetExchangeRatesAsync(Currency baseCurrency, CancellationToken ct = default)
    {
        var baseRate = UsdRates[baseCurrency];

        var rates = UsdRates
            .Where(kvp => kvp.Key != baseCurrency)
            .ToDictionary(kvp => kvp.Key, kvp => Math.Round(kvp.Value / baseRate, 4));

        return Task.FromResult(rates);
    }
}
