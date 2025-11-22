import { WeatherSnapshot } from './weather-snapshot.entity';

export interface IWeatherSnapshotRepository {
  save(snapshot: WeatherSnapshot): Promise<WeatherSnapshot>;

  findLatest(): Promise<WeatherSnapshot | null>;

  list(limit?: number): Promise<WeatherSnapshot[]>;

  findByDateRange(start: Date, end: Date): Promise<WeatherSnapshot[]>;
}

export const WEATHER_SNAPSHOT_REPOSITORY = 'WEATHER_SNAPSHOT_REPOSITORY';
