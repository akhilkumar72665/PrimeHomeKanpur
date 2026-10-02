import React from 'react'

export interface SocialLinkItem {
  id: string
  name: string
  href: string
  icon: React.ReactNode
  ariaLabel: string
  hoverClass: string
}

export function FacebookLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function InstagramLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5.5" ry="5.5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function XLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function LinkedInLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

export function WhatsAppLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.8 9.5a.5.5 0 0 0-.5.5c0 1.8 2.2 4 4 4 .3 0 .5-.2.5-.5v-.9l-1.4-.4-.7.7c-.7-.4-1.4-1.1-1.8-1.8l.7-.7-.3-1.4-.5.5z" fill="currentColor" />
    </svg>
  )
}

export function YouTubeLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

/**
 * SocialSquircleRow: Renders the 6 social media icons in compact squircle containers with brand-specific hover colors & glows
 */
export function SocialSquircleRow({ className = '' }: { className?: string }) {
  const socials = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      ariaLabel: 'Visit our Facebook page',
      icon: <FacebookLogo className="w-[18px] h-[18px]" />,
      hoverClass: 'hover:border-[#1877F2] hover:bg-[#1877F2]/15 hover:text-[#1877F2] hover:shadow-[0_0_20px_rgba(24,119,242,0.45)]',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      ariaLabel: 'Visit our Instagram profile',
      icon: <InstagramLogo className="w-[18px] h-[18px]" />,
      hoverClass: 'hover:border-[#E1306C] hover:bg-[#E1306C]/15 hover:text-[#E1306C] hover:shadow-[0_0_20px_rgba(225,48,108,0.45)]',
    },
    {
      name: 'X',
      href: 'https://x.com',
      ariaLabel: 'Follow us on X (Twitter)',
      icon: <XLogo className="w-[16px] h-[16px]" />,
      hoverClass: 'hover:border-white/80 hover:bg-white/15 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      ariaLabel: 'Connect with us on LinkedIn',
      icon: <LinkedInLogo className="w-[17px] h-[17px]" />,
      hoverClass: 'hover:border-[#0A66C2] hover:bg-[#0A66C2]/15 hover:text-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.45)]',
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/919151435647',
      ariaLabel: 'Chat with us on WhatsApp',
      icon: <WhatsAppLogo className="w-[18px] h-[18px]" />,
      hoverClass: 'hover:border-[#25D366] hover:bg-[#25D366]/15 hover:text-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.45)]',
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      ariaLabel: 'Watch our videos on YouTube',
      icon: <YouTubeLogo className="w-[18px] h-[18px]" />,
      hoverClass: 'hover:border-[#FF0000] hover:bg-[#FF0000]/15 hover:text-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.45)]',
    },
  ]

  return (
    <div className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${className}`}>
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.ariaLabel}
          className={`group relative flex h-[44px] w-[44px] sm:h-[46px] sm:w-[46px] items-center justify-center rounded-[14px] border border-[#382860]/80 bg-[#160f33]/90 text-[#b8b0db] shadow-[0_4px_14px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out hover:-translate-y-1 ${item.hoverClass}`}
        >
          {item.icon}
        </a>
      ))}
    </div>
  )
}
