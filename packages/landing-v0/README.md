# HyprSQRL Landing Page

This is the main marketing website and user onboarding platform for HyprSQRL, built with Next.js using the App Router.

## Features

- Modern landing page with responsive design
- Product showcase and feature descriptions
- Waitlist form for interested users
- Roadmap and upcoming features
- Privacy and terms pages

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

- `app/(landing)` - Main landing page routes and components
- `app/(landing)/components` - Landing page UI components
- `app/(landing)/data` - Static data for integrations and features
- `app/(landing)/demo` - Interactive product demo components
- `app/privacy` - Privacy policy page
- `app/terms` - Terms of service page
- `app/roadmap` - Product roadmap page
- `components` - Shared UI components
- `public` - Static assets (images, icons, etc.)

## Design Tokens and Styling

This project uses Tailwind CSS for styling with a custom theme configuration. The UI components are built using shadcn/ui, a collection of reusable components built on top of Radix UI primitives.

## Contributing

If you're making changes to the landing page:

1. Update content in `app/(landing)/page.tsx` for main page content
2. Add new components in `app/(landing)/components`
3. Update integration data in `app/(landing)/data/integrations.ts`
4. Modify the theme in `tailwind.config.ts`