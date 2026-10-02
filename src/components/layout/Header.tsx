'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Rentals', href: '/rentals' },
  { name: 'Agents', href: '/agents' },
  { name: 'Services', href: '/services' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname() || '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Determine CTA text based on pathname
  let ctaText = 'Explore Rentals'
  let ctaHref = '/rentals'

  if (pathname === '/') {
    ctaText = 'Explore Rentals'
    ctaHref = '/rentals'
  } else if (pathname === '/about') {
    ctaText = 'Contact Us'
    ctaHref = '/contact'
  } else if (pathname === '/rentals') {
    ctaText = 'List Property'
    ctaHref = '/contact'
  } else if (pathname.startsWith('/rentals/')) {
    ctaText = 'Schedule Tour'
    ctaHref = '#schedule-visit'
  } else if (pathname === '/agents') {
    ctaText = 'Talk to Agent'
    ctaHref = '/contact'
  } else if (pathname === '/services') {
    ctaText = 'Get Service'
    ctaHref = '/contact'
  } else if (pathname === '/faq') {
    ctaText = 'Ask a Question'
    ctaHref = '/contact'
  } else if (pathname === '/contact') {
    ctaText = 'Call Now'
    ctaHref = 'tel:+916398987290'
  }


  return (
    <header className="site">
      <nav aria-label="Primary Navigation">
        {/* Brand */}
        <Link href="/" className="brand">
          <div className="logo-icon">P</div>
          <span>PrimeHomeKanpur</span>
        </Link>

        {/* Center Desktop Navigation & Mobile Drawer */}
        <div className={`navlinks ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || (item.href === '/rentals' && pathname.startsWith('/rentals/'))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          })}

          {/* Mobile-only CTA */}
          <Link
            href={ctaHref}
            className="menu-cta btn dark"
            onClick={() => setMobileMenuOpen(false)}
          >
            {pathname === '/contact' && <Phone className="w-4 h-4 text-accent-pink" />}
            {ctaText}
          </Link>
        </div>

        {/* Right CTA & Mobile Toggle */}
        <div className="nav-right">
          <Link href={ctaHref} className="nav-cta btn dark">
            {pathname === '/contact' && <Phone className="w-4 h-4 text-accent-pink" />}
            {ctaText}
          </Link>

          <button
            id="menuBtn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  )
}
