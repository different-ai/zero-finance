// Catch-all ambient type declarations for packages that ship without TS types
// These declarations should be replaced with proper @types/… packages or typed modules once available.
declare module 'sonner' {
  const content: any;
  export = content;
}

declare module 'react-hotkeys-hook' {
  export function useHotkeys(...args: any[]): void;
  export function useHotkey(...args: any[]): void;
}

// We will comment lines for these modules to disable.
// delete stub sections

declare module '@tanstack/react-query' {
  const mod: any;
  export = mod;
}

declare module '@privy-io/react-auth' {
  const mod: any;
  export = mod;
}

declare module '@privy-io/react-auth/*' {
  const mod: any;
  export = mod;
}

declare module '@privy-io/server-auth' {
  const mod: any;
  export = mod;
}

declare module '@privy-io/wagmi' {
  const mod: any;
  export = mod;
}

declare module 'wagmi' {
  const mod: any;
  export = mod;
}

declare module 'wagmi/*' {
  const mod: any;
  export = mod;
}

declare module 'clsx' {
  export default function clsx(...args: any[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...args: any[]): string;
}

declare module 'ai' {
  const mod: any;
  export = mod;
}

declare module '@ai-sdk/openai' {
  const mod: any;
  export = mod;
}

declare module 'googleapis' {
  const mod: any;
  export = mod;
}

declare module 'google-auth-library' {
  const mod: any;
  export = mod;
}

declare module 'vitest' {
  const mod: any;
  export = mod;
}

declare module '@playwright/test' {
  const mod: any;
  export = mod;
}

declare module 'posthog-js' {
  const mod: any;
  export = mod;
}

declare module 'posthog-node' {
  const mod: any;
  export = mod;
}

declare module 'uuid' {
  export function v4(): string;
}

// ---------------------------------------------------------------------------
// Core dependencies without typings in this environment (light stubs)
// ---------------------------------------------------------------------------

declare module '@trpc/server' {
  export type TRPCError = any;
  export function initTRPC(...args: any[]): any;
  export type inferRouterOutputs<T> = any;
  export type inferRouterInputs<T> = any;
  export const router: any;
  export const procedure: any;
}

declare module '@trpc/react-query' {
  const mod: any;
  export = mod;
}

declare module '@trpc/client' {
  const mod: any;
  export = mod;
}

declare module 'zod' {
  export const z: any;
  export default z;
}

declare module 'drizzle-orm' {
  const mod: any;
  export = mod;
}

declare module 'drizzle-orm/*' {
  const mod: any;
  export = mod;
}

declare module 'viem' {
  const mod: any;
  export = mod;
}

declare module 'viem/*' {
  const mod: any;
  export = mod;
}

declare module 'next/navigation' {
  const mod: any;
  export = mod;
}

// --- minimal stubs for drizzle-orm and viem so tsc sees the symbols (will be replaced by real typings later) ---

declare module 'drizzle-orm' {
  export const eq: any;
  export const and: any;
  export type SQL = any;
}

declare module 'viem' {
  export type Address = string;
}

// playwright helper
declare module '@playwright/test' {
  import { PlaywrightTestConfig } from '@playwright/test';
  export function defineConfig(config: PlaywrightTestConfig): PlaywrightTestConfig;
  export * from '@playwright/test';
}