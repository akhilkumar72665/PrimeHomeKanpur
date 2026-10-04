'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Eye, EyeOff, Sparkles, CheckCircle, Shield } from 'lucide-react'

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

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [consent, setConsent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!consent) {
      setErrorMsg('Please accept the Privacy Policy to create your account.')
      return
    }

    setLoading(true)
    const result = await signUp(email, password, fullName, phone)
    setLoading(false)

    if (result.error) {
      setErrorMsg(result.error.message || 'Failed to create account. Please try again.')
    } else {
      if (!result.session) {
        setSuccessMsg('Account created successfully! Check your email to confirm your account, then sign in.')
      } else {
        router.push('/dashboard')
      }
    }
  }

  const handleGoogleSignUp = async () => {
    setErrorMsg(null)
    setGoogleLoading(true)
    const result = await signInWithGoogle()
    if (result.error) {
      setErrorMsg(result.error.message || 'Google signup failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 lg:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-text-secondary mt-1">
            Save favorite properties, schedule visits, and write verified reviews
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
              <span>Join Kanpur&apos;s Premier Rental Community</span>
            </div>

            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4">
              Find and move into your dream rental easily
            </h1>

            <p className="text-sm xl:text-base text-text-secondary leading-relaxed mb-7 max-w-xl">
              Create a free tenant account to browse 100% verified properties, schedule personalized visits, and contact property managers without brokerage confusion.
            </p>

            {/* Feature points */}
            <div className="space-y-3.5 mb-7">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-accent-cyan shrink-0 mt-0.5">
                  <CheckCircle size={17} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Verified Homes Across Kanpur</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Swaroop Nagar, Kakadeo, Civil Lines, Kalyanpur, Shyam Nagar &amp; more.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shrink-0 mt-0.5">
                  <Shield size={17} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Visit Scheduling &amp; Updates</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Choose your date &amp; time slot and get verified agent confirmations.</p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center gap-3 text-xs text-text-muted">
              <ShieldCheck size={16} className="text-accent-cyan shrink-0" />
              <span>Role-protected accounts with automatic tenant privileges</span>
            </div>
          </div>

          {/* Right Column: Sign Up Form Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="rounded-3xl border border-white/10 bg-[#0C0A1A]/95 backdrop-blur-xl p-5 sm:p-7 shadow-2xl shadow-purple-950/50">

              <div className="hidden lg:block mb-4">
                <h2 className="text-xl xl:text-2xl font-extrabold text-white tracking-tight">Create an Account</h2>
                <p className="text-xs text-text-secondary mt-0.5">Fill in your details to get started in seconds</p>
              </div>

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading || loading}
                className="w-full h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-sm hover:border-white/30 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                {googleLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                )}
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0C0A1A] px-3 text-[11px] font-medium tracking-wider text-text-muted uppercase shrink-0">
                  or register with email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#00C2D9]">
                      <User size={17} />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      style={{ paddingLeft: '2.75rem' }}
                      className="w-full h-11 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#00C2D9]">
                      <Mail size={17} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      style={{ paddingLeft: '2.75rem' }}
                      className="w-full h-11 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Mobile Number <span className="text-[#EF4444] font-bold">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#00C2D9]">
                      <Phone size={17} />
                    </div>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number (e.g. 9151435647)"
                      style={{ paddingLeft: '2.75rem' }}
                      className="w-full h-11 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">We will send visit schedules &amp; property updates on this number.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#00C2D9]">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                      className="w-full h-11 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="pt-0.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-text-secondary">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <span className="text-[11px] leading-tight">
                      I agree to the{' '}
                      <Link href="/privacy-policy" className="text-accent-cyan hover:underline">
                        Privacy Policy
                      </Link>{' '}
                      and consent to PrimeHomeKanpur contacting me regarding my account and property visits.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent-cyan text-white font-bold text-sm hover:opacity-95 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="mt-4 pt-3.5 border-t border-white/10 text-center">
                <p className="text-xs text-text-secondary">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-accent-cyan font-bold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Mobile-only Security badge */}
            <div className="lg:hidden mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
              <ShieldCheck size={14} className="text-accent-cyan" />
              <span>Role-protected accounts with automatic tenant privileges</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
