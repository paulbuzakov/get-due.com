using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GetDue.Application.DTOs.Auth;
using GetDue.Application.DTOs.Users;
using GetDue.Application.Interfaces;
using GetDue.Domain.Entities;
using GetDue.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GetDue.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;

    public AuthService(
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        IConfiguration configuration
    )
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _configuration = configuration;
    }

    public async Task<AuthResult> RegisterAsync(
        RegisterRequest request,
        CancellationToken ct = default
    )
    {
        var existingUser = await _userRepository
            .Query()
            .FirstOrDefaultAsync(u => u.Email == request.Email, ct);

        if (existingUser is not null)
            throw new InvalidOperationException("A user with this email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
        };

        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
            int.Parse(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7")
        );

        await _userRepository.AddAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var accessToken = GenerateJwtToken(user);
        var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationInMinutes"] ?? "60");

        return new AuthResult
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            User = MapToDto(user),
        };
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userRepository
            .Query()
            .FirstOrDefaultAsync(u => u.Email == request.Email, ct);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
            int.Parse(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7")
        );

        await _userRepository.UpdateAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var accessToken = GenerateJwtToken(user);
        var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationInMinutes"] ?? "60");

        return new AuthResult
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            User = MapToDto(user),
        };
    }

    public async Task<AuthResult> RefreshTokenAsync(
        string refreshToken,
        CancellationToken ct = default
    )
    {
        var user =
            await _userRepository
                .Query()
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, ct)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token has expired.");

        var newRefreshToken = GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
            int.Parse(_configuration["Jwt:RefreshTokenExpirationInDays"] ?? "7")
        );

        await _userRepository.UpdateAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var accessToken = GenerateJwtToken(user);
        var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationInMinutes"] ?? "60");

        return new AuthResult
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            User = MapToDto(user),
        };
    }

    private string GenerateJwtToken(User user)
    {
        var secret =
            _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("JWT secret is not configured.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationInMinutes"] ?? "60");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.GivenName, user.FirstName),
            new Claim(ClaimTypes.Surname, user.LastName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private static UserDto MapToDto(User user) =>
        new()
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            DefaultCurrency = user.DefaultCurrency,
        };
}
