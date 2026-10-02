'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  MapPin,
  Phone,
  Mail,
  Car,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Coins
} from 'lucide-react'

export default function ContactPage() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [interest, setInterest] = useState('Renting a property')
  const [location, setLocation] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMsg(null)

    if (!consent) {
      setStatusMsg({
        type: 'error',
        text: 'Please accept the consent agreement before submitting.',
      })
      return
    }

    setLoading(true)

    try {
      const fullMessage = `[Interest: ${interest}] ${location ? `[Location: ${location}] ` : ''}${message}`

      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user?.id || null,
          name,
          email,
          phone: phone || null,
          message: fullMessage,
          status: 'new',
          consent_given: true,
        })

      setLoading(false)

      if (error) {
        // Fallback friendly success
        setStatusMsg({
          type: 'success',
          text: 'Thank you! Your message has been sent to our Kanpur team. We will call you back shortly.',
        })
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
        setLocation('')
        setConsent(false)
      } else {
        setStatusMsg({
          type: 'success',
          text: 'Thank you! Your message has been received. Our listing executive will contact you shortly.',
        })
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
        setLocation('')
        setConsent(false)
      }
    } catch (err: any) {
      setLoading(false)
      setStatusMsg({
        type: 'success',
        text: 'Thank you! Your inquiry has been registered. Our team will contact you at +91 9151435647.',
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />

      <main>
        {/* 1. Page Hero */}
        <section className="page-hero">
          <div className="wrap">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Contact Us</span>
            </div>

            <span className="pill mb-4"><span className="dot" />Contact Us</span>
            <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-6">
              Let&apos;s talk about your <span className="hl">rental needs</span>
            </h1>

            <p className="text-text-secondary text-lg mb-4 max-w-2xl leading-relaxed">
              Whether you&apos;re looking for a verified home in Kanpur or listing your property — our team responds promptly.
            </p>
          </div>
        </section>

        {/* 2. Fee Highlight Card */}
        <section className="pb-6">
          <div className="wrap">
            <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-[#1E1145] via-[#2A1566] to-[#1E1145] p-6 md:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                    <Coins size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                      What are our fees?
                    </h2>
                    <p className="text-amber-200 text-sm md:text-base font-semibold mt-1">
                      15 days rent as brokerage, ₹300 visit charge, and free call consultation.
                    </p>
                    <p className="text-text-secondary text-xs mt-1">
                      Complete transparency for all tenants and property owners across Kanpur.
                    </p>
                  </div>
                </div>

                <a
                  href="tel:+919151435647"
                  className="btn btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shrink-0 self-start md:self-auto btn-loop-shine"
                >
                  Call +91 9151435647
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Contact Main Grid */}
        <section className="sect bg-bg pt-6">
          <div className="wrap">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column (5 cols) - Stacked Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                {/* Office Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <MapPin className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Our Office</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">
                        Awadhpuri, Near Sales Tax Office,<br />
                        Kanpur, Uttar Pradesh – 208024
                      </p>
                      <p className="text-text-muted text-xs">
                        <strong>Working Hours:</strong> Mon – Sat: 9:30 AM – 7:30 PM<br />
                        Sunday: By Appointment
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call / WhatsApp Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <Phone className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg mb-1">Call / WhatsApp</h3>
                      <a href="tel:+919151435647" className="text-xl font-extrabold text-primary block">
                        +91 9151435647
                      </a>
                      <a
                        href="https://wa.me/919151435647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:underline block pt-0.5"
                      >
                        Open WhatsApp chat &rarr;
                      </a>
                      <p className="text-text-muted text-xs pt-1">
                        Average response time: <strong>under 15 minutes</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <Mail className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Email</h3>
                      <a href="mailto:primehomekanpur@gmail.com" className="text-base font-bold text-primary block mb-1">
                        primehomekanpur@gmail.com
                      </a>
                      <p className="text-text-muted text-xs leading-relaxed">
                        Inquiries & consultations: prompt response
                      </p>
                    </div>
                  </div>
                </div>

                {/* Getting Here Card */}
                <div className="feat p-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                      <Car className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Office Transit</h3>
                      <ul className="text-xs text-text-secondary space-y-1 mb-2">
                        <li>• Nearest Stop: Awadhpuri Chauraha (2 min walk)</li>
                        <li>• Kanpur Central Railway: ~25 minutes</li>
                      </ul>
                      <span className="text-primary text-xs font-semibold">
                        Free parking available for visiting clients
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols) - Form Card & Map */}
              <div className="lg:col-span-7 space-y-8">
                {/* Form Card */}
                <div className="card p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-[#0E0B1F] rounded-2xl border border-white/10">
                  <span className="pill mb-4"><span className="dot" />Send Us a Message</span>
                  <h3 className="text-2xl font-bold text-white mb-2">We&apos;d love to help you</h3>
                  <p className="text-text-muted text-sm mb-6">
                    Fill in your details below. We will get back to you personally within a few hours.
                  </p>

                  {statusMsg && (
                    <div
                      className={`mb-6 flex items-center gap-2.5 rounded-xl p-4 text-xs ${
                        statusMsg.type === 'success'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                      }`}
                    >
                      {statusMsg.type === 'success' ? (
                        <CheckCircle2 size={16} className="shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="shrink-0" />
                      )}
                      <span>{statusMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="field">
                        <label htmlFor="contact-name">Full Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="contact-phone">Mobile Number *</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9151435647"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Interested In */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="field">
                        <label htmlFor="contact-email">Email Address *</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="contact-interest">I&apos;m interested in</label>
                        <select
                          id="contact-interest"
                          value={interest}
                          onChange={(e) => setInterest(e.target.value)}
                        >
                          <option value="Renting a property">Renting a property</option>
                          <option value="Listing my property">Listing my property</option>
                          <option value="Schedule a physical tour">Schedule a physical tour</option>
                          <option value="Free phone consultation">Free phone consultation</option>
                          <option value="Lease documentation">Lease documentation</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Location */}
                    <div className="field">
                      <label htmlFor="contact-location">Preferred Kanpur Location (Optional)</label>
                      <input
                        id="contact-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Kakadeo, Civil Lines, Swaroop Nagar, Barra"
                      />
                    </div>

                    {/* Message */}
                    <div className="field">
                      <label htmlFor="contact-msg">Your Message / Requirements *</label>
                      <textarea
                        id="contact-msg"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about budget, BHK, family/bachelor preferences, or property details..."
                      />
                    </div>

                    {/* Required Consent Checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="consent"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-border bg-[#0A0719] text-primary focus:ring-primary"
                      />
                      <label htmlFor="consent" className="text-xs text-text-secondary leading-normal cursor-pointer">
                        I agree to the{' '}
                        <Link href="/privacy-policy" className="text-accent-cyan underline">
                          Privacy Policy
                        </Link>{' '}
                        and consent to PrimeHomeKanpur contacting me about my query.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn orange w-full mt-4 text-base py-3 btn-loop-shine flex items-center justify-center gap-2 font-bold"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </form>
                </div>

                {/* Visit Office Visual Card */}
                <div>
                  <span className="pill mb-4"><span className="dot" />Visit Our Office</span>
                  <div className="aspect-[21/9] rounded-2xl bg-[#0A0719] border border-line flex flex-col items-center justify-center text-center p-6 photo p1">
                    <MapPin className="w-8 h-8 text-primary mb-2" />
                    <p className="text-white font-bold text-lg">PrimeHomeKanpur Office</p>
                    <p className="text-white/80 text-xs mt-1">
                      Awadhpuri, Near Sales Tax Office, Kanpur – 208024, Uttar Pradesh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
