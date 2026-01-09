using System.Text;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using SportFriends.Features.Authentication.Repositories;
using SportFriends.Features.Authentication.Services;
using SportFriends.Shared.DTOs;
using ApplicationException = SportFriends.Shared.Exceptions.ApplicationException;
using ErrorResponse = SportFriends.Shared.DTOs.ErrorResponse;

var builder = WebApplication.CreateBuilder(args);

// Get configuration
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "your-secret-key-must-be-at-least-32-characters-long";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "sportfriends-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "sportfriends-app";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Server=localhost;Port=5432;Database=sportfriends;User Id=sportfriends;Password=password;";

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

// Add Swagger
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add repositories and services
builder.Services.AddScoped<IAuthRepository>(_ => new AuthRepository(connectionString));
builder.Services.AddScoped<IJwtTokenService>(_ => new JwtTokenService(jwtSecret, jwtIssuer, jwtAudience));

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
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
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
    .WithName("Health");

// Global exception handling middleware
app.UseExceptionHandler((errorApp) =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        ApiResponse<object?> response;
        
        switch (exception)
        {
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
                    StatusCode = 500,
                    Code = "INTERNAL_ERROR",
                    Message = "An unexpected error occurred",
                    Details = app.Environment.IsDevelopment() ? exception?.Message : null,
                    Timestamp = DateTime.UtcNow
                });
                break;
        }

        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(response);
    });
});

app.Run();

