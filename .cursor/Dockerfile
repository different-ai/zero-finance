# Use Node.js 22.11.0 as specified in package.json engines
FROM node:22.11.0-alpine

# Install basic tools and GUI dependencies in separate layers for better debugging
RUN apk add --no-cache \
    libc6-compat \
    git \
    bash \
    python3 \
    make \
    g++ \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/*

# Install Playwright system dependencies with correct Alpine package names
RUN apk add --no-cache \
    glib \
    nss \
    freetype \
    harfbuzz \
    libatk-1.0 \
    libatk-bridge-2.0 \
    cups-dev \
    libdrm \
    libxcomposite \
    libxdamage \
    libxrandr \
    mesa-gbm \
    libxscrnsaver \
    alsa-lib \
    xvfb \
    chromium \
    firefox \
    font-noto-emoji \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create a dummy apt-get to prevent post-install scripts from failing
RUN echo '#!/bin/bash\necho "apt-get intercepted, skipping..."' > /usr/local/bin/apt-get && \
    chmod +x /usr/local/bin/apt-get

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

# Playwright environment variables for headless operation
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
ENV DISPLAY=:99

# Expose the ports (these can be overridden when running the container)
EXPOSE 3050 3060

# Add labels for better container management
LABEL maintainer="zero-finance"
LABEL description="Zero Finance Development Environment"

# Default command for development
CMD ["pnpm", "dev"] 