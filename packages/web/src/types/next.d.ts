import type { ReactNode } from 'react';

// Override Next.js page props interface
declare module 'next' {
  export interface PageProps {
    params: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}