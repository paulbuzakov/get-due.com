using GetDue.Application.DTOs.Auth;
using GetDue.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GetDue.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    /// <summary>Register a new user</summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResult>> Register(RegisterRequest request, CancellationToken ct)
    {
        var result = await _authService.RegisterAsync(request, ct);
        return Ok(result);
    }

    /// <summary>Login with email and password</summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResult>> Login(LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, ct);
        return Ok(result);
    }

    /// <summary>Refresh access token</summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResult>> Refresh([FromBody] RefreshRequest request, CancellationToken ct)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken, ct);
        return Ok(result);
    }
}

public record RefreshRequest(string RefreshToken);
