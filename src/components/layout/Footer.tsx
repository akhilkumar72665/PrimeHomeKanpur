import Link from 'next/link'
import {
  AtSign,
  BriefcaseBusiness,
  Camera,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  Send,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/70 bg-bg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.24),transparent_58%)]" />

      <div className="container-custom relative py-16 md:py-20">
        <div className="panel-card overflow-hidden rounded-[28px] p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand & Social */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3b82f6,#8b5cf6)]">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-white font-bold text-xl">PrimeHomeKanpur</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
                Experience rental search designed for clarity, featuring modern tools and a team that actually answers.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <SocialButton icon={<Globe2 size={17} />} label="Facebook" />
                <SocialButton icon={<Camera size={17} />} label="Instagram" />
                <SocialButton icon={<Send size={17} />} label="X" />
                <SocialButton icon={<BriefcaseBusiness size={17} />} label="LinkedIn" />
                <SocialButton icon={<Phone size={17} />} label="WhatsApp" />
                <SocialButton icon={<PlayCircle size={17} />} label="YouTube" />
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Address
              </h3>
              <div className="space-y-4 text-text-secondary">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed">
                    Awadhpuri, Near Sales Tax Office,<br />
                    Kanpur – 208024
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed">
                    Mon - Sat: 9:30 AM - 7:30 PM<br />
                    Sunday: by appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-text-secondary">
                  <AtSign className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="mailto:pathak424448@gmail.com" className="text-sm hover:text-primary transition-colors">
                    pathak424448@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-text-secondary">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="tel:+916398987290" className="text-sm hover:text-primary transition-colors">
                    +91 6398987290
                  </a>
                </div>
                <a
                  href="https://wa.me/916398987290"
                  className="inline-flex h-11 items-center rounded-full border border-[#25d366]/40 bg-[#25d366]/12 px-4 text-sm font-semibold text-[#7af0a6] transition-colors hover:bg-[#25d366]/18"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container-custom border-t border-border/70 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Subscribe to our newsletter
            </h3>
            <p className="text-text-muted text-sm mb-4">
              Get the latest rental listings and market updates delivered straight to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 flex-1 rounded-xl border border-border bg-surface px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-[#07050F] transition-colors hover:bg-primary-hover"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Navigation
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/rentals">Rentals</FooterLink>
              <FooterLink href="/agents">Agents</FooterLink>
              <FooterLink href="/services">Services</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Company
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/agents">Our Team</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/contact">Support</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Legal
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms & Conditions</FooterLink>
              <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container-custom border-t border-border/70 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © 2026 PrimeHomeKanpur. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-text-muted text-sm hover:text-primary transition-colors">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="text-text-muted text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
    >
      {icon}
    </button>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-text-secondary text-sm hover:text-primary transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}
