'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-temple-maroon-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Temple Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Shree Durga Adishakti Temple</h3>
            <p className="text-gray-300 mb-4">
              A divine abode of Maa Durga and a center for spiritual and educational upliftment.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  9Q59+G82, Near Railway Bridge
                  <br />
                  Post Doddangudde, Doddanagudde
                  <br />
                  Kunjibettu, Udupi
                  <br />
                  Karnataka 576102
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>093427 49650</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>[Email to be updated]</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/temple/about" className="text-gray-300 hover:text-white transition-colors">
                  About Temple
                </Link>
              </li>
              <li>
                <Link href="/temple/events" className="text-gray-300 hover:text-white transition-colors">
                  Events & Festivals
                </Link>
              </li>
              <li>
                <Link href="/donations" className="text-gray-300 hover:text-white transition-colors">
                  Donations
                </Link>
              </li>
              <li>
                <Link href="/school/about" className="text-gray-300 hover:text-white transition-colors">
                  About School
                </Link>
              </li>
              <li>
                <Link href="/school/admissions" className="text-gray-300 hover:text-white transition-colors">
                  School Admissions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* School Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Prajna International School</h3>
            <p className="text-gray-300 mb-4">
              Nurturing minds, bodies, and souls through holistic education.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  9Q59+G82, Near Railway Bridge
                  <br />
                  Post Doddangudde, Doddanagudde
                  <br />
                  Kunjibettu, Udupi
                  <br />
                  Karnataka 576102
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>093427 49650</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-temple-maroon mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Shree Durga Adishakti Temple. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
