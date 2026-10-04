'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff, Sparkles, CheckCircle, Shield } from 'lucide-react'

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
    <div className="min-h-screen pt-20 sm:pt-24 lg:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background glow & accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00C2D9]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl lg:max-w-6xl relative z-10">
        {/* Mobile-only Header */}
        <div className="lg:hidden text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center text-white font-extrabold text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">PrimeHomeKanpur</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-text-secondary mt-1">
            Sign in to manage your wishlist, visits, and account
          </p>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">

          {/* Left Column: Brand, Headline, Benefits (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center pr-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group w-fit">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center text-white font-extrabold text-2xl shadow-[0_0_28px_rgba(168,85,247,0.45)] group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="text-2xl font-black text-white tracking-tight">PrimeHomeKanpur</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-accent-cyan w-fit mb-4">
              <Sparkles size={13} />
              <span>Kanpur&apos;s #1 Rental Platform</span>
            </div>

            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4">
              Welcome back to effortless rental search
            </h1>

            <p className="text-sm xl:text-base text-text-secondary leading-relaxed mb-8 max-w-xl">
              Access your personalized dashboard to track saved properties, manage visit schedules, and connect with verified landlords across Kanpur.
            </p>

            {/* Feature points */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-accent-cyan shrink-0 mt-0.5">
                  <CheckCircle size={17} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">100% Verified Listings</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Real photos, transparent rents, and genuine property details.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shrink-0 mt-0.5">
                  <Shield size={17} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct &amp; Secure Scheduling</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Book assisted physical walkthroughs at your preferred date and time.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-text-muted">
              <ShieldCheck size={16} className="text-accent-cyan shrink-0" />
              <span>Secured with Supabase Authentication &amp; Row Level Security</span>
            </div>
          </div>

          {/* Right Column: Sign In Form Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="rounded-3xl border border-white/10 bg-[#0C0A1A]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50">

              <div className="hidden lg:block mb-5">
                <h2 className="text-xl xl:text-2xl font-extrabold text-white tracking-tight">Sign In</h2>
                <p className="text-xs text-text-secondary mt-1">Enter your details to access your account</p>
              </div>

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
                className="w-full h-11 sm:h-12 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-sm hover:border-white/30 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                {googleLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                )}
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
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
                      className="w-full h-11 sm:h-12 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
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
                      className="w-full h-11 sm:h-12 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
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
                  className="w-full h-11 sm:h-12 mt-2 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent-cyan text-white font-bold text-sm hover:opacity-95 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-text-secondary">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="text-accent-cyan font-bold hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* Mobile-only Security badge */}
            <div className="lg:hidden mt-5 flex items-center justify-center gap-2 text-xs text-text-muted">
              <ShieldCheck size={14} className="text-accent-cyan" />
              <span>Secured with Supabase Authentication &amp; RLS</span>
            </div>
          </div>

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
