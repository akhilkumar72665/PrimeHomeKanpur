'use client'

import React from 'react'

export interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalized = status.toUpperCase()

  let style = 'bg-gray-500/10 text-gray-400 border-gray-500/20'

  switch (normalized) {
    case 'AVAILABLE':
    case 'APPROVED':
    case 'ACTIVE':
    case 'CLOSED':
      style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      break
    case 'PENDING':
    case 'NEW':
    case 'IN_PROGRESS':
    case 'VISIT_SCHEDULED':
      style = 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      break
    case 'REJECTED':
    case 'INACTIVE':
    case 'HIDDEN':
      style = 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      break
    case 'RENTED':
    case 'RESERVED':
    case 'CONTACTED':
      style = 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      break
    case 'OWNER':
      style = 'bg-purple-500/15 text-purple-300 border-purple-500/40 font-bold'
      break
    case 'MANAGER':
      style = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
      break
    case 'EDITOR':
      style = 'bg-blue-500/15 text-blue-300 border-blue-500/40 font-bold'
      break
    case 'SUPPORT':
      style = 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold'
      break
    default:
      break
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${style} ${className}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
