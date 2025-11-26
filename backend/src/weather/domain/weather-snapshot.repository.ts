import { WeatherSnapshot } from './weather-snapshot.entity';

export interface ListWeatherLogsParams {
  limit?: number;
  cursor?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ListWeatherLogsResult {
  items: WeatherSnapshot[];
  nextCursor?: string;
}

export interface IWeatherSnapshotRepository {
  save(snapshot: WeatherSnapshot): Promise<WeatherSnapshot>;

  findLatest(): Promise<WeatherSnapshot | null>;

  listLogs(params: ListWeatherLogsParams): Promise<ListWeatherLogsResult>;
}

export const WEATHER_SNAPSHOT_REPOSITORY = 'WEATHER_SNAPSHOT_REPOSITORY';
