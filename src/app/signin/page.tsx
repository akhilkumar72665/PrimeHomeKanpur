'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react'

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function SignInContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signIn, signInWithGoogle, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect')

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.push('/admin')
      } else {
        router.push(redirectPath || '/dashboard')
      }
    }
  }, [isAuthenticated, isAdmin, redirectPath, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    const result = await signIn(email, password, redirectPath || undefined)
    setLoading(false)

    if (result.error) {
      setErrorMsg(result.error.message || 'Invalid email or password. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg(null)
    setGoogleLoading(true)
    const result = await signInWithGoogle(redirectPath || undefined)
    if (result.error) {
      setErrorMsg(result.error.message || 'Google sign-in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 flex items-center justify-center relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 sm:mb-7">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 sm:mb-5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_24px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">PrimeHomeKanpur</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
            Sign in to manage your wishlist, visits, and account
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0C0A1A]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50">
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full h-12 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-medium text-sm transition-all flex items-center justify-center gap-3 shadow-sm hover:border-white/30 disabled:opacity-50 active:scale-[0.99]"
          >
            {googleLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <GoogleIcon className="w-5 h-5 shrink-0" />
            )}
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0C0A1A] px-3 text-[11px] font-medium tracking-wider text-text-muted uppercase shrink-0">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#00C2D9]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ paddingLeft: '2.85rem' }}
                  className="w-full h-12 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent-cyan hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#00C2D9]">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.85rem', paddingRight: '2.85rem' }}
                  className="w-full h-12 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent-cyan text-white font-bold text-sm hover:opacity-95 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-accent-cyan font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
          <ShieldCheck size={14} className="text-accent-cyan" />
          <span>Secured with Supabase Authentication &amp; RLS</span>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
