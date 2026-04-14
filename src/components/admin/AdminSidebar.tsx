'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Mail,
  GraduationCap,
  Settings,
  LogOut,
  Users,
  Sparkles,
  BookOpen,
  UserCircle,
  Tag,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/deities', label: 'Deities', icon: Sparkles },
  { href: '/admin/rituals', label: 'Rituals & Services', icon: BookOpen },
  { href: '/admin/leadership', label: 'Leadership', icon: UserCircle },
  { href: '/admin/donation-categories', label: 'Donation Categories', icon: Tag },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign },
  { href: '/admin/ritual-bookings', label: 'Ritual Bookings', icon: Calendar },
  { href: '/admin/enquiries', label: 'Contact Enquiries', icon: Mail },
  { href: '/admin/admissions', label: 'Admissions', icon: GraduationCap },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const renderNavLinks = (onNavigate?: () => void) =>
    menuItems.map((item) => {
      const Icon = item.icon
      const isActive = isActiveRoute(item.href)

      return (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-temple-gold text-temple-maroon font-medium'
                : 'text-gray-200 hover:bg-temple-maroon-dark hover:text-white'
            )}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        </li>
      )
    })

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-temple-maroon-dark bg-temple-maroon text-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-serif font-bold">Admin Portal</h1>
            <p className="text-xs text-gray-300">Temple Management</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg border border-white/20 p-2"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-temple-maroon-dark px-4 py-4">
            <nav>
              <ul className="space-y-2">{renderNavLinks(() => setMobileMenuOpen(false))}</ul>
            </nav>

            <div className="mt-4 border-t border-temple-maroon-dark pt-4">
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-200 transition-colors hover:bg-temple-maroon-dark hover:text-white"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-temple-maroon text-white lg:flex">
        <div className="border-b border-temple-maroon-dark p-6">
          <h1 className="text-xl font-serif font-bold">Admin Portal</h1>
          <p className="mt-1 text-sm text-gray-300">Temple Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">{renderNavLinks()}</ul>
        </nav>

        <div className="border-t border-temple-maroon-dark p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-200 transition-colors hover:bg-temple-maroon-dark hover:text-white"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
