import Link from 'next/link'
import {
  MapPin,
  Clock3,
  AtSign,
  Phone,
} from 'lucide-react'

// Simple SVG Icons for precise brand colors
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  )
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

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
            <div className="socials flex items-center gap-2">
              {/* Instagram: Gradient hover */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-transparent hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] shadow-sm"
              >
                <InstagramIcon />
              </a>

              {/* Facebook: Blue hover */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white shadow-sm"
              >
                <FacebookIcon />
              </a>

              {/* YouTube: Red hover */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white shadow-sm"
              >
                <YouTubeIcon />
              </a>

              {/* WhatsApp: Green hover */}
              <a
                href="https://wa.me/919151435647"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="social w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white shadow-sm"
              >
                <WhatsAppIcon />
              </a>

              {/* LinkedIn: Blue hover */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white shadow-sm"
              >
                <LinkedInIcon />
              </a>
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
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Columns Lower Section */}
        <div className="foot-grid">
          {/* Newsletter */}
          <div>
            <div className="foot-title font-bold text-white mb-3">Subscribe to our newsletter</div>
            <p className="text-text-muted text-sm mb-4 leading-relaxed">
              Get the latest rental listings and market updates in Kanpur delivered straight to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 flex-1 rounded-xl border border-border bg-[#0A0719] px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="btn btn-primary h-11 px-5 text-sm font-semibold rounded-xl"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div>
            <div className="foot-title font-bold text-white mb-3">Navigation</div>
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
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="foot-title font-bold text-white mb-3">Company</div>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Team', href: '/agents' },
                { label: 'FAQs', href: '/faq' },
                { label: 'Support', href: '/contact' },
                { label: 'Sign In', href: '/signin' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="foot-title font-bold text-white mb-3">Legal</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookie-policy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 text-xs text-text-muted border-t border-white/5">
          <div>
            &copy; 2026 PrimeHomeKanpur. All rights reserved. Kanpur, Uttar Pradesh.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
