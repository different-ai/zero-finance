# Project Overview

HyprSQRL is an all-in-one crypto financial hub for freelancers and businesses. The platform helps users collect payments, handle expenses, and maximize yield on earnings by bridging traditional finance and cryptocurrency.

Only use pnpm

## Current Goals
- Adding support for mainnet USDC payments
- Implementing fiat payment options
- Integrating with Gnosis Chain this week
- Building towards a personal finance application

## Web app is in /packages/web

# Build, Lint, and Test Commands

- Build: `pnpm build` (DB schema + migrate + Next.js build)
- Build local: `pnpm build:local` (Local DB migration + Next.js build)
- Dev: `pnpm dev` (PORT=3050 next dev --turbopack)
- Linting: `pnpm lint` (Next.js linting)
- Type checking: `pnpm ts:check` (TypeScript type checking)
- Database: `pnpm db:generate`, `pnpm db:push`, `pnpm db:studio`, `pnpm db:migrate`
- Tests: `pnpm test` (all tests), `pnpm test:watch` (watch mode)
- Single test: `pnpm test path/to/test-file.test.ts`

# Project Structure

- `/src/app` - Next.js application routes
  - `/dashboard` - Protected user dashboard
  - `/create-invoice` - Invoice creation flow
  - `/invoice` - Public invoice viewing
  - `/api` - Backend API endpoints
- `/src/components` - Reusable UI components
  - `/invoice` - Invoice-related components
  - `/payment` - Payment processing components
  - `/auth` - Authentication components
  - `/ui` - Shared UI elements
- `/src/lib` - Core libraries and utilities
  - `/request-network.ts` - Request Network integration
  - `/ephemeral-key-service.ts` - Key management
  - `/utils` - Shared utility functions
- `/src/db` - Database schema and connection

# Authentication

The application uses Clerk for authentication:
- Protected routes: `/dashboard/*`, `/create-invoice`
- Public routes: `/`, `/invoice/*`, `/sign-in`, `/sign-up`, `/api/ephemeral-keys/*`, `/api/invoices/*`
- Middleware: Configured in root `middleware.ts`
- Server-side auth: Use `import { auth, currentUser } from '@clerk/nextjs'`
- Client-side components: Use `import { useAuth, useUser } from '@clerk/nextjs'`
- Helper functions: Available in `@/lib/auth.ts`
- Auth guard component: `import { AuthGuard } from '@/components/auth'`

# Code Style Guidelines

- File naming: kebab-case
- Components: Functional components with PascalCase names
- Variables/functions: camelCase
- Imports: Group by type (React/framework, UI components, utilities)
- Types: Define explicit interfaces for props/data, use separate type files
- Error handling: Toast notifications, conditional rendering for error states
- Styling: Tailwind CSS with 2-space indentation
- Logging: Prefix with "0xHypr" (`console.log("0xHypr", 'variableName', variable)`)
- Return early pattern for error handling and code readability
- Use absolute imports with aliases (`@/lib/utils` not `../../../lib/utils`)