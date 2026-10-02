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

  const digits = value.toString().split('')

  return (
    <div ref={elementRef} className="stat-card flex flex-col items-center text-center p-4">
      <div className="flex items-baseline justify-center font-extrabold text-3xl sm:text-4xl text-white tracking-tight overflow-hidden py-1">
        <div className="flex items-center">
          {digits.map((digit, idx) => {
            // First digit (idx === 0) animates upward from translateY(100%) to translateY(0)
            // Second digit (idx === 1) animates downward from translateY(-100%) to translateY(0)
            // Subsequent digits alternate
            const isUpward = idx % 2 === 0
            const transformStart = isUpward ? 'translateY(110%)' : 'translateY(-110%)'
            const transitionDelay = `${idx * 120}ms`

            return (
              <span
                key={idx}
                className="inline-block transition-transform duration-1000 ease-out will-change-transform"
                style={{
                  transform: isVisible ? 'translateY(0)' : transformStart,
                  opacity: isVisible ? 1 : 0,
                  transitionDelay,
                }}
              >
                {digit}
              </span>
            )
          })}
        </div>

        {suffix && (
          <span
            className="text-primary ml-0.5 text-2xl sm:text-3xl transition-opacity duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transitionDelay: '350ms',
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      <div className="stat-label text-xs sm:text-sm font-medium text-text-secondary mt-1">
        {label}
      </div>
    </div>
  )
}
