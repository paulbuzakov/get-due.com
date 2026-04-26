using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Calendar;

public record CalendarEventDto
{
    public Guid Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public DateTime EventDate { get; init; }
    public CalendarEventType EventType { get; init; }
    public Guid? RelatedEntityId { get; init; }
    public bool IsCompleted { get; init; }
}
