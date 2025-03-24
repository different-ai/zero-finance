import { Sidebar } from "@/src/components/layout/sidebar";
import { Header } from "@/src/components/layout/header";
import { CommandBar } from "@/src/components/command/command-bar";

export default function InvoicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1">
      {children}
    </div>
  );
} 