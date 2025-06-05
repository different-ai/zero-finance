# Use Node.js 22.11.0 as specified in package.json engines
FROM node:22.11.0-alpine

# Install only essential tools needed for Node.js development
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

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy only the web package.json since that's all we need
COPY packages/web/package.json ./packages/web/

# Install pnpm and dependencies
RUN npm install -g pnpm@9.15.4 && pnpm install --frozen-lockfile

# Copy only the web package source code
COPY packages/web ./packages/web/

# Copy any shared configs that might be needed
COPY tsconfig.json ./

# Build the web application
RUN pnpm --filter web build

# Expose port for web (3050)
EXPOSE 3050

# Default command to run the web application
CMD ["pnpm", "--filter", "web", "dev"] 