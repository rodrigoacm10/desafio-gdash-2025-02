export type WeatherInsightAlert = {
  type: string
  description: string
  severity: 'low' | 'medium' | 'high'
  icon?: string
}

export type WeatherInsightMetrics = {
  comfortIndex: number
  trendTemperature: string
  trendRain: string
}

export type WeatherInsightItem = {
  title: string
  description: string
}

export type WeatherInsight = {
  id: string
  snapshotId: string
  summary: string
  alerts: WeatherInsightAlert[]
  metrics: WeatherInsightMetrics
  insights: WeatherInsightItem[]
  createdAt: string
}
