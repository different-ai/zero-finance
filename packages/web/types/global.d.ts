/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

// Re-export types from third-party libraries so the compiler is aware they exist
// without having to explicitly import them everywhere.

import type { HTMLMotionProps } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _FramerMotionProps = HTMLMotionProps<'div'>;

import type { LucideIcon } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _LucideIcon = LucideIcon;

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