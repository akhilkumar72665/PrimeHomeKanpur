'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/admin/Sidebar'
import { Topbar } from '@/components/admin/Topbar'
import { ShieldAlert } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, teamRole, isLoading, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin?redirect=/admin')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07050F]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-text-secondary font-medium">Verifying admin access...</p>
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
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            Your account (<span className="text-white font-medium">{user?.email}</span>) does not currently have active <strong className="text-amber-400">ADMIN</strong> privileges in the database.
          </p>
          <div className="text-[11px] text-text-muted bg-white/[0.03] p-3.5 rounded-xl border border-white/5 text-left mb-6 space-y-1.5">
            <p className="font-semibold text-white">💡 Troubleshooting Steps:</p>
            <p>1. Make sure you ran the SQL Migration in your <strong>Supabase Dashboard → SQL Editor</strong>.</p>
            <p>2. Verify that your email is listed in the <code>team_members</code> table with <code>team_role = &apos;OWNER&apos;</code> and <code>is_active = true</code>.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-all"
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
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content Area (offset by 64px on lg for sidebar) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
