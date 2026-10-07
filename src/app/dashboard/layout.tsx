'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Star,
  User,
  LogOut,
  Shield,
  ArrowLeft
} from 'lucide-react'

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'My Visits', href: '/dashboard/visits', icon: Calendar },
  { name: 'Applications', href: '/dashboard/applications', icon: Shield },
  { name: 'My Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Documents', href: '/dashboard/documents', icon: Shield },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Star },
  { name: 'Profile & Settings', href: '/dashboard/profile', icon: User },
  { name: 'Security & Privacy', href: '/dashboard/security', icon: LogOut },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, isAuthenticated, isAdmin, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin?redirect=/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="wrap">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors"
              >
                <ArrowLeft size={13} /> Back to Website
              </Link>
              <span className="text-text-muted">/</span>
              <span className="text-xs text-accent-cyan font-semibold">User Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Welcome, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {user?.email} · Member since {new Date(profile?.created_at || Date.now()).getFullYear()}
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all self-start md:self-auto"
            >
              <Shield size={16} /> Open Admin Panel
            </Link>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Mobile Nav Tabs */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-2 sm:p-3 flex overflow-x-auto no-scrollbar lg:flex-col gap-1.5 lg:gap-1 lg:sticky lg:top-28">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-text-muted'} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              <div className="hidden lg:block pt-3 mt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
