import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IWeatherInsightRepository } from '../../domain/weather-insight.repository';
import {
  WeatherAlert,
  WeatherInsight,
  WeatherInsightItem,
  WeatherInsightMetrics,
} from '../../domain/weather-insight.entity';
import { WeatherInsightDocument } from './weather-insight.schema';

@Injectable()
export class WeatherInsightMongoRepository
  implements IWeatherInsightRepository
{
  constructor(
    @InjectModel(WeatherInsightDocument.name)
    private readonly model: Model<WeatherInsightDocument>,
  ) {}

  private mapToDomain(doc: WeatherInsightDocument): WeatherInsight {
    const alerts: WeatherAlert[] = (doc.alerts ?? []).map((a) => ({
      type: a.type,
      description: a.description,
      severity: a.severity as any,
      icon: a.icon,
    }));

    const metrics: WeatherInsightMetrics = {
      comfortIndex: doc.metrics.comfortIndex,
      trendTemperature: doc.metrics.trendTemperature as any,
      trendRain: doc.metrics.trendRain as any,
    };

    const insights: WeatherInsightItem[] = (doc.insights ?? []).map((i) => ({
      title: i.title,
      description: i.description,
    }));

    return new WeatherInsight(
      doc.id ?? null,
      doc.snapshotId,
      doc.summary,
      alerts,
      metrics,
      insights,
      doc.createdAt,
    );
  }

  async save(insight: WeatherInsight): Promise<WeatherInsight> {
    const { id, ...data } = insight as any;
    const created = await this.model.create(data);
    return this.mapToDomain(created);
  }

  async findBySnapshotId(snapshotId: string): Promise<WeatherInsight | null> {
    const doc = await this.model.findOne({ snapshotId }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async findById(id: string): Promise<WeatherInsight | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapToDomain(doc) : null;
  }
}
