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
import {
  type IWeatherInsightsLLM,
  WEATHER_INSIGHTS_LLM,
} from '../ports/weather-insights-llm.port';

@Injectable()
export class CreateWeatherInsightUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly snapshotRepo: IWeatherSnapshotRepository,

    @Inject(WEATHER_INSIGHT_REPOSITORY)
    private readonly insightRepo: IWeatherInsightRepository,

    @Inject(WEATHER_INSIGHTS_LLM)
    private readonly llm: IWeatherInsightsLLM,
  ) {}

  async execute(snapshotId: string): Promise<WeatherInsight> {
    const snapshot = await this.snapshotRepo.findById(snapshotId);
    if (!snapshot) {
      throw new NotFoundException('Weather snapshot not found');
    }

    const existing = await this.insightRepo.findBySnapshotId(snapshotId);
    if (existing) {
      return existing;
    }

    const generated = await this.llm.generateFromSnapshot(snapshot);

    const newInsight = new WeatherInsight(
      null,
      snapshotId,
      generated.summary,
      generated.alerts,
      {
        comfortIndex: Number(generated.metrics.comfortIndex),
        trendTemperature: generated.metrics.trendTemperature,
        trendRain: generated.metrics.trendRain,
      },
      generated.insights,
    );

    const saved = await this.insightRepo.save(newInsight);
    return saved;
  }
}
