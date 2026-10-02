'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { X, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

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

export default function GuestAuthModal() {
  const { authModalOpen, authModalMessage, closeAuthModal, signIn, signUp, signInWithGoogle } = useAuth()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const router = useRouter()

  if (!authModalOpen) return null

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    const result = await signIn(email, password)
    setLoading(false)

    if (result.error) {
      setErrorMsg(result.error.message || 'Invalid credentials. Please try again.')
    } else {
      closeAuthModal()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    const result = await signUp(email, password, fullName, phone)
    setLoading(false)

    if (result.error) {
      setErrorMsg(result.error.message || 'Sign up failed. Please try again.')
    } else {
      if (!result.session) {
        setSuccessMsg('Account created! Please check your email to confirm your account, then sign in.')
        setTab('signin')
      } else {
        closeAuthModal()
      }
    }
  }

  const handleGoogleAuth = async () => {
    setErrorMsg(null)
    setGoogleLoading(true)
    const result = await signInWithGoogle()
    if (result.error) {
      setErrorMsg(result.error.message || 'Google authentication failed.')
      setGoogleLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0C0A1A]/95 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-purple-950/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center text-white mb-3 shadow-[0_0_24px_rgba(168,85,247,0.4)]">
            <Lock size={20} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Sign In Required</h3>
          <p className="text-xs text-text-secondary mt-1 max-w-xs leading-relaxed">
            {authModalMessage}
          </p>
        </div>

        {/* Google Quick Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading || loading}
          className="w-full h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-medium text-sm transition-all flex items-center justify-center gap-3 shadow-sm hover:border-white/30 disabled:opacity-50 active:scale-[0.99] mb-4"
        >
          {googleLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5 shrink-0" />
          )}
          <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0C0A1A] px-3 text-[10px] font-medium tracking-wider text-text-muted uppercase shrink-0">
            or use email
          </span>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-4 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setTab('signin')
              setErrorMsg(null)
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'signin'
                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md'
                : 'text-text-muted hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup')
              setErrorMsg(null)
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md'
                : 'text-text-muted hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="me@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/80 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
                <Link
                  href="/forgot-password"
                  onClick={closeAuthModal}
                  className="text-xs text-accent-cyan hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/80 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent-cyan text-white font-semibold text-sm hover:opacity-95 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Verma"
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/80 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="me@example.com"
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/80 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                Mobile Number <span className="text-[#EF4444] font-bold">*</span>
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/80 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/80 focus:ring-1 focus:ring-accent-cyan/40 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent-cyan text-white font-semibold text-sm hover:opacity-95 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-xs text-text-muted">
          By continuing, you agree to our{' '}
          <Link href="/terms" onClick={closeAuthModal} className="text-white hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" onClick={closeAuthModal} className="text-white hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
