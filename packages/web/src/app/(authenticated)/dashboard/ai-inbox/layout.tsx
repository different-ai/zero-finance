"use client"

import ClientLayout from "@/app/ClientLayout"

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
}
