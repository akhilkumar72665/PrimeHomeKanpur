'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Building,
  PlusCircle,
  Users,
  Calendar,
  FileText,
  CreditCard,
  User,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  FolderOpen
} from 'lucide-react'

const landlordNavItems = [
  { name: 'Overview', href: '/landlord', icon: Building },
  { name: 'My Properties', href: '/landlord/properties', icon: FolderOpen },
  { name: 'List New Property', href: '/landlord/properties/new', icon: PlusCircle },
  { name: 'Tenant Inquiries / Leads', href: '/landlord/leads', icon: Users },
  { name: 'Scheduled Visits', href: '/landlord/visits', icon: Calendar },
  { name: 'Applications', href: '/landlord/applications', icon: FileText },
  { name: 'Property Documents', href: '/landlord/documents', icon: ShieldCheck },
  { name: 'Payment & Brokerage', href: '/landlord/payments', icon: CreditCard },
  { name: 'Landlord Profile', href: '/landlord/profile', icon: User },
]

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin?redirect=/landlord')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Loading Landlord Portal...</p>
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
              <span className="text-xs text-accent-cyan font-semibold">Landlord Partner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Landlord Hub: {profile?.full_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Manage your Kanpur rental listings, physical visit appointments, and tenant verification
            </p>
          </div>

          <Link
            href="/landlord/properties/new"
            className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-900/40 self-start md:self-auto"
          >
            <PlusCircle size={16} /> Submit Property for Verification
          </Link>
        </div>

        {/* Landlord Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-[#0E0B1F] p-2 sm:p-3 flex overflow-x-auto no-scrollbar lg:flex-col gap-1.5 lg:gap-1 lg:sticky lg:top-28">
              {landlordNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-accent-cyan text-white shadow-md'
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
