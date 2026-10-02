import React from 'react'

/**
 * 3D-styled Magnifying Glass Icon (Find a rental)
 * Matches Image 1: Cyan/blue glass lens with gloss, metallic rim and dark squircle container
 */
export function FindRentalIcon({ className = 'w-13 h-13' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-[16px] bg-gradient-to-b from-[#112438] to-[#0a1524] border border-[#1b3d5b]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#00C2D9]/60 group-hover:shadow-[0_0_24px_rgba(0,194,217,0.35)] ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-[0_4px_10px_rgba(34,211,238,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lensGrad" x1="16" y1="14" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0E7490" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="14" y1="12" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="60%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
          <linearGradient id="handleGrad" x1="34" y1="34" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* Handle */}
        <path
          d="M36 36L49 49C50.5 50.5 50.5 53 49 54.5C47.5 56 45 56 43.5 54.5L30.5 41.5"
          stroke="url(#handleGrad)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Handle highlight */}
        <path
          d="M37.5 37.5L47 47"
          stroke="#E0F2FE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Outer Rim */}
        <circle cx="27" cy="27" r="15" stroke="url(#rimGrad)" strokeWidth="4.5" />

        {/* Inner Glass Lens */}
        <circle cx="27" cy="27" r="12.5" fill="url(#lensGrad)" fillOpacity="0.85" />

        {/* Gloss / Specular Highlights on Lens */}
        <ellipse cx="23" cy="21" rx="5.5" ry="3.2" transform="rotate(-30 23 21)" fill="white" fillOpacity="0.85" />
        <circle cx="32" cy="31" r="1.8" fill="white" fillOpacity="0.5" />
      </svg>
    </div>
  )
}

/**
 * 3D-styled House Icon (List your rental)
 * Matches Image 1: Warm coral/orange roof, chimney, front door, glowing windows on dark warm container
 */
export function ListRentalHouseIcon({ className = 'w-13 h-13' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-[16px] bg-gradient-to-b from-[#2a1720] to-[#170e14] border border-[#52293b]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#EA580C]/60 group-hover:shadow-[0_0_24px_rgba(234,88,12,0.35)] ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2 drop-shadow-[0_4px_10px_rgba(249,115,22,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="roofGrad" x1="12" y1="28" x2="32" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="roofRightGrad" x1="32" y1="12" x2="52" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="wallGrad" x1="18" y1="26" x2="46" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
        </defs>

        {/* Chimney */}
        <rect x="38" y="16" width="6" height="12" rx="1.5" fill="#9A3412" />
        <rect x="37" y="14" width="8" height="3" rx="1" fill="#C2410C" />

        {/* House Body */}
        <rect x="18" y="27" width="28" height="23" rx="3" fill="url(#wallGrad)" />

        {/* House Base Shadow */}
        <path d="M18 47H46V48C46 49.1 45.1 50 44 50H20C18.9 50 18 49.1 18 48V47Z" fill="#C2410C" fillOpacity="0.4" />

        {/* Door */}
        <rect x="28" y="36" width="8" height="14" rx="2" fill="#0891B2" />
        <circle cx="34.5" cy="43" r="0.9" fill="#FDE047" />

        {/* Window Left */}
        <rect x="21" y="32" width="5" height="5" rx="1" fill="#38BDF8" />
        <path d="M23.5 32V37M21 34.5H26" stroke="#0369A1" strokeWidth="0.8" />

        {/* Window Right */}
        <rect x="38" y="32" width="5" height="5" rx="1" fill="#38BDF8" />
        <path d="M40.5 32V37M38 34.5H43" stroke="#0369A1" strokeWidth="0.8" />

        {/* Roof Left */}
        <path
          d="M13 28L32 12L34 14L15 30C14.2 30.6 13 30.1 13 29.1V28Z"
          fill="url(#roofGrad)"
        />
        {/* Roof Main */}
        <path
          d="M13.5 28.5L32 12.5L50.5 28.5C51.5 29.3 50.9 31 49.6 31H14.4C13.1 31 12.5 29.3 13.5 28.5Z"
          fill="url(#roofRightGrad)"
        />
        {/* Roof ridge light */}
        <path d="M16 28L32 14L48 28" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
      </svg>
    </div>
  )
}

/**
 * 3D-styled Clipboard / Document Icon (Renewals & appraisal)
 * Matches Image 1: Clipboard with orange clip, note lines on dark purple squircle container
 */
export function RenewalsDocIcon({ className = 'w-13 h-13' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-[16px] bg-gradient-to-b from-[#22173b] to-[#120b24] border border-[#44306d]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#A855F7]/60 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.35)] ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-[0_4px_10px_rgba(168,85,247,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="boardGrad" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <linearGradient id="paperGrad" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="clipGrad" x1="25" y1="10" x2="39" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Clipboard Backing */}
        <rect x="17" y="14" width="30" height="38" rx="4" fill="url(#boardGrad)" />

        {/* Paper Sheet */}
        <rect x="20" y="17" width="24" height="32" rx="2.5" fill="url(#paperGrad)" />

        {/* Text Lines on Document */}
        <rect x="24" y="24" width="16" height="2.5" rx="1.2" fill="#94A3B8" />
        <rect x="24" y="29.5" width="12" height="2.5" rx="1.2" fill="#CBD5E1" />
        <rect x="24" y="35" width="16" height="2.5" rx="1.2" fill="#CBD5E1" />
        <rect x="24" y="40.5" width="9" height="2.5" rx="1.2" fill="#06B6D4" />

        {/* Orange Clip at the top */}
        <rect x="26" y="11" width="12" height="7" rx="2" fill="url(#clipGrad)" />
        <ellipse cx="32" cy="14" rx="2.5" ry="1.5" fill="#9A3412" />
      </svg>
    </div>
  )
}

/**
 * Header Pill with cyan droplet/sparkle
 * Matches the top "Our Services" pill in Image 1
 */
export function OurServicesPill({ text = "Our Services" }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171033] border border-[#3b2a6d] shadow-[0_2px_12px_rgba(0,0,0,0.3)] text-sm font-medium text-[#E2E8F0] mb-4">
      <span className="w-5 h-5 rounded-full bg-[#00C2D9]/20 border border-[#00C2D9]/50 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 16 16" className="w-3 h-3 text-[#00C2D9] fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1.5C8 1.5 3.5 7 3.5 10.25C3.5 12.87 5.51 15 8 15C10.49 15 12.5 12.87 12.5 10.25C12.5 7 8 1.5 8 1.5Z" />
        </svg>
      </span>
      <span>{text}</span>
    </div>
  )
}
