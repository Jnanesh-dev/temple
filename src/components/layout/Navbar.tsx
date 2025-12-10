'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    {
      href: '/temple',
      label: 'Temple',
      submenu: [
        { href: '/temple/about', label: 'About' },
        { href: '/temple/deities', label: 'Deities' },
        { href: '/temple/services', label: 'Rituals & Services' },
        { href: '/temple/events', label: 'Events & Festivals' },
        { href: '/temple/gallery', label: 'Gallery' },
      ],
    },
    { href: '/donations', label: 'Donations' },
    {
      href: '/school',
      label: 'School',
      submenu: [
        { href: '/school/about', label: 'About' },
        { href: '/school/academics', label: 'Academics' },
        { href: '/school/admissions', label: 'Admissions' },
        { href: '/school/facilities', label: 'Facilities' },
        { href: '/school/student-life', label: 'Student Life' },
      ],
    },
    { href: '/leadership', label: 'Leadership' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-serif text-temple-maroon font-bold">
              Shree Durga Adishakti
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className="text-gray-700 hover:text-temple-maroon transition-colors font-medium"
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-temple-off-white hover:text-temple-maroon"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button href="/donations" size="sm">
              Donate Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-temple-maroon font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block py-1 text-sm text-gray-600 hover:text-temple-maroon"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2">
              <Button href="/donations" size="sm" className="w-full">
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

