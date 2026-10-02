import Link from 'next/link'
import {
  Globe2,
  Camera,
  Send,
  BriefcaseBusiness,
  Phone,
  PlayCircle,
  MapPin,
  Clock3,
  AtSign,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24">
      <div className="wrap">
        {/* Top Elevated Card */}
        <div className="foot-card">
          {/* Left Column: Brand & Socials */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="logo-icon w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#8B5CF6)] flex items-center justify-center font-bold text-white text-lg shadow-[0_8px_20px_rgba(124,58,237,0.3)]">
                P
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">PrimeHomeKanpur</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm mb-6">
              Experience rental search designed for clarity, featuring modern tools and a team that actually answers.
            </p>
            <div className="socials">
              <a href="#" aria-label="Facebook" className="social">
                <Globe2 size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="social">
                <Camera size={16} />
              </a>
              <a href="#" aria-label="X (Twitter)" className="social">
                <Send size={16} />
              </a>
              <a href="#" aria-label="LinkedIn" className="social">
                <BriefcaseBusiness size={16} />
              </a>
              <a href="https://wa.me/916398987290" aria-label="WhatsApp" className="social">
                <Phone size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="social">
                <PlayCircle size={16} />
              </a>
            </div>
          </div>

          {/* Middle Column: Address */}
          <div>
            <div className="foot-title">Address</div>
            <div className="space-y-4 text-text-secondary">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Awadhpuri, Near Sales Tax Office,<br />
                  Kanpur – 208024
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  Mon – Sat: 9:30 AM – 7:30 PM<br />
                  Sunday: by appointment
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact */}
          <div>
            <div className="foot-title">Contact</div>
            <div className="space-y-3 text-text-secondary">
              <div className="flex items-center gap-3">
                <AtSign className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:pathak424448@gmail.com" className="text-sm hover:text-primary transition-colors">
                  pathak424448@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+916398987290" className="text-sm hover:text-primary transition-colors">
                  +91 6398987290
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/916398987290"
                  className="btn btn-secondary inline-flex items-center gap-2 py-2 px-4 text-xs font-semibold"
                >
                  <Phone size={13} className="text-[#25D366]" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Columns Lower Section */}
        <div className="foot-grid">
          {/* Newsletter */}
          <div>
            <div className="foot-title">Subscribe to our newsletter</div>
            <p className="text-text-muted text-sm mb-4 leading-relaxed">
              Get the latest rental listings and market updates delivered straight to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 flex-1 rounded-xl border border-border bg-[#0A0719] px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
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
            <div className="foot-title">Navigation</div>
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
            <div className="foot-title">Company</div>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Team', href: '/agents' },
                { label: 'FAQs', href: '/faq' },
                { label: 'Support', href: '/contact' },
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
            <div className="foot-title">Legal</div>
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 text-xs text-text-muted">
          <div>
            &copy; 2026 PrimeHomeKanpur. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
