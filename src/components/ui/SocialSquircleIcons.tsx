import React from 'react'
import { FaWhatsapp } from 'react-icons/fa6'

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

export function LinkedInLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

export function WhatsAppLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return <FaWhatsapp className={className} aria-hidden="true" />
}

/**
 * SocialSquircleRow: Renders WhatsApp, Instagram, Facebook, LinkedIn with verified links & hover glows (YouTube & X removed)
 */
export function SocialSquircleRow({ className = '' }: { className?: string }) {
  const socials = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/919151435647',
      ariaLabel: 'Chat with PrimeHomeKanpur on WhatsApp',
      icon: <WhatsAppLogo className="w-[19px] h-[19px]" />,
      hoverClass: 'hover:border-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366] hover:shadow-[0_0_22px_rgba(37,211,102,0.5)]',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/primehomekanpur',
      ariaLabel: 'Follow PrimeHomeKanpur on Instagram',
      icon: <InstagramLogo className="w-[19px] h-[19px]" />,
      hoverClass: 'hover:border-[#E1306C] hover:bg-[#E1306C]/20 hover:text-[#E1306C] hover:shadow-[0_0_22px_rgba(225,48,108,0.5)]',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/primehomekanpur',
      ariaLabel: 'Visit PrimeHomeKanpur on Facebook',
      icon: <FacebookLogo className="w-[19px] h-[19px]" />,
      hoverClass: 'hover:border-[#1877F2] hover:bg-[#1877F2]/20 hover:text-[#1877F2] hover:shadow-[0_0_22px_rgba(24,119,242,0.5)]',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/primehomekanpur',
      ariaLabel: 'Connect with PrimeHomeKanpur on LinkedIn',
      icon: <LinkedInLogo className="w-[18px] h-[18px]" />,
      hoverClass: 'hover:border-[#0A66C2] hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] hover:shadow-[0_0_22px_rgba(10,102,194,0.5)]',
    },
  ]

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.ariaLabel}
          className={`group relative flex h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-[#382860]/80 bg-[#160f33]/90 text-[#b8b0db] shadow-[0_4px_14px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out hover:-translate-y-1 ${item.hoverClass}`}
        >
          {item.icon}
        </a>
      ))}
    </div>
  )
}
