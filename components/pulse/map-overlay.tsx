'use client'

import { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { PostMetadata, HeatmapDataPoint, IncidentCategory } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MapPin,
  Layers,
  Flame,
  AlertTriangle,
  Clock,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import { formatDistanceToNow } from '@/lib/format'

interface MapOverlayProps {
  posts: PostMetadata[]
  heatmapData?: HeatmapDataPoint[]
  onMarkerClick?: (post: PostMetadata) => void
  className?: string
}

const categoryColors: Record<IncidentCategory, string> = {
  infrastructure: '#8b5cf6',
  safety: '#ef4444',
  environment: '#22c55e',
  community: '#3b82f6',
  development: '#f59e0b',
  traffic: '#f97316',
  utilities: '#06b6d4',
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

// Simulated map viewport (SF bounds)
const mapBounds = {
  minLat: 37.7,
  maxLat: 37.85,
  minLng: -122.52,
  maxLng: -122.35,
}

function latLngToXY(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * height
  return { x, y }
}

function MapMarker({
  post,
  x,
  y,
  onClick,
  isSelected,
}: {
  post: PostMetadata
  x: number
  y: number
  onClick?: () => void
  isSelected?: boolean
}) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className={cn(
            'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10',
            'hover:z-20 hover:scale-125',
            isSelected && 'z-20 scale-125'
          )}
          style={{ left: x, top: y }}
          onClick={onClick}
        >
          <div
            className={cn(
              'relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg',
              'ring-2 ring-white/50 cursor-pointer'
            )}
            style={{ backgroundColor: categoryColors[post.category] }}
          >
            <span className="text-sm">{categoryIcons[post.category]}</span>
            {!post.isVerified && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full border-2 border-background" />
            )}
          </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64" align="start">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{post.title}</h4>
            <Badge
              variant="outline"
              className="text-xs shrink-0"
              style={{ borderColor: categoryColors[post.category], color: categoryColors[post.category] }}
            >
              {post.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{post.summary}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(post.timestamp)}
            </span>
            <span>{post.neighborhood}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function HeatmapLayer({
  data,
  width,
  height,
  opacity,
}: {
  data: HeatmapDataPoint[]
  width: number
  height: number
  opacity: number
}) {
  const points = useMemo(() => {
    return data.map((point) => {
      const { x, y } = latLngToXY(point.coordinates.lat, point.coordinates.lng, width, height)
      return { ...point, x, y }
    })
  }, [data, width, height])

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <defs>
        <radialGradient id="heatGradient">
          <stop offset="0%" stopColor="var(--chart-4)" stopOpacity="0.6" />
          <stop offset="50%" stopColor="var(--chart-3)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={20 + point.intensity * 30}
          fill="url(#heatGradient)"
          className="mix-blend-screen"
        />
      ))}
    </svg>
  )
}

export function MapOverlay({
  posts,
  heatmapData = [],
  onMarkerClick,
  className,
}: MapOverlayProps) {
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | 'all'>('all')
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return []
    const postsWithCoords = posts.filter((p) => p.coordinates)
    if (selectedCategory === 'all') return postsWithCoords
    return postsWithCoords.filter((p) => p.category === selectedCategory)
  }, [posts, selectedCategory])

  const mapWidth = 600
  const mapHeight = 400

  const handleMarkerClick = useCallback((post: PostMetadata) => {
    setSelectedPost(post.id === selectedPost ? null : post.id)
    onMarkerClick?.(post)
  }, [selectedPost, onMarkerClick])

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Neighborhood Map
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredPosts.length} incidents
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Select
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v as IncidentCategory | 'all')}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryIcons).map(([cat, icon]) => (
                <SelectItem key={cat} value={cat}>
                  <span className="flex items-center gap-2">
                    {icon} {cat}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              id="heatmap"
              checked={showHeatmap}
              onCheckedChange={setShowHeatmap}
              className="scale-90"
            />
            <Label htmlFor="heatmap" className="text-xs flex items-center gap-1 cursor-pointer">
              <Flame className="h-3 w-3" />
              Heatmap
            </Label>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent"
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="relative bg-muted/30 overflow-hidden"
          style={{ height: mapHeight }}
        >
          {/* Map Background Grid */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Simulated neighborhood regions */}
              <ellipse cx="200" cy="150" rx="80" ry="60" fill="var(--primary)" fillOpacity="0.05" stroke="var(--primary)" strokeOpacity="0.1" />
              <ellipse cx="400" cy="200" rx="100" ry="80" fill="var(--chart-2)" fillOpacity="0.05" stroke="var(--chart-2)" strokeOpacity="0.1" />
              <ellipse cx="300" cy="320" rx="120" ry="70" fill="var(--chart-3)" fillOpacity="0.05" stroke="var(--chart-3)" strokeOpacity="0.1" />
              {/* Street-like lines */}
              <line x1="0" y1="200" x2="600" y2="200" stroke="var(--border)" strokeWidth="2" />
              <line x1="300" y1="0" x2="300" y2="400" stroke="var(--border)" strokeWidth="2" />
              <line x1="100" y1="0" x2="100" y2="400" stroke="var(--border)" strokeWidth="1" />
              <line x1="500" y1="0" x2="500" y2="400" stroke="var(--border)" strokeWidth="1" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="var(--border)" strokeWidth="1" />
              <line x1="0" y1="300" x2="600" y2="300" stroke="var(--border)" strokeWidth="1" />
            </svg>

            {/* Heatmap Layer */}
            {showHeatmap && heatmapData.length > 0 && (
              <HeatmapLayer
                data={heatmapData}
                width={mapWidth}
                height={mapHeight}
                opacity={0.7}
              />
            )}

            {/* Markers */}
            {filteredPosts.map((post) => {
              if (!post.coordinates) return null
              const { x, y } = latLngToXY(
                post.coordinates.lat,
                post.coordinates.lng,
                mapWidth,
                mapHeight
              )
              return (
                <MapMarker
                  key={post.id}
                  post={post}
                  x={x}
                  y={y}
                  onClick={() => handleMarkerClick(post)}
                  isSelected={selectedPost === post.id}
                />
              )
            })}
          </div>

          {/* Map Attribution */}
          <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground/60 bg-background/80 px-1.5 py-0.5 rounded">
            San Francisco, CA
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-sm border">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {Object.entries(categoryColors).slice(0, 6).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MapOverlaySkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] bg-muted/30 animate-pulse" />
      </CardContent>
    </Card>
  )
}
