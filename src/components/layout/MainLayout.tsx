'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
