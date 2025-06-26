/// <reference types="react" />

// Global helper types preloaded for the whole codebase
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { eq, and } from 'drizzle-orm'
import { Address } from 'viem'

// Provide a permissive JSX namespace so TSX compiles even when using non-HTML elements.
// This can be tightened component-by-component later.
export {}; // ensure this file is a module

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      [elemName: string]: any; // allow any tag/props combination
    }
  }
}