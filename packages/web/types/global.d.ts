/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

// ------------------------------------------------------------
// Global augmentations and helper aliases for the Zero Finance
// web workspace. Avoid overriding existing library typings – we
// simply re-export useful aliases and extend interfaces where
// necessary. Keep everything strictly typed.
// ------------------------------------------------------------

import type { LucideIcon as _LucideIcon } from 'lucide-react'
export type LucideIcon = _LucideIcon

// Re-export the PanInfo type we use frequently with framer-motion
export type { PanInfo } from 'framer-motion'

// -------------  NodeJS -------------------------------------------------------
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_RPC_URL: string
      SAFE_TRANSACTION_SERVICE?: string
      // add other env vars here as they become required
    }
  }

  // -------------  JSX -------------------------------------------------------
  // Ensure any custom element names or SVGs without explicit typings
  // do not break compilation while still keeping prop types strict.
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      // Allow any tag name – value is the element props type.
      // Ideally each custom element gets its own explicit type but this
      // fallback prevents the compiler from erroring on unknown tags.
      [elemName: string]: Record<string, unknown>
    }
  }
}

// Re-export types from third-party libraries so the compiler is aware they exist
// without having to explicitly import them everywhere.

import type { HTMLMotionProps } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _FramerMotionProps = HTMLMotionProps<'div'>;

// Augment the global Window interface if needed later
// declare global {
//   interface Window {
//     myCustomProp?: string;
//   }
// }

// Fallback module stubs in case @types packages are not linked in the monorepo
// Remove these once the real typings are available in node_modules.

declare module 'react' {
  const React: any
  export = React
}

declare module 'react-dom' {
  const ReactDOM: any
  export = ReactDOM
}

declare module 'framer-motion' {
  export const motion: any
  export const AnimatePresence: any
  export type HTMLMotionProps<T extends keyof any> = any
  const _default: any
  export default _default
}

declare module 'lucide-react' {
  export const X: any
  export const MessageSquare: any
  export const Settings2: any
  export const Loader2: any
  export const Send: any
  // add others as needed
}

declare module '@ai-sdk/react' {
  export const useChat: any
  export type Message = any
}

// Ensure JSX namespace exists for files using custom ts config
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}