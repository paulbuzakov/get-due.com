using System.Text;
using GetDue.Application.Interfaces;
using GetDue.Domain.Interfaces;
using GetDue.Infrastructure.Jobs;
using GetDue.Infrastructure.Persistence;
using GetDue.Infrastructure.Repositories;
using GetDue.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Quartz;

namespace GetDue.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        // Database
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
        );

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPortfolioService, PortfolioService>();
        services.AddScoped<ICurrencyService, CurrencyService>();

        // JWT Authentication
        var jwtSecret =
            configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("JWT secret is not configured.");
        var jwtIssuer = configuration["Jwt:Issuer"];
        var jwtAudience = configuration["Jwt:Audience"];

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    ClockSkew = TimeSpan.Zero,
                };
            });

        // Quartz
        services.AddQuartz(q =>
        {
            var jobKey = new JobKey("RecurringPaymentJob");

            q.AddJob<RecurringPaymentJob>(opts => opts.WithIdentity(jobKey));

            q.AddTrigger(opts =>
                opts.ForJob(jobKey)
                    .WithIdentity("RecurringPaymentJob-trigger")
                    .WithCronSchedule("0 0 2 * * ?") // Daily at 2:00 AM UTC
            );
        });

        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        return services;
    }
}
