'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AdminLayoutShellProps {
  children: ReactNode
}

export default function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-temple-off-white">
      <AdminSidebar />
      <main className="min-w-0 p-6 lg:ml-64 lg:p-8">{children}</main>
    </div>
  )
}
