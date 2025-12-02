export type WeatherAlertSeverity = 'low' | 'medium' | 'high';

export interface WeatherAlert {
  type: string;
  description: string;
  severity: WeatherAlertSeverity;
  icon?: string;
}

export interface WeatherInsightMetrics {
  comfortIndex: number;
  trendTemperature: 'subindo' | 'caindo' | 'estável';
  trendRain: 'aumentando' | 'diminuindo' | 'estável';
}

export interface WeatherInsightItem {
  title: string;
  description: string;
}

export class WeatherInsight {
  constructor(
    public readonly id: string | null,
    public readonly snapshotId: string,
    public readonly summary: string,
    public readonly alerts: WeatherAlert[],
    public readonly metrics: WeatherInsightMetrics,
    public readonly insights: WeatherInsightItem[],
    public readonly createdAt?: Date,
  ) {}
}
