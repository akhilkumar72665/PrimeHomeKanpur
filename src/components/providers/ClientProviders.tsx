'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import GuestAuthModal from '@/components/auth/GuestAuthModal'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <GuestAuthModal />
    </AuthProvider>
  )
}
