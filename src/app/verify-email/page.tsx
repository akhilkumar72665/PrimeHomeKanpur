import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { MailCheck, ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Verify Your Email | PrimeHomeKanpur',
  description: 'Email verification confirmation for PrimeHomeKanpur registered tenants and landlords.',
  alternates: {
    canonical: '/verify-email',
  },
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 text-center">
          <div className="rounded-3xl border border-white/10 bg-[#0C0A1A]/90 backdrop-blur-xl p-8 shadow-2xl shadow-purple-950/40">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-accent-cyan flex items-center justify-center mx-auto mb-5 border border-primary/30">
              <MailCheck size={32} />
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Check Your Inbox</h1>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              We have sent a verification link to your registered email address. Please click the link to confirm your account and activate visit booking access.
            </p>

            <div className="space-y-3">
              <Link
                href="/signin"
                className="btn btn-primary w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                Proceed to Sign In <ArrowRight size={16} />
              </Link>

              <Link
                href="/"
                className="inline-block text-xs text-text-muted hover:text-white transition-colors"
              >
                Return to Homepage
              </Link>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-text-muted">
              <ShieldCheck size={14} className="text-accent-cyan" />
              <span>Secured by Supabase Authentication</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
