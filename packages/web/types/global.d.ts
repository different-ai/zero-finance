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
import type { PanInfo, HTMLMotionProps } from 'framer-motion'

export type { PanInfo }
export type MotionProps<T extends keyof JSX.IntrinsicElements = 'div'> = HTMLMotionProps<T>

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

// (no additional fall-back module stubs are required – real @types packages
// already provide all the declarations we use.)