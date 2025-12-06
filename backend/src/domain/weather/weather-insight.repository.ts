import { WeatherInsight } from './weather-insight.entity';

export interface IWeatherInsightRepository {
  save(insight: WeatherInsight): Promise<WeatherInsight>;

  findBySnapshotId(snapshotId: string): Promise<WeatherInsight | null>;

  findById(id: string): Promise<WeatherInsight | null>;
}

export const WEATHER_INSIGHT_REPOSITORY = 'WEATHER_INSIGHT_REPOSITORY';
