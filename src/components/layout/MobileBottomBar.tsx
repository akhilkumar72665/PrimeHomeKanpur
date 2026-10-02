'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Search, Home } from 'lucide-react'
import { WhatsAppLogo } from '@/components/ui/SocialSquircleIcons'

export default function MobileBottomBar() {
  const pathname = usePathname() || '/'

  // Do not show bottom bar on admin panel routes
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <aside 
      aria-label="Mobile Quick Actions" 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#07050F]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_25px_rgba(0,0,0,0.5)] px-3 py-2"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href="tel:+919151435647"
          className="flex-1 flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white text-xs font-bold transition-all border border-white/10"
          aria-label="Call PrimeHomeKanpur Support"
        >
          <Phone size={16} className="text-[#00C2D9] shrink-0" />
          <span>Call Us</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919151435647?text=Hello%20PrimeHomeKanpur,%20I%20want%20to%20inquire%20about%20rental%20properties."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[1.2] flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-black text-xs font-extrabold transition-all shadow-md shadow-emerald-950/40"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppLogo className="w-4 h-4 text-black shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Explore Rentals Button */}
        <Link
          href="/rentals"
          className={`flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl ${
            pathname.startsWith('/rentals')
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold'
              : 'bg-white/10 hover:bg-white/15 text-white font-semibold'
          } text-xs transition-all border border-white/10 active:scale-95`}
          aria-label="Browse rental listings"
        >
          <Search size={15} className="shrink-0" />
          <span>Rentals</span>
        </Link>
      </div>
    </aside>
  )
}
