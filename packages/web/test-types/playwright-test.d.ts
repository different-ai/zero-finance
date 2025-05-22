declare module '@playwright/test' {
  export const test: (name: string, fn: any) => any;
  export const expect: any;
  export function defineConfig(config: any): any;
}
