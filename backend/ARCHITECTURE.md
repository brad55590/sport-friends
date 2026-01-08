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
├── SportFriends.Features.Authentication.Tests/  (Unit + Integration tests)
│   ├── Unit/
│   │   ├── Services/
│   │   │   └── JwtTokenServiceTests.cs    (Token generation/validation)
│   │   └── Handlers/
│   │       └── AuthHandlersTests.cs       (Business logic tests)
│   ├── Integration/
│   │   ├── Endpoints/
│   │   │   └── AuthEndpointsTests.cs      (HTTP endpoint tests)
│   │   └── Repositories/
│   │       └── AuthRepositoryTests.cs     (Dapper query tests)
│   ├── Fixtures/
│   │   ├── AuthTestFixture.cs             (Setup/teardown)
│   │   └── DatabaseFixture.cs             (Test database)
│   └── SportFriends.Features.Authentication.Tests.csproj
│
├── SportFriends.Features.Events/          (TODO: Next feature)
├── SportFriends.Features.Events.Tests/    (TODO: Tests for Events)
├── SportFriends.Features.Discovery/       (TODO)
├── SportFriends.Features.Discovery.Tests/ (TODO)
├── SportFriends.Features.Friends/         (TODO)
├── SportFriends.Features.Friends.Tests/   (TODO)
├── SportFriends.Features.Marketplace/     (TODO)
├── SportFriends.Features.Marketplace.Tests/ (TODO)
├── SportFriends.Features.Messaging/       (TODO)
├── SportFriends.Features.Messaging.Tests/ (TODO)
├── SportFriends.Features.Feed/            (TODO)
├── SportFriends.Features.Feed.Tests/      (TODO)
├── SportFriends.Features.Notifications/   (TODO)
├── SportFriends.Features.Notifications.Tests/ (TODO)
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

## 🧪 Testing Strategy

Each feature has its own test project with 3 layers of testing:

### **Unit Tests** - Isolated component testing
Test business logic without dependencies (mocked):
- **Services Tests** - JWT generation, token validation, password hashing
- **Handler Tests** - MediatR command/query logic with mocked repositories
- **Exception Tests** - Custom exceptions and error scenarios

**Tools:** xUnit, Moq (mocking), FluentAssertions

**Example:**
```csharp
public class JwtTokenServiceTests
{
    private readonly JwtTokenService _sut;
    private const string TestSecret = "super-secret-key-32-characters-long!";

    public JwtTokenServiceTests()
    {
        _sut = new JwtTokenService(TestSecret);
    }

    [Fact]
    public void GenerateAccessToken_WithValidUser_ReturnsValidJwt()
    {
        // Arrange
        var user = new User { Id = Guid.NewGuid(), Email = "test@example.com", Role = "user" };

        // Act
        var token = _sut.GenerateAccessToken(user);

        // Assert
        token.Should().NotBeNullOrEmpty();
        var principal = _sut.ValidateToken(token);
        principal.Should().NotBeNull();
    }

    [Fact]
    public void ValidateToken_WithExpiredToken_ReturnsNull()
    {
        // Arrange
        var user = new User { Id = Guid.NewGuid(), Email = "test@example.com", Role = "user" };
        var token = _sut.GenerateAccessToken(user, expirationMinutes: -1); // Expired

        // Act
        var result = _sut.ValidateToken(token);

        // Assert
        result.Should().BeNull();
    }
}
```

### **Integration Tests** - Feature testing with test database

Test full feature flow including database (using TestContainer PostgreSQL):
- **Endpoint Tests** - HTTP requests/responses, status codes, response format
- **Repository Tests** - Dapper queries against test database
- **Handler Tests** - With real database transactions

**Tools:** xUnit, TestContainers (PostgreSQL), HttpClient, Respawn (DB reset)

**Example:**
```csharp
public class AuthEndpointsTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer;
    private readonly WebApplicationFactory<Program> _factory;
    private HttpClient _client;

    public AuthEndpointsTests()
    {
        _dbContainer = new PostgreSqlBuilder()
            .WithImage("postgres:16-alpine")
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
        // Run migrations against test DB
        await RunMigrationsAsync(_dbContainer.GetConnectionString());
        
        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("ConnectionStrings:DefaultConnection", 
                    _dbContainer.GetConnectionString());
            });
        
        _client = _factory.CreateClient();
    }

    public async Task DisposeAsync()
    {
        await _dbContainer.StopAsync();
        _factory.Dispose();
        _client.Dispose();
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsCreatedWithTokens()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "newuser@example.com",
            Password = "SecurePass123!",
            ConfirmPassword = "SecurePass123!",
            FirstName = "John",
            LastName = "Doe"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Created);
        var result = await response.Content.ReadAsAsync<ApiResponse<AuthResponse>>();
        result.Data.Should().NotBeNull();
        result.Data.AccessToken.Should().NotBeNullOrEmpty();
        result.Data.RefreshToken.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnConflict()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "existing@example.com",
            Password = "SecurePass123!",
            ConfirmPassword = "SecurePass123!",
            FirstName = "Jane",
            LastName = "Doe"
        };
        
        // Create first user
        await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Act - Try to register with same email
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Conflict);
        var result = await response.Content.ReadAsAsync<ApiResponse<object>>();
        result.Error.Code.Should().Be("DUPLICATE_EMAIL");
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsAccessToken()
    {
        // Arrange - Register user first
        var registerRequest = new RegisterRequest { /* ... */ };
        await _client.PostAsJsonAsync("/api/v1/auth/register", registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = "newuser@example.com",
            Password = "SecurePass123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        var result = await response.Content.ReadAsAsync<ApiResponse<AuthResponse>>();
        result.Data.AccessToken.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task GetCurrentUser_WithValidToken_ReturnsUserInfo()
    {
        // Arrange - Login to get token
        var loginResponse = await LoginAsync("test@example.com", "Password123!");
        var token = loginResponse.Data.AccessToken;
        
        _client.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/v1/auth/me");

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        var result = await response.Content.ReadAsAsync<ApiResponse<CurrentUserResponse>>();
        result.Data.Email.Should().Be("test@example.com");
    }

    [Fact]
    public async Task GetCurrentUser_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/auth/me");

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }
}
```

### **Test Project Structure**

```
SportFriends.Features.Authentication.Tests/
├── Unit/
│   ├── Services/
│   │   └── JwtTokenServiceTests.cs        (Token generation, validation)
│   ├── Handlers/
│   │   ├── RegisterUserHandlerTests.cs    (Registration logic)
│   │   ├── LoginUserHandlerTests.cs       (Login logic)
│   │   └── RefreshTokenHandlerTests.cs
│   └── Validators/
│       └── RegisterRequestValidatorTests.cs
│
├── Integration/
│   ├── Endpoints/
│   │   ├── RegisterEndpointTests.cs       (HTTP register endpoint)
│   │   ├── LoginEndpointTests.cs          (HTTP login endpoint)
│   │   └── GetCurrentUserEndpointTests.cs
│   ├── Repositories/
│   │   └── AuthRepositoryTests.cs         (Dapper queries)
│   └── AuthTestFixture.cs                 (Setup/teardown, DB container)
│
├── Fixtures/
│   ├── TestDataBuilder.cs                 (Fluent test data creation)
│   ├── AuthTestData.cs                    (Reusable test users)
│   └── Constants.cs                       (Test constants)
│
└── SportFriends.Features.Authentication.Tests.csproj
```

### **Test Project Setup**

**SportFriends.Features.Authentication.Tests.csproj:**
```xml
<ItemGroup>
  <PackageReference Include="xunit" Version="2.6.6" />
  <PackageReference Include="xunit.runner.visualstudio" Version="2.5.6" />
  <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.2" />
  <PackageReference Include="Moq" Version="4.20.70" />
  <PackageReference Include="FluentAssertions" Version="6.12.0" />
  <PackageReference Include="Testcontainers" Version="3.7.0" />
  <PackageReference Include="Testcontainers.PostgreSql" Version="3.7.0" />
  <PackageReference Include="Respawn" Version="5.1.1" />
</ItemGroup>

<ItemGroup>
  <ProjectReference Include="../SportFriends.Features.Authentication/SportFriends.Features.Authentication.csproj" />
</ItemGroup>
```

### **Running Tests**

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test backend/SportFriends.Features.Authentication.Tests

# Run with coverage
dotnet test /p:CollectCoverage=true

# Watch mode (auto-rerun on changes)
dotnet watch test --project backend/SportFriends.Features.Authentication.Tests
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
| **Test Fixtures** | xUnit IAsyncLifetime | Isolated test environments |
| **TestContainers** | PostgreSQL per test run | Real DB testing, no mocks |

## 🎯 Test Coverage Expectations

**Target Coverage by Feature Component:**

| Component | Target | Tools |
|-----------|--------|-------|
| **Services** | 95%+ | Unit tests with mocks |
| **Handlers** | 90%+ | Unit tests with mocked repos |
| **Endpoints** | 90%+ | Integration tests with TestContainers |
| **Repositories** | 85%+ | Integration tests with TestContainers |
| **Shared Code** | 85%+ | Unit tests with mocks |

**How Tests Contribute:**
- ✅ **Unit Tests** → Test business logic in isolation (fast, no DB needed)
- ✅ **Integration Tests** → Test full feature flow with real database
- ✅ **CI/CD** → Run all tests before deployment (GitHub Actions)

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
3. **Run tests:** `dotnet test`
4. **Run API:** `dotnet run --project backend/SportFriends.API`
5. **Test endpoints:** Visit `http://localhost:5000/swagger`

6. **Create remaining features** (with tests for each):
   - Events (CRUD, search, nearby)
   - Discovery (user search, recommendations)
   - Friends (friend requests, management)
   - Marketplace (listings, search)
   - Messaging (conversations, messages)
   - Feed (posts, comments, likes)
   - Notifications (user notifications)

## 📚 Additional Resources

- **MediatR Docs:** https://github.com/jbogard/MediatR
- **FastEndpoints Docs:** https://fast-endpoints.com/
- **xUnit Docs:** https://xunit.net/docs/getting-started
- **TestContainers:** https://testcontainers.com/
- **Vertical Slices Architecture:** https://jimmybogard.com/vertical-slice-architecture/
