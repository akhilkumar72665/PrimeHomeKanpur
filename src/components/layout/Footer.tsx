import Link from 'next/link'
import { MapPin, Clock3, AtSign, Phone } from 'lucide-react'
import { SocialSquircleRow, WhatsAppLogo } from '@/components/ui/SocialSquircleIcons'


export default function Footer() {
  return (
    <footer className="mt-24">
      <div className="wrap">
        {/* Top Elevated Card */}
        <div className="foot-card">
          {/* Left Column: Brand & Branded Socials */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="logo-icon w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#8B5CF6)] flex items-center justify-center font-bold text-white text-lg shadow-[0_8px_20px_rgba(124,58,237,0.3)]">
                P
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">PrimeHomeKanpur</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm mb-6">
              Experience rental search designed for clarity, featuring verified listings and a dedicated Kanpur team that answers promptly.
            </p>
            <div className="mt-4">
              <SocialSquircleRow />
            </div>
          </div>

          {/* Middle Column: Address */}
          <div>
            <div className="foot-title font-bold text-white mb-4">Address</div>
            <div className="space-y-4 text-text-secondary">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Awadhpuri, Near Sales Tax Office,<br />
                  Kanpur – 208024, Uttar Pradesh
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Mon – Sat: 9:30 AM – 7:30 PM<br />
                  Sunday: By Appointment
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact */}
          <div>
            <div className="foot-title font-bold text-white mb-4">Contact</div>
            <div className="space-y-3 text-text-secondary">
              <div className="flex items-center gap-3">
                <AtSign className="w-4 h-4 text-accent-cyan shrink-0" />
                <a href="mailto:primehomekanpur@gmail.com" className="text-sm hover:text-white transition-colors">
                  primehomekanpur@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-cyan shrink-0" />
                <a href="tel:+919151435647" className="text-sm hover:text-white transition-colors">
                  +91 9151435647
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/919151435647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary inline-flex items-center gap-2 py-2 px-4 text-xs font-semibold rounded-xl border border-white/10 hover:border-[#25D366]/40"
                >
                  <WhatsAppLogo className="w-3.5 h-3.5 text-[#25D366]" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Columns Lower Section */}
        <div className="foot-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="foot-title font-bold text-white mb-3 text-base">Subscribe to our newsletter</div>
            <p className="text-text-muted text-xs sm:text-sm mb-4 leading-relaxed">
              Get the latest rental listings and market updates in Kanpur delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-label="Email address for newsletter"
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-xl border border-white/15 bg-[#0A0719] px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="btn btn-primary h-12 px-5 text-sm font-bold rounded-xl whitespace-nowrap active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div>
            <div className="foot-title font-bold text-white mb-3 text-sm uppercase tracking-wider">Navigation</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Rentals', href: '/rentals' },
                { label: 'Agents', href: '/agents' },
                { label: 'Services', href: '/services' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors py-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="foot-title font-bold text-white mb-3 text-sm uppercase tracking-wider">Company</div>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Team', href: '/agents' },
                { label: 'FAQs', href: '/faq' },
                { label: 'Support', href: '/contact' },
                { label: 'Sign In', href: '/signin' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors py-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="foot-title font-bold text-white mb-3 text-sm uppercase tracking-wider">Legal</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookie-policy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors py-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-text-muted border-t border-white/5">
          <div className="text-center sm:text-left">
            &copy; 2026 PrimeHomeKanpur. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/terms" className="hover:text-white transition-colors py-1">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors py-1">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors py-1">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
