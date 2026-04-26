using GetDue.Application.DTOs.Users;

namespace GetDue.Application.DTOs.Auth;

public record AuthResult
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public DateTime ExpiresAt { get; init; }
    public required UserDto User { get; init; }
}
