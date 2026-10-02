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
  const [displayCount, setDisplayCount] = useState(0)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Smooth number counting up animation
  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const duration = 1200
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
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
      className="group relative flex flex-col items-center justify-center text-center p-5 md:p-6 rounded-2xl bg-gradient-to-b from-[#160e36]/60 to-[#0c0721]/80 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(0,194,217,0.15)] hover:-translate-y-0.5"
    >
      {/* Top subtle highlight line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Large Glowing Number */}
      <div className="flex items-baseline justify-center font-black text-4xl sm:text-5xl md:text-6xl tracking-tight py-1">
        <span className="bg-gradient-to-br from-white via-[#f0f9ff] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(56,189,248,0.35)] tabular-nums">
          {isVisible ? displayCount : 0}
        </span>

        {suffix && (
          <span className="text-primary font-bold text-2xl sm:text-3xl md:text-4xl ml-1 drop-shadow-[0_2px_10px_rgba(0,194,217,0.4)]">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-xs sm:text-sm font-semibold tracking-wide text-text-secondary mt-2 group-hover:text-white transition-colors">
        {label}
      </div>
    </div>
  )
}
