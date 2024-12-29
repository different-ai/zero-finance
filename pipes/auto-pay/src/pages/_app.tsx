import * as React from "react";
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { Toaster } from "@/components/ui/toaster"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  )
}
