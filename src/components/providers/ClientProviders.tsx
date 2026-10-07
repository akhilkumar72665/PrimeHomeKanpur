'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import GuestAuthModal from '@/components/auth/GuestAuthModal'
import CookieConsentBanner from '@/components/ui/CookieConsentBanner'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <GuestAuthModal />
      <CookieConsentBanner />
    </AuthProvider>
  )
}
