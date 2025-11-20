'use client';

import { BimodalProvider } from '@/components/ui/bimodal';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BimodalProvider>
      <main className="bg-[#FAFAF4]">{children}</main>
    </BimodalProvider>
  );
}
