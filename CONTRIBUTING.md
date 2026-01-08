# Contributing to SportFriends

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Follow the development setup in [README.md](./README.md)

## Development Workflow

### Code Style

**Backend (C#)**:
- Follow Microsoft C# Coding Conventions
- Use PascalCase for class/method names
- Use camelCase for variables
- Format with `dotnet format`

**Frontend (TypeScript)**:
- Use Prettier for formatting
- ESLint for linting
- camelCase for variables/functions
- PascalCase for components/classes

### Commits

Use conventional commits:
```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
test: add user service tests
chore: update dependencies
```

### Pull Requests

1. Create PR from your feature branch
2. Fill in the PR template
3. Link related issues
4. Ensure all checks pass:
   - Tests pass
   - Linting passes
   - No TypeScript errors
5. Request review from maintainers

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/user-profiles

# Make changes and commit
git add .
git commit -m "feat: implement user profile endpoints"

# Push to remote
git push origin feature/user-profiles

# Create Pull Request on GitHub
```

## API Development

### Adding a New Endpoint

1. **Define in shared types** (`/shared/types/csharp/SharedTypes.cs`):
```csharp
public class UserProfileDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    // ...
}
```

2. **Create controller** (`/backend/SportFriends.API/Controllers/UsersController.cs`):
```csharp
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserProfileDto>> GetUser(string id)
    {
        // Implementation
    }
}
```

3. **Add service** (`/backend/SportFriends.Core/Services/UserService.cs`):
```csharp
public interface IUserService
{
    Task<UserProfile> GetUserAsync(string id);
}

public class UserService : IUserService
{
    public async Task<UserProfile> GetUserAsync(string id)
    {
        // Implementation
    }
}
```

4. **Update frontend** (`/frontend/src/services/api.ts`):
```typescript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const userApi = {
  getUser: (id: string) => apiClient.get<UserProfile>(`/users/${id}`),
}
```

### Testing

**Backend**:
```bash
docker-compose exec api dotnet test
```

**Frontend**:
```bash
docker-compose exec web npm test
```

## Database Changes

### Creating Migrations

```bash
# From inside container
docker-compose exec api dotnet ef migrations add NameOfMigration --project SportFriends.Data

# Apply migration
docker-compose exec api dotnet ef database update
```

### Migration Naming

- `AddUserTable`
- `AddUserIndexes`
- `RenameUserColumn`
- `AddForeignKeyConstraints`

## Review Checklist

Before submitting for review, ensure:

- [ ] Feature works as expected
- [ ] Tests are written and passing
- [ ] No console errors/warnings
- [ ] Code follows style guidelines
- [ ] Shared types are updated (if API changes)
- [ ] Documentation is updated
- [ ] No sensitive information in commits
- [ ] Commits are logically organized

## Questions?

Check the [technical documentation](./docs/technical/technical-specification.md) or open an issue on GitHub.
