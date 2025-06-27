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