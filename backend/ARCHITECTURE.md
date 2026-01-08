# Modular Monolith Architecture Implementation

## ✅ Completed

### 1. **SportFriends.Shared** - Shared Foundation Library
Contains reusable code across all features:

**Entities:**
- `Entity` - Base class with Id, CreatedAt, UpdatedAt
- `User` - User account with auth fields
- `Profile` - User profile data

**DTOs:**
- `ApiResponse<T>` - Standard HATEOAS response wrapper
- `ResponseMeta` - Pagination metadata
- `ErrorResponse` - Error details
- `PaginatedRequest` & `PaginatedResponse<T>` - Pagination helpers

**Exceptions:**
- `ApplicationException` - Base exception with Code + StatusCode
- `ValidationException` - Field validation errors
- `NotFoundException`, `ConflictException`, `UnauthorizedException`, `ForbiddenException`, `RateLimitExceededException`

### 2. **SportFriends.Features.Authentication** - First Feature Module
Complete vertical slice example:

**DTOs:**
- `RegisterRequest`, `LoginRequest`, `RefreshTokenRequest`
- `AuthResponse`, `CurrentUserResponse`

**Commands (MediatR):**
- `RegisterUserCommand` - New user registration
- `LoginUserCommand` - User login
- `RefreshTokenCommand` - Token refresh

**Handlers (MediatR):**
- `RegisterUserHandler` - Business logic for registration
- `LoginUserHandler` - Business logic for login
- `RefreshTokenHandler` - Token refresh (TODO)

**Services:**
- `IJwtTokenService` / `JwtTokenService` - JWT generation + validation
  - `GenerateAccessToken()` - Create JWT with claims
  - `GenerateRefreshToken()` - Create refresh token
  - `ValidateToken()` - Validate JWT
  - `GetUserIdFromToken()` - Extract user ID from token

**Repository:**
- `IAuthRepository` / `AuthRepository` - User database operations (Dapper)
  - `GetUserByEmailAsync()`
  - `CreateUserAsync()`
  - `EmailExistsAsync()`
  - `UpdateLastLoginAsync()`

**FastEndpoints:**
- `RegisterEndpoint` - POST /api/v1/auth/register (201 Created)
- `LoginEndpoint` - POST /api/v1/auth/login (200 OK)
- `RefreshTokenEndpoint` - POST /api/v1/auth/refresh (200 OK)
- `GetCurrentUserEndpoint` - GET /api/v1/auth/me (requires JWT)

### 3. **Updated SportFriends.API** - Thin HTTP Layer
- Removed Controllers (replaced with FastEndpoints)
- Added FastEndpoints configuration
- Added MediatR registration
- Added JWT Bearer authentication
- Added global exception handling middleware
- Added CORS with localhost whitelist
- Added Swagger/OpenAPI

## 📁 Project Structure

```
backend/
├── SportFriends.API/                      (HTTP entry point)
│   ├── Program.cs                         (DI + middleware setup)
│   ├── appsettings.json                   (JWT config)
│   └── SportFriends.API.csproj
│
├── SportFriends.Shared/                   (Cross-cutting concerns)
│   ├── Entities/                          (Domain models)
│   │   ├── Entity.cs                      (Base class)
│   │   └── User.cs                        (User + Profile entities)
│   ├── DTOs/                              (Data transfer objects)
│   │   └── ApiResponse.cs                 (HATEOAS response + error format)
│   ├── Exceptions/                        (Custom exceptions)
│   │   └── ApplicationExceptions.cs       (App + specific exceptions)
│   └── SportFriends.Shared.csproj
│
├── SportFriends.Features.Authentication/  (First feature: Auth)
│   ├── Commands/                          (MediatR commands)
│   │   └── AuthCommands.cs                (Register, Login, Refresh)
│   ├── Handlers/                          (MediatR handlers)
│   │   └── AuthHandlers.cs                (Business logic)
│   ├── DTOs/                              (Auth-specific DTOs)
│   │   └── AuthDtos.cs                    (Requests + Responses)
│   ├── Services/                          (Domain services)
│   │   └── JwtTokenService.cs             (JWT operations)
│   ├── Repositories/                      (Data access)
│   │   └── AuthRepository.cs              (Dapper user queries)
│   ├── Endpoints/                         (FastEndpoints)
│   │   └── AuthEndpoints.cs               (HTTP routes)
│   └── SportFriends.Features.Authentication.csproj
│
├── SportFriends.Features.Events/          (TODO: Next feature)
├── SportFriends.Features.Discovery/       (TODO)
├── SportFriends.Features.Friends/         (TODO)
├── SportFriends.Features.Marketplace/     (TODO)
├── SportFriends.Features.Messaging/       (TODO)
├── SportFriends.Features.Feed/            (TODO)
├── SportFriends.Features.Notifications/   (TODO)
│
└── SportFriends.sln
```

## 🔄 Request Flow Example

```
HTTP Request: POST /api/v1/auth/login
    ↓
FastEndpoints.LoginEndpoint
    ↓
MediatR.Send(LoginUserCommand)
    ↓
LoginUserHandler
    ├→ IAuthRepository.GetUserByEmailAsync()  [Dapper query]
    ├→ BCrypt.Verify()
    ├→ IJwtTokenService.GenerateAccessToken()
    └→ AuthResponse (with JWT)
    ↓
ApiResponse<AuthResponse> (HATEOAS wrapped)
    ↓
HTTP Response: 200 OK with tokens
```

## 🛠️ How to Add a New Feature

1. **Create new class library:**
   ```bash
   dotnet new classlib -n SportFriends.Features.YourFeature
   ```

2. **Add feature project references:**
   ```xml
   <ProjectReference Include="../SportFriends.Shared/SportFriends.Shared.csproj" />
   ```

3. **Create folders structure:**
   - Commands/ (MediatR commands)
   - Handlers/ (Command handlers)
   - Queries/ (MediatR queries)
   - QueryHandlers/ (Query handlers)
   - DTOs/ (Data transfer objects)
   - Services/ (Business logic)
   - Repositories/ (Data access)
   - Endpoints/ (FastEndpoints)

4. **Wire up in API Program.cs:**
   ```csharp
   config.RegisterServicesFromAssemblyContaining<YourFeature.Commands.YourCommand>();
   ```

5. **Example: Create an Event**

   **Command:**
   ```csharp
   public class CreateEventCommand : IRequest<EventResponse>
   {
       public required string Title { get; set; }
       public required Guid SportId { get; set; }
       public required DateTime StartTime { get; set; }
   }
   ```

   **Handler:**
   ```csharp
   public class CreateEventHandler : IRequestHandler<CreateEventCommand, EventResponse>
   {
       public async Task<EventResponse> Handle(CreateEventCommand request, CancellationToken ct)
       {
           var @event = new Event { /* ... */ };
           await _eventRepository.CreateAsync(@event);
           return _mapper.Map<EventResponse>(@event);
       }
   }
   ```

   **Endpoint:**
   ```csharp
   public class CreateEventEndpoint : Endpoint<CreateEventRequest, ApiResponse<EventResponse>>
   {
       public override void Configure()
       {
           Post("/events");
           RequireAuthorization();
       }

       public override async Task HandleAsync(CreateEventRequest req, CancellationToken ct)
       {
           var result = await _mediator.Send(new CreateEventCommand { /* ... */ }, ct);
           var response = ApiResponse<EventResponse>.Success(result);
           await SendCreatedAtAsync($"/api/v1/events/{result.Id}", response, cancellation: ct);
       }
   }
   ```

## 📋 Key Design Patterns Used

| Pattern | Implementation | Benefit |
|---------|---|---|
| **Vertical Slices** | One feature = one class library | Clear boundaries, easy to understand |
| **MediatR CQRS** | Commands/Queries → Handlers | Business logic testable, decoupled |
| **FastEndpoints** | Endpoint per route | Strongly typed, minimal HTTP setup |
| **Repository** | Dapper in feature repos | Data access encapsulated per feature |
| **Service Layer** | JwtTokenService, etc. | Reusable domain logic |
| **Exception Handling** | Custom exceptions with codes | Standardized error responses |
| **HATEOAS** | ApiResponse wrapper | RESTful API links |

## ⚙️ Configuration

**appsettings.json must include:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=postgres;Port=5432;Database=sportfriends;User Id=sportfriends;Password=password;"
  },
  "Jwt": {
    "Secret": "your-super-secret-key-at-least-32-chars",
    "Issuer": "sportfriends-api",
    "Audience": "sportfriends-app",
    "ExpirationMinutes": 60
  }
}
```

## 🚀 Next Steps

1. **Run migrations:** `./backend/infrastructure/migrations/run-migrations.sh local up`
2. **Build solution:** `dotnet build`
3. **Run API:** `dotnet run --project backend/SportFriends.API`
4. **Test endpoints:** Visit `http://localhost:5000/swagger`

5. **Create remaining features:**
   - Events (CRUD, search, nearby)
   - Discovery (user search, recommendations)
   - Friends (friend requests, management)
   - Marketplace (listings, search)
   - Messaging (conversations, messages)
   - Feed (posts, comments, likes)
   - Notifications (user notifications)
