'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Building,
  Sliders,
  MapPin,
  Star,
  MessageSquare,
  Users2,
  ShieldCheck,
  UserCheck,
  History,
  ExternalLink,
  X,
} from 'lucide-react'
import { Permission } from '@/lib/permissions'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  permission?: Permission
  badgeCountKey?: 'pendingReviews' | 'newInquiries'
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Building, permission: 'properties.update' },
  { name: 'Properties Page', href: '/admin/properties-page', icon: Sliders, permission: 'page_settings.update' },
  { name: 'Locations', href: '/admin/locations', icon: MapPin, permission: 'locations.manage' },
  { name: 'Reviews', href: '/admin/reviews', icon: Star, permission: 'reviews.moderate', badgeCountKey: 'pendingReviews' },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, permission: 'inquiries.manage', badgeCountKey: 'newInquiries' },
  { name: 'Agents', href: '/admin/agents', icon: Users2, permission: 'agents.manage' },
  { name: 'Team', href: '/admin/team', icon: ShieldCheck, permission: 'team.manage' },
  { name: 'Users', href: '/admin/users', icon: UserCheck, permission: 'users.view' },
  { name: 'Activity Log', href: '/admin/activity', icon: History, permission: 'activity_logs.view' },
]

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { can, teamRole } = useAuth()
  const [counts, setCounts] = useState<{ pendingReviews: number; newInquiries: number }>({
    pendingReviews: 0,
    newInquiries: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    async function loadBadges() {
      try {
        const { count: reviewCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'PENDING')

        const { count: inquiryCount } = await supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'NEW')

        setCounts({
          pendingReviews: reviewCount || 0,
          newInquiries: inquiryCount || 0,
        })
      } catch {
        // ignore
      }
    }

    loadBadges()
  }, [supabase, pathname])

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.permission) return true
    return can(item.permission)
  })

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A0719] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(0,194,217,0.4)]">
              P
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">PrimeHome</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary block -mt-1">
                Admin Panel
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
            Management
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            const badgeCount = item.badgeCountKey ? counts[item.badgeCountKey] : 0

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-[#04121a] font-bold shadow-lg shadow-cyan-950/40'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={`transition-transform duration-200 ${
                      isActive ? 'text-[#04121a]' : 'text-text-muted group-hover:text-primary group-hover:scale-110'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {badgeCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-[#04121a] text-primary'
                        : 'bg-rose-500 text-white shadow-sm shadow-rose-950'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer: View Website */}
        <div className="p-4 border-t border-white/10 bg-[#07050F]/60">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-white/10 hover:border-primary/40 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-text-secondary hover:text-white transition-all shadow-sm"
          >
            <span>View Public Website</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </aside>
    </>
  )
}
