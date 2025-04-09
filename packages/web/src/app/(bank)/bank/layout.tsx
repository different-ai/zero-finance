import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandBar } from "../components/command/command-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <div className="hidden md:block md:w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <CommandBar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}