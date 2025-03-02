# Build, Lint, and Test Commands

- Build: `pnpm build` (DB schema + migrate + Next.js build)
- Build local: `pnpm build:local` (Local DB migration + Next.js build)
- Dev: `pnpm dev` (PORT=3050 next dev --turbopack)
- Linting: `pnpm lint` (Next.js linting)
- Type checking: `pnpm ts:check` (TypeScript type checking)
- Database: `pnpm db:generate`, `pnpm db:push`, `pnpm db:studio`, `pnpm db:migrate`
- Tests: `pnpm test` (all tests), `pnpm test:watch` (watch mode)
- Single test: `pnpm test path/to/test-file.test.ts`

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