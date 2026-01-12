# SportFriends - Project Setup

## Quick Start with Podman

This project uses a **Podman-first approach**. All services (frontend, backend, database, cache) run in containers for consistent development environments.

### Prerequisites
- Podman (v4.0+) and Podman Compose
- Git

### Getting Started

#### Option 1: Automated Setup (Recommended)
```bash
# Runs all setup steps automatically
./infrastructure/scripts/setup-dev.sh
```

This will:
- Verify Podman is installed
- Create `.env` from template (if needed)
- Start all containerized services
- Check service health
- Display helpful commands

#### Option 2: Build & Start with API Publish
```bash
# Publishes the API project then starts services
./infrastructure/scripts/build-and-start.sh
```

This will:
- Publish the SportFriends.API project
- Start all containerized services
- Display service URLs and helpful commands

#### Option 3: Manual Start
```bash
cd sport-friends
cp .env.example .env
podman-compose up -d
```

Services will be available at:
- **Backend API**: http://localhost:5000
- **Frontend Web**: http://localhost:5173
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Azure Storage Emulator**: localhost:10000

3. **View Logs**
```bash
podman-compose logs -f api    # Backend logs
podman-compose logs -f web    # Frontend logs
```

4. **Check API Health**
```bash
curl http://localhost:5000/health
```

5. **Stop Services**
```bash
podman-compose down
```

---

## Repository Structure

### `/frontend`
React 18 + TypeScript + Vite web application
- Automatic hot-reload during development
- API client with proper typing
- Unit tests with Vitest

**Commands (inside container)**:
```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # Linting
npm test          # Run tests
```

### `/backend`
ASP.NET Core 8.0 REST API
- **SportFriends.API**: Main API project with controllers
- **SportFriends.Core**: Business logic & services
- **SportFriends.Data**: Data access & EF Core
- **SportFriends.Tests**: Unit & integration tests

**Commands (inside container)**:
```bash
dotnet run                    # Run API
dotnet test                   # Run tests
dotnet ef migrations add NAME # Create migration
```

### `/database`
Database migrations and seed data
- `/migrations`: Versioned SQL migration files
- `/seeds`: Sample data for development

### `/shared`
Shared types between frontend and backend
- `/shared/types/typescript`: TypeScript types
- `/shared/types/csharp`: C# DTOs & Enums

These are the **single source of truth** for API contracts.

### `/infrastructure`
Deployment & infrastructure code
- `/docker`: Containerfiles for each service (compatible with Podman)
- `/azure`: Azure Bicep templates & configurations
- `/scripts`: Deployment automation scripts

### `/docs`
Business and technical documentation

---

## API Versioning

We support **both URL-based and header-based versioning**:

### URL-Based (Preferred for public APIs)
```
GET /api/v1/users
GET /api/v2/users
```

### Header-Based (For additional flexibility)
```
GET /api/users
Header: API-Version: 1
```

**Implementation Details**:
- Controllers in `backend/SportFriends.API/Controllers/`
- Route: `[ApiController][Route("api/v{version:apiVersion}/[controller]")]`
- Swagger shows all API versions

---

## Developing Locally

### Adding a New Feature

1. **Update shared types** (if needed):
```bash
# Edit /shared/types/typescript/index.ts
# OR /shared/types/csharp/SharedTypes.cs
```

2. **Backend Development**:
```bash
# Changes to Program.cs or controllers automatically reload
# Edit files in /backend/SportFriends.API/

# Run migrations
podman-compose exec api dotnet ef migrations add FeatureName --project SportFriends.Data
podman-compose exec api dotnet ef database update
```

3. **Frontend Development**:
```bash
# Changes automatically hot-reload
# Edit files in /frontend/src/
```

4. **Test Locally**:
```bash
# API tests
podman-compose exec api dotnet test

# Frontend tests
podman-compose exec web npm test
```

---

## Debugging

### Backend (Visual Studio / VS Code)
1. Attach debugger to running container
2. Set breakpoints in Visual Studio

### Frontend
1. Open DevTools in browser (F12)
2. Set breakpoints in Sources tab

### Database
```bash
# Connect to PostgreSQL
podman-compose exec postgres psql -U sportfriends -d sportfriends

# View Redis cache
podman-compose exec redis redis-cli
```

---

## Environment Variables

Copy `.env.example` to `.env` and update:

```env
# Database
POSTGRES_PASSWORD=secure-password

# Backend
JWT_SECRET=your-jwt-secret
ASPNETCORE_ENVIRONMENT=Development

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=your-account
AZURE_STORAGE_ACCOUNT_KEY=your-key

# Frontend
VITE_API_URL=http://localhost:5000
VITE_API_VERSION=v1
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Or kill the process using the port
lsof -ti:5000 | xargs kill -9
```

### Database Connection Failed
```bash
# Wait for postgres to be ready
podman-compose logs postgres
# Should see "database system is ready to accept connections"
```

### Node Modules Issues
```bash
# Rebuild node_modules in container
podman-compose down
podman volume rm -a
podman-compose up --build
```

### Clear Podman Cache
```bash
podman system prune -a
podman-compose up --build
```

---

## Next Steps

1. **Configure Azure Credentials**: Add to `.env`
2. **Setup CI/CD**: Add GitHub Actions workflows
3. **Create Database Migrations**: Start with user schema
4. **Implement Authentication**: JWT token strategy
5. **Begin MVP Features**: User profiles, discovery, events

See `/docs` for detailed specifications.
