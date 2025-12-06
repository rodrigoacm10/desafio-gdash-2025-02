import { Inject, Injectable } from '@nestjs/common';
import {
  type IWeatherSnapshotRepository,
  WEATHER_SNAPSHOT_REPOSITORY,
  ListWeatherLogsParams,
  ListWeatherLogsResult,
} from '../../../domain/weather/weather-snapshot.repository';

@Injectable()
export class ListWeatherLogsUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly repo: IWeatherSnapshotRepository,
  ) {}

  async execute(
    params: ListWeatherLogsParams = {},
  ): Promise<ListWeatherLogsResult> {
    return this.repo.listLogs(params);
  }
}
