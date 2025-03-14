# HyprSQRL Invoice Web App

This package contains the web application for HyprSQRL's crypto invoicing system, built with Next.js, Request Network, and Clerk for authentication.

## Features

- Create and manage crypto invoices
- Request Network integration for decentralized invoicing
- Receive payments in EURe (Gnosis Chain) and USDC (Ethereum)
- Clerk authentication for secure user access
- AI-powered invoice chat assistant
- Responsive UI with Tailwind CSS and shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- PostgreSQL database (local or hosted)

### Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
pnpm db:generate
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at [http://localhost:3050](http://localhost:3050).

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

- `src/app` - Next.js application routes
  - `dashboard` - Protected user dashboard
  - `create-invoice` - Invoice creation flow
  - `invoice` - Public invoice viewing
  - `api` - Backend API endpoints
- `src/components` - Reusable UI components
  - `invoice` - Invoice-related components
  - `payment` - Payment processing components
  - `auth` - Authentication components
  - `ui` - Shared UI elements
- `src/lib` - Core libraries and utilities
  - `request-network.ts` - Request Network integration
  - `ephemeral-key-service.ts` - Key management
  - `utils` - Shared utility functions
- `src/db` - Database schema and connection

## API Routes

- `/api/invoices` - Invoice management
- `/api/invoice-chat` - AI-powered invoice assistant
- `/api/user` - User profile and settings
- `/api/wallet` - Wallet and address management
- `/api/ephemeral-keys` - Key management for signing

## Current Development Focus

- Adding support for mainnet USDC payments
- Implementing fiat payment options via Monerium
- Integrating with Gnosis Chain
- Enhancing AI features for invoice management