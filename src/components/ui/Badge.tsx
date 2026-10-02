import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'rent' | 'featured' | 'premium' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        {
          'bg-badge-rent-bg text-badge-rent-text': variant === 'rent',
          'bg-primary text-gray-900': variant === 'featured',
          'bg-violet text-white': variant === 'premium',
          'bg-surface border border-border text-text-secondary': variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
