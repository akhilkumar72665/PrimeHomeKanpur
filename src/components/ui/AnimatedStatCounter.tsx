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
      className="group relative flex flex-col items-center justify-center text-center p-6 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-b from-[#180F3D]/80 via-[#110A2E]/90 to-[#0A061C] border border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_18px_50px_rgba(0,194,217,0.22)] hover:-translate-y-1"
    >
      {/* Top glowing line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#00C2D9] to-transparent" />

      {/* Large Glowing Number */}
      <div className="flex items-baseline justify-center font-black text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] tracking-tight py-1">
        <span className="bg-gradient-to-br from-white via-[#f0f9ff] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_6px_22px_rgba(56,189,248,0.45)] tabular-nums font-extrabold">
          {isVisible ? displayCount : 0}
        </span>

        {suffix && (
          <span className="text-[#00C2D9] font-black text-3xl sm:text-4xl md:text-5xl ml-1 drop-shadow-[0_4px_16px_rgba(0,194,217,0.5)]">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-xs sm:text-sm md:text-base font-bold tracking-wide text-text-secondary mt-2.5 group-hover:text-white transition-colors">
        {label}
      </div>
    </div>
  )
}
