declare module '@playwright/test' {
  export interface Page {
    goto(url: string, options?: any): any;
    screenshot(options: any): any;
    getByRole(role: any, opts?: any): any;
  }

  export const test: any;
  export const expect: any;
  export function defineConfig(config: any): any;
}
