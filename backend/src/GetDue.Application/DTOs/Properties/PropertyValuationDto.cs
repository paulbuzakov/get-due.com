namespace GetDue.Application.DTOs.Properties;

public record PropertyValuationDto
{
    public Guid Id { get; init; }
    public Guid PropertyId { get; init; }
    public decimal Value { get; init; }
    public DateTime ValuationDate { get; init; }
    public string? Source { get; init; }
}
