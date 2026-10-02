import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  pill?: string
  title: string
  highlight?: string
  description?: string
  className?: string
  rightAction?: ReactNode
}

export default function SectionHeading({
  pill,
  title,
  highlight,
  description,
  className,
  rightAction,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 md:mb-10', className)}>
      {pill && (
        <div className="pill mb-4 md:mb-5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-primary">
            {pill}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
        <h2 className="max-w-3xl text-3xl font-bold text-white leading-tight md:text-5xl">
          {title}
          {highlight && (
            <>
              {' '}
              <span className="bg-gradient-to-r from-primary via-cyan-300 to-violet-400 bg-clip-text text-transparent">{highlight}</span>
            </>
          )}
        </h2>
        {rightAction}
      </div>

      {description && (
        <p className="section-subtitle max-w-2xl">{description}</p>
      )}
    </div>
  )
}
