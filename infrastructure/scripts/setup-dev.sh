#!/bin/bash

# SportFriends local development setup script
# Run this after cloning the repository

set -e

echo "🏌️ Setting up SportFriends development environment..."

# Check prerequisites
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed. Please install Podman."
    exit 1
fi

if ! command -v podman-compose &> /dev/null; then
    echo "❌ Podman Compose is not installed. Please install Podman Compose."
    exit 1
fi

echo "✅ Podman and Podman Compose found"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration (especially Azure credentials)"
else
    echo "✅ .env file already exists"
fi

# Start services
echo "� Starting Podman containers..."
podman-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

if podman-compose exec -T postgres pg_isready -U sportfriends > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "⚠️  PostgreSQL is starting up, this may take a moment..."
fi

if podman-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "⚠️  Redis is starting up..."
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "  1. Update .env with your Azure credentials (if not already done)"
echo "  2. View logs: podman-compose logs -f"
echo "  3. Backend: http://localhost:5000"
echo "  4. Frontend: http://localhost:5173"
echo "  5. API Health: http://localhost:5000/health"
echo ""
echo "💡 Useful commands:"
echo "  - Stop services:     podman-compose down"
echo "  - View logs:         podman-compose logs -f [service]"
echo "  - API health check:  curl http://localhost:5000/health"
echo "  - Run migrations:    podman-compose exec api dotnet ef database update"
echo "  - Run tests:         podman-compose exec api dotnet test"
echo ""
