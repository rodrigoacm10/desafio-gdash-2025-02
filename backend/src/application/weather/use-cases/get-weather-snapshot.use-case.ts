import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IWeatherSnapshotRepository,
  WEATHER_SNAPSHOT_REPOSITORY,
} from '../../../domain/weather/weather-snapshot.repository';

@Injectable()
export class GetSnapshotUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly repo: IWeatherSnapshotRepository,
  ) {}

  async execute(id: string) {
    const snapshot = await this.repo.findById(id);
    if (!snapshot) throw new NotFoundException('Weather snapshot not found');
    return snapshot;
  }
}
