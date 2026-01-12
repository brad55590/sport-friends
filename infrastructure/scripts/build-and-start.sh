#!/bin/bash

set -e

echo "📦 Publishing backend API..."
cd backend
dotnet publish src/SportFriends.API/SportFriends.API.csproj -c Release -o ./publish
cd ..

echo "🐳 Starting Podman Compose services..."
podman-compose up -d

echo "✅ Build and start complete!"
echo ""
echo "Services:"
echo "  - API: http://localhost:5000"
echo "  - Web: http://localhost:5173"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Azure Storage: localhost:10000-10002"
echo ""
echo "View logs: docker-compose logs -f"
