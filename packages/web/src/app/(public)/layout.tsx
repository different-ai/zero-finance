'use client';

import { BimodalProvider } from '@/components/ui/bimodal';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BimodalProvider>
      {children}
    </BimodalProvider>
  );
}
