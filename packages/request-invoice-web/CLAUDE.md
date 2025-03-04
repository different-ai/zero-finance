# Build, Lint, and Test Commands

- Build: `pnpm build` (DB schema + migrate + Next.js build)
- Build local: `pnpm build:local` (Local DB migration + Next.js build)
- Dev: `pnpm dev` (PORT=3050 next dev --turbopack)
- Linting: `pnpm lint` (Next.js linting)
- Type checking: `pnpm ts:check` (TypeScript type checking)
- Database: `pnpm db:generate`, `pnpm db:push`, `pnpm db:studio`, `pnpm db:migrate`
- Tests: `pnpm test` (all tests), `pnpm test:watch` (watch mode)
- Single test: `pnpm test path/to/test-file.test.ts`

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