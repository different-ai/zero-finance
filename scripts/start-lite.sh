#!/bin/bash

# Zero Finance Lite Mode Starter
# One command to rule them all: ./scripts/start-lite.sh

set -e

echo "🚀 Starting Zero Finance in Lite Mode..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    echo "   On Mac: Start Docker Desktop or run 'colima start'"
    exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL database..."
docker-compose -f docker-compose.lite.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations
echo "🔄 Running database migrations..."
cd packages/web && pnpm db:migrate:lite

# Start the application
echo "✨ Starting Zero Finance on http://localhost:3055"
pnpm dev:lite

# Cleanup function
trap 'echo "🛑 Stopping database..."; docker-compose -f docker-compose.lite.yml down' EXIT