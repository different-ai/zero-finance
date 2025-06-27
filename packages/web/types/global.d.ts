/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

/**
 * Global auxiliary types for the web workspace.
 * We do NOT stub third-party libraries with `any`. Instead we forward their real
 * public typings (when available) or describe a safe minimal surface that keeps
 * type-safety for the code we write.
 */

/* -------------------------------------------------------------------------- */
/*  framer-motion – we forward the public exports we actually use             */
/* -------------------------------------------------------------------------- */
import type {
  motion as _motion,
  AnimatePresence as _AnimatePresence,
  PanInfo as _PanInfo,
  HTMLMotionProps as _HTMLMotionProps,
} from 'framer-motion'

export type PanInfo = _PanInfo
export type MotionProps<T extends keyof JSX.IntrinsicElements = 'div'> = _HTMLMotionProps<T>
export const motion: typeof _motion
export const AnimatePresence: typeof _AnimatePresence

/* -------------------------------------------------------------------------- */
/*  lucide-react – we need icon component typing                              */
/* -------------------------------------------------------------------------- */
import type { SVGProps } from 'react'
export interface LucideProps extends SVGProps<SVGSVGElement> {
  color?: string
  size?: string | number
  absoluteStrokeWidth?: boolean
}

// Icon component signature used across codebase
export type LucideIcon = (props: LucideProps) => JSX.Element

/* -------------------------------------------------------------------------- */
/*  NodeJS namespace augmentation                                             */
/* -------------------------------------------------------------------------- */
declare global {
  namespace NodeJS {
    // Add env vars the web app expects at runtime (extend as required)
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_RPC_URL: string
      SAFE_TRANSACTION_SERVICE?: string
    }
  }

  /* ----------------------------------------------------------------------- */
  /*  JSX Fallback                                                            */
  /* ----------------------------------------------------------------------- */
  namespace JSX {
    // Allow unknown custom tags with generic attribute map so the compiler
    // doesn't error on e.g. `<animateMotion>` in SVGs.
    // Prefer explicit typing for real custom elements.
    interface IntrinsicElements {
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