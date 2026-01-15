using System.Text;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using Scalar.AspNetCore;
using SportFriends.Features.Authentication.Repositories;
using SportFriends.Features.Authentication.Services;
using SportFriends.Shared.DTOs;
using SportFriends.Shared.Exceptions;
using ApplicationException = SportFriends.Shared.Exceptions.ApplicationException;
using ErrorResponse = SportFriends.Shared.DTOs.ErrorResponse;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment() || builder.Environment.IsEnvironment("Local"))
{
    builder.Configuration.AddUserSecrets<Program>();
}

// Get configuration
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "your-secret-key-must-be-at-least-32-characters-long";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "sportfriends-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "sportfriends-app";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Server=localhost;Port=5432;Database=sportfriends;User Id=sportfriends;Password=dev-password-change-in-prod;";

// Add services
builder.Services.AddFastEndpoints();

// Add Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = Encoding.ASCII.GetBytes(jwtSecret);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Add OpenApi
builder.Services.AddOpenApi();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:7237", "http://localhost:5016", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add repositories and services
builder.Services.AddScoped<IAuthRepository>(_ => new AuthRepository(connectionString));
builder.Services.AddScoped<IProfileRepository>(_ => new ProfileRepository(connectionString));
builder.Services.AddScoped<ISportsRepository>(_ => new SportsRepository(connectionString));
builder.Services.AddScoped<IJwtTokenService>(_ => new JwtTokenService(jwtSecret, jwtIssuer, jwtAudience));

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// FastEndpoints
app.UseFastEndpoints(config =>
{
    config.Endpoints.RoutePrefix = "api/v1";
});

// Health check endpoint
app.MapGet("/health", async () =>
{
    try
    {
        using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();
        await connection.CloseAsync();
        var health = new { status = "healthy", timestamp = DateTime.UtcNow, database = "healthy" };
        return Results.Ok(health);
    }
    catch (Exception ex)
    {
        var health = new { status = "unhealthy", timestamp = DateTime.UtcNow, database = $"unhealthy: {ex.Message}" };
        return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
})
    .WithName("Health");

// Global exception handling middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        ApiResponse<object?> response;

        switch (exception)
        {
            case ValidationException validationEx:
                context.Response.StatusCode = validationEx.StatusCode;
                response = ApiResponse<object?>.Failure(new ErrorResponse
                {
                    StatusCode = validationEx.StatusCode,
                    Code = validationEx.Code,
                    Message = validationEx.Message,
                    FieldErrors = validationEx.Errors,
                    Details = null, // Don't include details for validation errors
                    Timestamp = DateTime.UtcNow
                });
                break;

            case ApplicationException appEx:
                context.Response.StatusCode = appEx.StatusCode;
                response = ApiResponse<object?>.Failure(new ErrorResponse
                {
                    StatusCode = appEx.StatusCode,
                    Code = appEx.Code,
                    Message = appEx.Message,
                    Details = app.Environment.IsDevelopment() ? exception?.StackTrace : null,
                    Timestamp = DateTime.UtcNow
                });
                break;

            default:
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                response = ApiResponse<object?>.Failure(new ErrorResponse
                {
                    StatusCode = (int)System.Net.HttpStatusCode.InternalServerError,
                    Code = "INTERNAL_ERROR",
                    Message = "An unexpected error occurred",
                    Details = app.Environment.IsDevelopment() ? exception?.Message : null,
                    Timestamp = DateTime.UtcNow
                });
                break;
        }

        context.Response.ContentType = System.Net.Mime.MediaTypeNames.Application.Json;
        await context.Response.WriteAsJsonAsync(response);
    });
});

await app.RunAsync();

