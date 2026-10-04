'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AnimatedStatCounterProps {
  value: number
  suffix?: string
  label: string
}

export default function AnimatedStatCounter({
  value,
  suffix = '',
  label,
}: AnimatedStatCounterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayCount, setDisplayCount] = useState(value)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Smooth count-up animation with spring-like cubic easing
  useEffect(() => {
    if (!isVisible) return

    const duration = 1400
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      // Ease out expo for snappy start and gentle settle
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.round(easeProgress * value)

      setDisplayCount(current)

      if (frame >= totalFrames) {
        setDisplayCount(value)
        clearInterval(timer)
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div
      ref={elementRef}
      className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#160D38]/90 via-[#10082B]/95 to-[#0A051D] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-[#00C2D9]/40 hover:shadow-[0_10px_30px_rgba(0,194,217,0.2)] hover:-translate-y-0.5"
    >
      {/* Top glowing cyan pill (matching UI Image 2) */}
      <div className="w-10 sm:w-14 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#00C2D9] to-transparent shadow-[0_0_10px_#00C2D9] mb-2 sm:mb-3 opacity-90" />

      {/* Number & Suffix in glowing single line */}
      <div className="flex items-baseline justify-center whitespace-nowrap leading-none py-1 gap-1">
        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E2E8F0] tracking-tight tabular-nums drop-shadow-[0_2px_12px_rgba(0,194,217,0.35)]">
          {isVisible ? displayCount : 0}
        </span>

        {suffix && (
          <span className="text-[#00C2D9] font-extrabold text-xl sm:text-2xl md:text-3xl drop-shadow-[0_2px_8px_rgba(0,194,217,0.5)]">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-xs sm:text-sm font-semibold tracking-wide text-text-secondary mt-1.5 sm:mt-2 text-center group-hover:text-white transition-colors">
        {label}
      </div>
    </div>
  )
}
