// Core data models for The Local Pulse Observer

export type SentimentScore = 'positive' | 'neutral' | 'negative' | 'mixed'

export type SourceType = 
  | 'council_meeting' 
  | 'social_media' 
  | 'news_article' 
  | 'public_report' 
  | 'community_forum'
  | 'government_notice'

export type IncidentCategory = 
  | 'infrastructure' 
  | 'safety' 
  | 'environment' 
  | 'community' 
  | 'development'
  | 'traffic'
  | 'utilities'

export type AlertPriority = 'critical' | 'high' | 'medium' | 'low'

export interface GeoCoordinates {
  lat: number
  lng: number
}

export interface PostMetadata {
  id: string
  title: string
  summary: string
  content: string
  source: SourceType
  sourceUrl?: string
  author?: string
  timestamp: Date
  keywords: string[]
  sentiment: SentimentScore
  sentimentConfidence: number
  relevanceScore: number
  neighborhood: string
  coordinates?: GeoCoordinates
  category: IncidentCategory
  isVerified: boolean
  engagementCount?: number
}

export interface Insight {
  id: string
  title: string
  description: string
  posts: PostMetadata[]
  pattern: string
  timestamp: Date
  trendDirection: 'rising' | 'stable' | 'declining'
  impactScore: number
  category: IncidentCategory
  neighborhood: string
  aiGenerated: boolean
}

export interface Alert {
  id: string
  title: string
  message: string
  priority: AlertPriority
  timestamp: Date
  read: boolean
  insightId?: string
  category: IncidentCategory
}

export interface HeatmapDataPoint {
  coordinates: GeoCoordinates
  intensity: number
  category: IncidentCategory
}

export interface TrendData {
  date: string
  value: number
  category?: IncidentCategory
}

export interface HistoricalReport {
  id: string
  title: string
  dateRange: { start: Date; end: Date }
  insights: Insight[]
  trends: TrendData[]
  summary: string
  generatedAt: Date
}

export interface UserSettings {
  alertCategories: IncidentCategory[]
  alertPriorities: AlertPriority[]
  neighborhoods: string[]
  emailNotifications: boolean
  pushNotifications: boolean
  digestFrequency: 'realtime' | 'daily' | 'weekly'
  privacyMode: boolean
  dataRetentionDays: number
}

export interface ScannerSource {
  id: string
  name: string
  type: SourceType
  url: string
  enabled: boolean
  lastScanned?: Date
  postsFound: number
}
