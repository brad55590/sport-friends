#!/bin/bash
set -e

# Run database migrations for SportFriends
# Usage: ./run-migrations.sh [environment] [action]
# Examples:
#   ./run-migrations.sh local up      # Run all pending migrations
#   ./run-migrations.sh prod up       # Run all pending migrations against production

ENVIRONMENT=${1:-local}
ACTION=${2:-up}

# Load environment variables
if [ "$ENVIRONMENT" = "local" ]; then
    DB_HOST="${DB_HOST:-postgres}"
    DB_PORT="${DB_PORT:-5432}"
    DB_NAME="${DB_NAME:-sportfriends}"
    DB_USER="${DB_USER:-sportfriends}"
    DB_PASSWORD="${DB_PASSWORD:-password}"
else
    # For non-local environments, these should be set via env vars
    DB_HOST="${DB_HOST}"
    DB_PORT="${DB_PORT:-5432}"
    DB_NAME="${DB_NAME}"
    DB_USER="${DB_USER}"
    DB_PASSWORD="${DB_PASSWORD}"
fi

# Validate environment variables
if [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
    echo "Error: Missing required database environment variables"
    echo "Required: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MIGRATIONS_DIR="$SCRIPT_DIR"

echo "=========================================="
echo "SportFriends Database Migrations"
echo "=========================================="
echo "Environment: $ENVIRONMENT"
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"
echo "Action: $ACTION"
echo "=========================================="

# Function to check if migration has been applied
is_migration_applied() {
    local migration_name=$1
    local result=$(PGPASSWORD="$DB_PASSWORD" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -t -c "SELECT COUNT(*) FROM schema_migrations WHERE migration_name = '$migration_name';" 2>/dev/null || echo "0")
    [ "$result" = "1" ]
}

# Function to record applied migration
record_migration() {
    local migration_name=$1
    PGPASSWORD="$DB_PASSWORD" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -c "INSERT INTO schema_migrations (migration_name) VALUES ('$migration_name');" \
        >/dev/null 2>&1
}

# Function to run migration
run_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file")
    
    # Check if already applied
    if is_migration_applied "$migration_name"; then
        echo "✓ $migration_name (already applied)"
        return 0
    fi
    
    echo "→ Applying $migration_name..."
    
    # Run the migration
    if PGPASSWORD="$DB_PASSWORD" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -f "$migration_file" >/dev/null 2>&1; then
        
        # Record the migration
        record_migration "$migration_name"
        echo "✓ $migration_name (completed)"
        return 0
    else
        echo "✗ $migration_name (FAILED)"
        return 1
    fi
}

case "$ACTION" in
    up)
        # Run all pending migrations in order
        echo ""
        echo "Running pending migrations..."
        echo ""
        
        failed=0
        for migration_file in $(find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.sql" -type f | sort); do
            if ! run_migration "$migration_file"; then
                failed=$((failed + 1))
            fi
        done
        
        echo ""
        if [ $failed -eq 0 ]; then
            echo "=========================================="
            echo "✓ All migrations completed successfully!"
            echo "=========================================="
            exit 0
        else
            echo "=========================================="
            echo "✗ $failed migration(s) failed"
            echo "=========================================="
            exit 1
        fi
        ;;
    
    status)
        # Show migration status
        echo ""
        echo "Migration Status:"
        echo ""
        
        for migration_file in $(find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.sql" -type f | sort); do
            migration_name=$(basename "$migration_file")
            if is_migration_applied "$migration_name"; then
                echo "✓ $migration_name"
            else
                echo "○ $migration_name (pending)"
            fi
        done
        echo ""
        ;;
    
    *)
        echo "Unknown action: $ACTION"
        echo ""
        echo "Available actions:"
        echo "  up       - Run all pending migrations"
        echo "  status   - Show migration status"
        echo ""
        exit 1
        ;;
esac
