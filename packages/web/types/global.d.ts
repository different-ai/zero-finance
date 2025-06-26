THIS SHOULD BE A LINTER ERROR/// <reference types="react" />

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