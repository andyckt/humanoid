import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Humanoid',
  description: 'Admin dashboard for the Humanoid waiting list',
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
