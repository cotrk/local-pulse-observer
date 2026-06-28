'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Insight, IncidentCategory } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { formatDistanceToNow } from '@/lib/format'

interface InsightCardProps {
  insight: Insight
  variant?: 'default' | 'compact'
  onViewDetails?: (insight: Insight) => void
  className?: string
}

const categoryIcons: Record<IncidentCategory, string> = {
  infrastructure: '🏗️',
  safety: '🛡️',
  environment: '🌿',
  community: '👥',
  development: '🏢',
  traffic: '🚦',
  utilities: '⚡',
}

const trendConfig = {
  rising: { icon: TrendingUp, color: 'text-destructive', label: 'Rising' },
  stable: { icon: Minus, color: 'text-muted-foreground', label: 'Stable' },
  declining: { icon: TrendingDown, color: 'text-success', label: 'Declining' },
}

export function InsightCard({
  insight,
  variant = 'default',
  onViewDetails,
  className,
}: InsightCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const TrendIcon = trendConfig[insight.trendDirection].icon

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 cursor-pointer',
        'hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5',
        variant === 'compact' && 'p-3',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(insight)}
    >
      {insight.aiGenerated && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-primary/10 rounded-bl-lg">
          <Sparkles className="h-3 w-3 text-primary" />
        </div>
      )}

      <CardHeader className={cn('pb-2', variant === 'compact' && 'p-0 pb-2')}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryIcons[insight.category]}</span>
            <h3 className={cn(
              'font-semibold leading-tight text-balance',
              variant === 'default' ? 'text-base' : 'text-sm'
            )}>
              {insight.title}
            </h3>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  'shrink-0 gap-1 cursor-help',
                  trendConfig[insight.trendDirection].color
                )}
              >
                <TrendIcon className="h-3 w-3" />
                <span className="text-xs">{trendConfig[insight.trendDirection].label}</span>
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 text-sm" align="end">
              <p className="font-medium mb-1">Trend Analysis</p>
              <p className="text-muted-foreground text-xs">{insight.pattern}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Impact Score:</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${insight.impactScore * 100}%` }}
                  />
                </div>
                <span className="font-medium">{Math.round(insight.impactScore * 100)}%</span>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>

      <CardContent className={cn(variant === 'compact' && 'p-0')}>
        <p className={cn(
          'text-muted-foreground mb-3 line-clamp-2',
          variant === 'default' ? 'text-sm' : 'text-xs'
        )}>
          {insight.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {insight.neighborhood}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(insight.timestamp)}
            </span>
          </div>
          <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Details <ChevronRight className="h-3 w-3" />
          </span>
        </div>

        {variant === 'default' && insight.posts.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              Based on {insight.posts.length} sources
            </p>
            <div className="flex flex-wrap gap-1">
              {insight.posts.slice(0, 3).map((post) => (
                <Badge key={post.id} variant="secondary" className="text-xs">
                  {post.source.replace('_', ' ')}
                </Badge>
              ))}
              {insight.posts.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{insight.posts.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Animated border effect on hover */}
      <div
        className={cn(
          'absolute inset-0 border-2 border-primary/0 rounded-lg transition-all duration-300 pointer-events-none',
          isHovered && 'border-primary/20'
        )}
      />
    </Card>
  )
}

export function InsightCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  return (
    <Card className={cn(variant === 'compact' && 'p-3')}>
      <CardHeader className={cn('pb-2', variant === 'compact' && 'p-0 pb-2')}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-muted animate-pulse" />
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className={cn(variant === 'compact' && 'p-0')}>
        <div className="space-y-2 mb-3">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
