using GetDue.Application.DTOs.Auth;

namespace GetDue.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResult> RefreshTokenAsync(string refreshToken, CancellationToken ct = default);
}
