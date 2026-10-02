'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Building,
  MapPin,
  Star,
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react'

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Properties CMS', href: '/admin/properties', icon: Building },
  { name: 'Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Reviews Moderation', href: '/admin/reviews', icon: Star },
  { name: 'Visit Requests', href: '/admin/visits', icon: Calendar },
  { name: 'Team & Agents', href: '/admin/team', icon: Users },
  { name: 'Contact Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Site Statistics', href: '/admin/statistics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, isAuthenticated, isAdmin, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/signin?redirect=/admin')
      }
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-[#07050F]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Authenticating admin access...</p>
        </div>
      </div>
    )
  }

  // 403 Access Denied if authenticated but NOT an authorized admin
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center bg-[#07050F]">
        <div className="max-w-md w-full text-center rounded-2xl border border-rose-500/30 bg-[#0E0B1F] p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <ShieldAlert size={34} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">403 — Access Denied</h1>
          <p className="text-xs text-text-secondary leading-relaxed mb-6">
            Your account (<span className="text-white font-medium">{user?.email}</span>) does not have administrative privileges to view or manage the PrimeHomeKanpur CMS.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto btn btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
            >
              User Dashboard
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto btn btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#07050F] text-white flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#0A0719]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5"
            aria-label="Toggle admin sidebar"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-black font-extrabold text-sm shadow-md">
              P
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight">PrimeHome Admin</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {profile?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft size={13} /> View Live Website
          </Link>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white truncate max-w-[150px]">
                {profile?.full_name || 'Admin'}
              </p>
              <p className="text-[10px] text-text-muted truncate max-w-[150px]">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() => signOut()}
              className="p-2 rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Shell Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-16 left-0 z-40 w-64 border-r border-white/10 bg-[#0B081E] p-4 flex flex-col justify-between transition-transform lg:static lg:translate-x-0 ${
            mobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted px-3 py-2">
              Management CMS
            </div>

            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-amber-300' : 'text-text-muted'} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-text-muted px-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>RLS & Server Security Active</span>
            </div>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07050F]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
