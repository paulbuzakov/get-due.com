using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Properties;

public record CreatePropertyRequest
{
    public required string Name { get; init; }
    public required string Address { get; init; }
    public decimal PurchasePrice { get; init; }
    public decimal CurrentValue { get; init; }
    public DateTime PurchaseDate { get; init; }
    public Currency Currency { get; init; }
    public string? Notes { get; init; }
}
