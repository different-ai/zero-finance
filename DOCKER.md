# Docker Development Setup for Zero Finance

This document explains how to use the Docker setup for Zero Finance development.

## Quick Start

### Option 1: Using the Development Script (Recommended)

The easiest way to start development with automatic port conflict resolution:

```bash
# Start the development environment
./scripts/dev-docker.sh up

# Stop the development environment
./scripts/dev-docker.sh down

# View logs
./scripts/dev-docker.sh logs

# View logs for specific service
./scripts/dev-docker.sh logs web
./scripts/dev-docker.sh logs deep-yield

# Rebuild containers (useful after dependency changes)
./scripts/dev-docker.sh rebuild

# Open shell in container
./scripts/dev-docker.sh shell web

# Clean up everything
./scripts/dev-docker.sh clean
```

### Option 2: Using Docker Compose Directly

```bash
# Start both services
docker-compose up -d

# Start specific service
docker-compose up -d web
docker-compose up -d deep-yield

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose build --no-cache
```

## Services

- **web**: Main web application (`packages/web`) - runs on port 3050
- **deep-yield**: Deep yield application (`packages/deep-yield`) - runs on port 3060

## Port Conflict Resolution

If ports 3050 or 3060 are already in use:

1. **Using the script**: Automatically finds available ports and updates configuration
2. **Manual override**: Create `docker-compose.override.yml`:

```yaml
version: '3.8'
services:
  web:
    ports:
      - "3051:3050"  # Use port 3051 instead of 3050
  deep-yield:
    ports:
      - "3061:3060"  # Use port 3061 instead of 3060
```

## Development Features

- **Hot Reloading**: Source code is mounted as volumes, changes trigger automatic reloads
- **Node Modules Optimization**: Node modules are excluded from volume mounts for better performance
- **Environment Variables**: Easily configurable through docker-compose environment variables

## Troubleshooting

### Build Issues

If you encounter build issues, try:

```bash
# Rebuild from scratch
./scripts/dev-docker.sh rebuild

# Or manually:
docker-compose build --no-cache
```

### Port Conflicts

```bash
# Check what's using the port
lsof -i :3050
lsof -i :3060

# Kill processes using the ports (be careful!)
kill -9 $(lsof -t -i:3050)
kill -9 $(lsof -t -i:3060)
```

### Permission Issues

If you encounter permission issues with volumes:

```bash
# Fix ownership (adjust user:group as needed)
sudo chown -R $(id -u):$(id -g) node_modules
```

### Lockfile Issues

If you get lockfile errors:

```bash
# Update lockfile locally then rebuild
pnpm install
./scripts/dev-docker.sh rebuild
```

## Environment Variables

Key environment variables you can override in `docker-compose.override.yml`:

```yaml
version: '3.8'
services:
  web:
    environment:
      - NODE_ENV=development
      - PORT=3050
      - DATABASE_URL=your_database_url
      # Add other environment variables as needed
```

## Notes

- The Docker setup uses Node.js 22.11.0 as specified in package.json
- pnpm 9.15.4 is used for package management
- Development mode includes all dev dependencies and tools
- Containers are configured to restart unless stopped manually 