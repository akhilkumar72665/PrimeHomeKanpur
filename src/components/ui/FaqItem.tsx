'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqItemProps {
  question: string
  answer: string
}

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="feature-card bg-surface border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-elevated transition-colors"
      >
        <span className="text-white font-semibold text-lg pr-4">{question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-primary flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-text-secondary leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
