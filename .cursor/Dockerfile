# Use Node.js 22.11.0 as specified in package.json engines
FROM node:22.11.0-alpine

# Set working directory
WORKDIR /app

# Install pnpm with the exact version from package.json
RUN npm install -g pnpm@9.15.4

# Copy package manager files first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files from packages
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose common development ports
# 3050 for packages/web (main app)
# 3060 for packages/deep-yield
EXPOSE 3050 3060

# Set development environment
ENV NODE_ENV=development

# Default command for development
CMD ["pnpm", "dev"]