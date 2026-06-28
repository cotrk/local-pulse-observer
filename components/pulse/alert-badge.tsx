'use client'

import { cn } from '@/lib/utils'
import type { AlertPriority } from '@/lib/types'

interface AlertBadgeProps {
  priority: AlertPriority
  count?: number
  pulse?: boolean
  className?: string
}

const priorityConfig: Record<AlertPriority, { bg: string; text: string; ring: string }> = {
  critical: { bg: 'bg-destructive', text: 'text-destructive-foreground', ring: 'ring-destructive/30' },
  high: { bg: 'bg-warning', text: 'text-warning-foreground', ring: 'ring-warning/30' },
  medium: { bg: 'bg-primary', text: 'text-primary-foreground', ring: 'ring-primary/30' },
  low: { bg: 'bg-muted', text: 'text-muted-foreground', ring: 'ring-muted/30' },
}

export function AlertBadge({ priority, count, pulse = false, className }: AlertBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-all',
        config.bg,
        config.text,
        config.ring,
        pulse && priority === 'critical' && 'animate-pulse',
        className
      )}
    >
      {count !== undefined ? count : priority}
    </span>
  )
}

export function AlertDot({ priority, className }: { priority: AlertPriority; className?: string }) {
  const config = priorityConfig[priority]
  
  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      {priority === 'critical' && (
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', config.bg)} />
      )}
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', config.bg)} />
    </span>
  )
}
