import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandBar } from "@/components/command/command-bar";
import { AgentResponses } from "@/components/command/agent-responses";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block md:w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <CommandBar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 space-y-6">
                {children}
              </div>
              <div className="space-y-6">
                <AgentResponses />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 