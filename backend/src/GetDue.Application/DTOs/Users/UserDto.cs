using GetDue.Domain.Enums;

namespace GetDue.Application.DTOs.Users;

public record UserDto
{
    public Guid Id { get; init; }
    public required string Email { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public Currency DefaultCurrency { get; init; }
}
