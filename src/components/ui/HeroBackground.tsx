import Image from 'next/image'

interface HeroBackgroundProps {
  src: string
  alt: string
  priority?: boolean
  opacity?: string
  objectPosition?: string
}

export default function HeroBackground({
  src,
  alt,
  priority = true,
  opacity = 'opacity-55 sm:opacity-75',
  objectPosition = 'center',
}: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
      {/* Background Image */}
      <div className={`relative w-full h-full ${opacity} transition-opacity duration-700`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>

      {/* Directional gradient: Deep dark on left for text contrast, fading softly to the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07050F] via-[#07050F]/85 to-[#07050F]/35" />

      {/* Vertical blend: Melts seamlessly into the page background below */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07050F]/60 via-transparent to-[#07050F]" />

      {/* Subtle brand violet vignette glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.18),transparent_60%)]" />
    </div>
  )
}
