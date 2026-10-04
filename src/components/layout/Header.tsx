'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Phone,
  User,
  Heart,
  Calendar,
  Star,
  LogOut,
  Shield,
  ChevronDown,
  LayoutDashboard,
  Sparkles
} from 'lucide-react'

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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, profile, isAuthenticated, isAdmin, signOut } = useAuth()

  // Scroll detection for enhanced glass navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`site ${scrolled ? 'scrolled' : ''}`}>
      <nav aria-label="Primary Navigation" className="flex items-center justify-between w-full">
        {/* Brand Logo */}
        <Link href="/" className="brand flex items-center gap-2.5 min-w-0" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center font-black text-sm sm:text-base text-white shadow-lg shrink-0">
            P
          </div>
          <span className="font-extrabold text-base sm:text-lg md:text-xl text-white tracking-tight truncate">
            PrimeHomeKanpur
          </span>
        </Link>

        {/* Center Desktop Navigation */}
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

          {/* Mobile-only Action Links */}
          <div className="md:hidden pt-3 pb-2 border-t border-white/10 flex flex-col gap-2 w-full">
            {!isAuthenticated ? (
              <Link
                href="/signin"
                className="btn btn-secondary w-full text-center py-2.5 text-sm font-semibold border border-white/15 flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} className="text-[#00C2D9]" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-1.5 pt-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield size={16} /> Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={16} /> Dashboard Overview
                </Link>
                <Link
                  href="/dashboard/wishlist"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={16} /> Wishlist
                </Link>
                <Link
                  href="/dashboard/visits"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar size={16} /> My Visits
                </Link>
                <Link
                  href="/dashboard/reviews"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Star size={16} /> My Reviews
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut()
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 text-left mt-1"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Desktop CTA + Sign In / User Menu */}
        <div className="nav-right flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Explore Rentals (Desktop only: md:inline-flex) */}
          <Link
            href="/rentals"
            className="nav-cta btn btn-primary btn-loop-shine font-bold tracking-tight shadow-md hidden md:inline-flex items-center gap-1.5 text-xs sm:text-sm py-2 px-4"
          >
            <span>Explore Rentals</span>
          </Link>

          {/* Unauthenticated: Sign In */}
          {!isAuthenticated ? (
            <>
              {/* Desktop Sign In button (User icon + "Sign In" text) */}
              <Link
                href="/signin"
                className="desktop-signin-btn btn btn-secondary py-2 px-4 text-xs font-semibold rounded-xl border border-white/10 hover:border-primary/50 text-white transition-all hidden md:inline-flex items-center gap-2"
              >
                <User size={15} className="text-[#00C2D9]" />
                <span>Sign In</span>
              </Link>

              {/* Mobile Sign In Icon Button - Matches exact reference image */}
              <Link
                href="/signin"
                className="mobile-signin-btn md:hidden w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-[#1C1B21]/95 hover:bg-[#25242B] active:scale-95 border border-white/15 flex items-center justify-center text-white transition-all shadow-md shadow-black/40"
                aria-label="Sign In"
              >
                <User size={20} className="text-[#00C2D9] stroke-[2.2]" />
              </Link>
            </>
          ) : (
            /* Authenticated: Account Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:px-3 rounded-2xl bg-[#18132F]/90 hover:bg-[#201A3D] border border-white/15 text-white text-xs font-semibold transition-all min-h-[44px]"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center text-white text-xs font-bold">
                  {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[80px] sm:max-w-[100px] truncate hidden md:inline-block">
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={14} className={`text-text-muted transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0E0B1F] border border-white/10 p-2 shadow-2xl shadow-purple-950/60 z-50 animate-fade-in">
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-[11px] text-text-muted truncate mt-0.5">
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {profile?.role?.replace('_', ' ') || 'Admin'}
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-400/10 transition-colors"
                    >
                      <Shield size={14} /> Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LayoutDashboard size={14} /> Account Overview
                  </Link>

                  <Link
                    href="/dashboard/wishlist"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Heart size={14} /> Wishlist
                  </Link>

                  <Link
                    href="/dashboard/visits"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Calendar size={14} /> My Visits
                  </Link>

                  <Link
                    href="/dashboard/reviews"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Star size={14} /> My Reviews
                  </Link>

                  <div className="pt-1 mt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        signOut()
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Menu */}
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
