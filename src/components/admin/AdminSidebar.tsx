'use client'

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
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign },
  { href: '/admin/enquiries', label: 'Contact Enquiries', icon: Mail },
  { href: '/admin/admissions', label: 'Admissions', icon: GraduationCap },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-temple-maroon text-white min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-temple-maroon-dark">
        <h1 className="text-xl font-serif font-bold">Admin Portal</h1>
        <p className="text-sm text-gray-300 mt-1">Temple Management</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
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
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-temple-maroon-dark">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-temple-maroon-dark hover:text-white w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

