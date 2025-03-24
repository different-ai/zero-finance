import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <div className="noise-texture"></div>
        <div className="scanline"></div>
        {children}
      </body>
    </html>
  );
}