'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import Button from '@/components/ui/Button'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Rentals', href: '/rentals' },
  { name: 'Agents', href: '/agents' },
  { name: 'Services', href: '/services' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

const ctaTextByPath: Record<string, string> = {
  '/': 'Explore Rentals',
  '/about': 'Contact Us',
  '/rentals': 'List Property',
  '/agents': 'Talk to Agent',
  '/services': 'Get Service',
  '/faq': 'Ask a Question',
  '/contact': 'Call Now',
}

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const ctaText = ctaTextByPath[pathname] || 'Explore Rentals'

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/85 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-[74px] items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3b82f6,#8b5cf6)] shadow-[0_12px_30px_rgba(124,58,237,0.22)]">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white md:text-[30px] md:leading-none">PrimeHomeKanpur</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold',
                    isActive && 'nav-link-active'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            {pathname === '/contact' ? (
              <Button variant="secondary" size="md" className="rounded-full px-6">
                <Phone className="w-4 h-4 mr-2 text-accent-pink" />
                {ctaText}
              </Button>
            ) : (
              <Button variant="secondary" size="md" className="rounded-full px-6">
                {ctaText}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-bg/95 md:hidden">
          <nav className="container-custom py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-primary text-[#07050F]'
                        : 'text-text-secondary hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="pt-4">
                {pathname === '/contact' ? (
                  <Button variant="secondary" size="md" className="w-full rounded-full">
                    <Phone className="w-4 h-4 mr-2 text-accent-pink" />
                    {ctaText}
                  </Button>
                ) : (
                  <Button variant="secondary" size="md" className="w-full rounded-full">
                    {ctaText}
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
