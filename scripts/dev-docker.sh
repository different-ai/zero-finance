#!/bin/bash

# Development Docker Script for Zero Finance
# Handles port conflicts by finding available ports

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is available
is_port_available() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to find next available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while ! is_port_available $port; do
        port=$((port + 1))
        if [ $port -gt $((start_port + 100)) ]; then
            echo -e "${RED}Error: Could not find available port near $start_port${NC}"
            exit 1
        fi
    done
    
    echo $port
}

# Default ports
WEB_PORT=3050
DEEP_YIELD_PORT=3060

# Check and find available ports
echo -e "${BLUE}Checking port availability...${NC}"

if ! is_port_available $WEB_PORT; then
    NEW_WEB_PORT=$(find_available_port $WEB_PORT)
    echo -e "${YELLOW}Port $WEB_PORT is in use, using port $NEW_WEB_PORT for web service${NC}"
    WEB_PORT=$NEW_WEB_PORT
else
    echo -e "${GREEN}Port $WEB_PORT is available for web service${NC}"
fi

if ! is_port_available $DEEP_YIELD_PORT; then
    NEW_DEEP_YIELD_PORT=$(find_available_port $DEEP_YIELD_PORT)
    echo -e "${YELLOW}Port $DEEP_YIELD_PORT is in use, using port $NEW_DEEP_YIELD_PORT for deep-yield service${NC}"
    DEEP_YIELD_PORT=$NEW_DEEP_YIELD_PORT
else
    echo -e "${GREEN}Port $DEEP_YIELD_PORT is available for deep-yield service${NC}"
fi

# Create a temporary docker-compose override file
OVERRIDE_FILE="docker-compose.override.yml"

cat > $OVERRIDE_FILE << EOF
version: '3.8'

services:
  web:
    ports:
      - "$WEB_PORT:3050"
    
  deep-yield:
    ports:
      - "$DEEP_YIELD_PORT:3060"
EOF

echo -e "${BLUE}Created $OVERRIDE_FILE with available ports${NC}"

# Parse command line arguments
COMMAND=${1:-"up"}

case $COMMAND in
    "up"|"start")
        echo -e "${GREEN}Starting Zero Finance development environment...${NC}"
        echo -e "${BLUE}Web app will be available at: http://localhost:$WEB_PORT${NC}"
        echo -e "${BLUE}Deep Yield app will be available at: http://localhost:$DEEP_YIELD_PORT${NC}"
        docker-compose up -d
        ;;
    "down"|"stop")
        echo -e "${YELLOW}Stopping Zero Finance development environment...${NC}"
        docker-compose down
        ;;
    "logs")
        SERVICE=${2:-""}
        if [ -n "$SERVICE" ]; then
            docker-compose logs -f $SERVICE
        else
            docker-compose logs -f
        fi
        ;;
    "rebuild")
        echo -e "${YELLOW}Rebuilding containers...${NC}"
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        ;;
    "clean")
        echo -e "${YELLOW}Cleaning up containers and images...${NC}"
        docker-compose down -v --rmi all
        ;;
    "shell")
        SERVICE=${2:-"web"}
        echo -e "${BLUE}Opening shell in $SERVICE container...${NC}"
        docker-compose exec $SERVICE sh
        ;;
    *)
        echo -e "${RED}Usage: $0 {up|down|logs|rebuild|clean|shell} [service]${NC}"
        echo -e "${BLUE}Commands:${NC}"
        echo -e "  up/start    - Start the development environment"
        echo -e "  down/stop   - Stop the development environment" 
        echo -e "  logs [svc]  - Show logs (optionally for specific service)"
        echo -e "  rebuild     - Rebuild containers from scratch"
        echo -e "  clean       - Remove all containers and images"
        echo -e "  shell [svc] - Open shell in container (default: web)"
        exit 1
        ;;
esac

# Cleanup override file on exit (except for up command)
if [ "$COMMAND" != "up" ] && [ "$COMMAND" != "start" ]; then
    if [ -f "$OVERRIDE_FILE" ]; then
        rm -f "$OVERRIDE_FILE"
        echo -e "${BLUE}Cleaned up $OVERRIDE_FILE${NC}"
    fi
fi 