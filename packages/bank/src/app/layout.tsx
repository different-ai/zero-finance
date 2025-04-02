import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HyprSQRL - Web3 Banking Solution",
  description: "Manage your accounts, optimize yields, and control your finances with HyprSQRL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="noise-texture"></div>
          <div className="scanline"></div>
          {children}
        </Providers>
      </body>
    </html>
  );
}