import { Inject, Injectable } from '@nestjs/common';
import {
  type IWeatherSnapshotRepository,
  WEATHER_SNAPSHOT_REPOSITORY,
} from '../../domain/weather-snapshot.repository';
import {
  WeatherSnapshot,
  WeatherSnapshotLocation,
  WeatherCurrent,
  WeatherHourlyEntry,
  WeatherDailyEntry,
} from '../../domain/weather-snapshot.entity';

export interface SaveWeatherSnapshotInput {
  provider: string;
  type: string;
  location: WeatherSnapshotLocation;
  fetchedAt: string;
  current: WeatherCurrent;
  hourly: WeatherHourlyEntry[];
  daily: WeatherDailyEntry[];
}

@Injectable()
export class SaveWeatherSnapshotUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly repo: IWeatherSnapshotRepository,
  ) {}

  async execute(input: SaveWeatherSnapshotInput): Promise<WeatherSnapshot> {
    const snapshot = new WeatherSnapshot(
      null,
      input.provider,
      input.type,
      input.location,
      input.fetchedAt,
      input.current,
      input.hourly,
      input.daily,
      undefined,
    );

    return this.repo.save(snapshot);
  }
}
