import { Inject, Injectable } from '@nestjs/common';
import {
  type IWeatherSnapshotRepository,
  WEATHER_SNAPSHOT_REPOSITORY,
} from '../../domain/weather-snapshot.repository';

@Injectable()
export class GetLatestSnapshotUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly repo: IWeatherSnapshotRepository,
  ) {}

  async execute() {
    return this.repo.findLatest();
  }
}
