#!/bin/bash

# SportFriends local development setup script
# Run this after cloning the repository

set -e

echo "🏌️ Setting up SportFriends development environment..."

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Desktop."
    exit 1
fi

echo "✅ Docker and Docker Compose found"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration (especially Azure credentials)"
else
    echo "✅ .env file already exists"
fi

# Start services
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

if docker-compose exec -T postgres pg_isready -U sportfriends > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "⚠️  PostgreSQL is starting up, this may take a moment..."
fi

if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "⚠️  Redis is starting up..."
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "  1. Update .env with your Azure credentials (if not already done)"
echo "  2. View logs: docker-compose logs -f"
echo "  3. Backend: http://localhost:5000"
echo "  4. Frontend: http://localhost:5173"
echo "  5. API Docs: http://localhost:5000/swagger"
echo ""
echo "💡 Useful commands:"
echo "  - Stop services:     docker-compose down"
echo "  - View logs:         docker-compose logs -f [service]"
echo "  - Run migrations:    docker-compose exec api dotnet ef database update"
echo "  - Run tests:         docker-compose exec api dotnet test"
echo ""
