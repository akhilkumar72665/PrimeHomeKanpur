'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, LogOut, Shield } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, profile, teamRole, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-[#0A0719]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted font-medium">
          <Shield size={14} className="text-primary" />
          <span>Admin Portal</span>
          <span className="text-white/20">/</span>
          <span className="text-white">Kanpur Rental CMS</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role Badge */}
        {teamRole && <StatusBadge status={teamRole} />}

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white truncate max-w-[140px]">
              {profile?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-[10px] text-text-muted truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => signOut()}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 text-text-muted hover:text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          title="Sign Out"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
