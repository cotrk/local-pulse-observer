'use client'

import React from "react"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PostMetadata, SentimentScore, SourceType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  MessageSquare,
  Building2,
  Newspaper,
  FileText,
  Users,
  Landmark,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Minus,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react'
import { formatDistanceToNow, formatNumber } from '@/lib/format'

interface FeedPanelProps {
  posts: PostMetadata[]
  title?: string
  maxHeight?: string
  onPostClick?: (post: PostMetadata) => void
  className?: string
}

const sourceIcons: Record<SourceType, React.ReactNode> = {
  council_meeting: <Landmark className="h-4 w-4" />,
  social_media: <MessageSquare className="h-4 w-4" />,
  news_article: <Newspaper className="h-4 w-4" />,
  public_report: <FileText className="h-4 w-4" />,
  community_forum: <Users className="h-4 w-4" />,
  government_notice: <Building2 className="h-4 w-4" />,
}

const sentimentConfig: Record<SentimentScore, { icon: React.ReactNode; color: string }> = {
  positive: { icon: <ThumbsUp className="h-3 w-3" />, color: 'text-success' },
  neutral: { icon: <Minus className="h-3 w-3" />, color: 'text-muted-foreground' },
  negative: { icon: <ThumbsDown className="h-3 w-3" />, color: 'text-destructive' },
  mixed: { icon: <Minus className="h-3 w-3" />, color: 'text-warning' },
}

function PostItem({ post, onClick }: { post: PostMetadata; onClick?: () => void }) {
  const sentiment = sentimentConfig[post.sentiment]

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            'group p-3 rounded-lg border bg-card transition-all duration-200 cursor-pointer',
            'hover:border-primary/30 hover:shadow-sm hover:bg-accent/5'
          )}
          onClick={onClick}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-muted text-muted-foreground shrink-0">
              {sourceIcons[post.source]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{post.title}</h4>
                {post.isVerified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {post.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(post.timestamp)}
                  </span>
                  <span className={cn('flex items-center gap-1', sentiment.color)}>
                    {sentiment.icon}
                    {post.sentiment}
                  </span>
                </div>
                {post.engagementCount !== undefined && (
                  <span className="text-xs">{formatNumber(post.engagementCount)} engaged</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start" side="right">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">{post.title}</h4>
            <p className="text-xs text-muted-foreground">{post.content}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {post.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {post.neighborhood}
            </span>
            <span>Relevance: {Math.round(post.relevanceScore * 100)}%</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export function FeedPanel({
  posts,
  title = 'Live Feed',
  maxHeight = '500px',
  onPostClick,
  className,
}: FeedPanelProps) {
  const [filter, setFilter] = useState<SourceType | 'all'>('all')

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter((p) => p.source === filter)

  const sources = Array.from(new Set(posts.map((p) => p.source)))

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {posts.length} items
          </Badge>
        </div>
        <div className="flex gap-1 flex-wrap pt-2">
          <Button
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          {sources.map((source) => (
            <Button
              key={source}
              variant={filter === source ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setFilter(source)}
            >
              {sourceIcons[source]}
              <span className="hidden sm:inline">{source.replace('_', ' ')}</span>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-2 pr-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  onClick={() => onPostClick?.(post)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No posts found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function FeedPanelSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-1 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
