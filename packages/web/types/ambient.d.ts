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