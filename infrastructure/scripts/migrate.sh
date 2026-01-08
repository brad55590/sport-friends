#!/bin/bash

# Database migration script
# Usage: ./migrate.sh [action]
# Actions: up, down, pending

set -e

ACTION=${1:-up}

case $ACTION in
  up)
    echo "⬆️  Applying pending migrations..."
    docker-compose exec api dotnet ef database update --project SportFriends.Data
    echo "✅ Migrations applied"
    ;;
  down)
    echo "⬇️  Removing last migration..."
    docker-compose exec api dotnet ef migrations remove --project SportFriends.Data
    echo "✅ Migration removed"
    ;;
  pending)
    echo "📋 Checking pending migrations..."
    docker-compose exec api dotnet ef migrations list --project SportFriends.Data
    ;;
  *)
    echo "❌ Unknown action: $ACTION"
    echo "Usage: ./migrate.sh [up|down|pending]"
    exit 1
    ;;
esac
