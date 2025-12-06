import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  type IWeatherSnapshotRepository,
  WEATHER_SNAPSHOT_REPOSITORY,
} from '../../../domain/weather/weather-snapshot.repository';
import {
  type IWeatherInsightRepository,
  WEATHER_INSIGHT_REPOSITORY,
} from '../../../domain/weather/weather-insight.repository';
import { WeatherInsight } from '../../../domain/weather/weather-insight.entity';

@Injectable()
export class GetWeatherInsightUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly snapshotRepo: IWeatherSnapshotRepository,

    @Inject(WEATHER_INSIGHT_REPOSITORY)
    private readonly insightRepo: IWeatherInsightRepository,
  ) {}

  async execute(snapshotId: string): Promise<WeatherInsight> {
    const snapshot = await this.snapshotRepo.findById(snapshotId);
    if (!snapshot) {
      throw new NotFoundException('Weather snapshot not found');
    }

    const existing = await this.insightRepo.findBySnapshotId(snapshotId);
    if (!existing) {
      throw new NotFoundException('Insigth weather snapshot not found');
    }

    return existing;
  }
}
