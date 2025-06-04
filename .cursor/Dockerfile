# Use Node.js 22.11.0 as specified in package.json engines
FROM node:22.11.0-alpine

# Install necessary tools for better compatibility
RUN apk add --no-cache libc6-compat git bash python3 make g++

# Set working directory
WORKDIR /app

# Install pnpm with the exact version from package.json
RUN npm install -g pnpm@9.15.4

# Copy package manager files first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files from packages for dependency resolution
COPY packages/*/package.json ./packages/*/

# Install dependencies - use regular install to handle outdated lockfile
# This will update the lockfile if needed and is more reliable for development
RUN pnpm install

# Copy the rest of the application
COPY . .

# Set environment variables with default ports
ENV PORT_WEB=3050
ENV PORT_DEEP_YIELD=3060
ENV NODE_ENV=development

# Expose the ports (these can be overridden when running the container)
EXPOSE 3050 3060

# Add labels for better container management
LABEL maintainer="zero-finance"
LABEL description="Zero Finance Development Environment"

# Default command for development
CMD ["pnpm", "dev"] 