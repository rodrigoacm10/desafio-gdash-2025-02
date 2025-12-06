import {
  WeatherAlert,
  WeatherInsightItem,
  WeatherInsightMetrics,
} from '../../../domain/weather/weather-insight.entity';
import { WeatherSnapshot } from '../../../domain/weather/weather-snapshot.entity';

export interface GeneratedWeatherInsightPayload {
  summary: string;
  alerts: WeatherAlert[];
  metrics: WeatherInsightMetrics;
  insights: WeatherInsightItem[];
}

export interface IWeatherInsightsLLM {
  generateFromSnapshot(
    snapshot: WeatherSnapshot,
  ): Promise<GeneratedWeatherInsightPayload>;
}

export const WEATHER_INSIGHTS_LLM = 'WEATHER_INSIGHTS_LLM';
