declare module 'next/navigation' {
  /**
   * Navigate to a new route and end the current request.
   * This helper is only valid inside Server Components / Server Actions.
   */
  export function redirect(url: string): never;
}