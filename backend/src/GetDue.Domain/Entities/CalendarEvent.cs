using GetDue.Domain.Common;
using GetDue.Domain.Enums;

namespace GetDue.Domain.Entities;

public class CalendarEvent : AuditableEntity
{
    public Guid UserId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime EventDate { get; set; }
    public CalendarEventType EventType { get; set; }
    public Guid? RelatedEntityId { get; set; }
    public bool IsCompleted { get; set; }

    public User User { get; set; } = null!;
}
