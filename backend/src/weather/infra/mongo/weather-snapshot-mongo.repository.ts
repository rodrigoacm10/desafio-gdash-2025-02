import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  IWeatherSnapshotRepository,
  ListWeatherLogsParams,
  ListWeatherLogsResult,
  WEATHER_SNAPSHOT_REPOSITORY,
} from '../../domain/weather-snapshot.repository';
import { WeatherSnapshot } from '../../domain/weather-snapshot.entity';
import { WeatherSnapshotDocument } from './weather-snapshot.schema';

@Injectable()
export class WeatherSnapshotMongoRepository
  implements IWeatherSnapshotRepository
{
  constructor(
    @InjectModel(WeatherSnapshotDocument.name)
    private readonly model: Model<WeatherSnapshotDocument>,
  ) {}

  private mapToDomain(doc: WeatherSnapshotDocument): WeatherSnapshot {
    return new WeatherSnapshot(
      doc.id ?? null,
      doc.provider,
      doc.type,
      {
        city: doc.location.city,
        state: doc.location.state,
        country: doc.location.country,
        lat: doc.location.lat,
        lon: doc.location.lon,
        timezone: doc.location.timezone,
        timezoneOffset: doc.location.timezoneOffset,
      },
      doc.fetchedAt,
      {
        timestamp: doc.current.timestamp,
        temperature: doc.current.temperature,
        feelsLike: doc.current.feelsLike,
        humidity: doc.current.humidity,
        pressure: doc.current.pressure,
        dewPoint: doc.current.dewPoint,
        uvi: doc.current.uvi,
        clouds: doc.current.clouds,
        visibility: doc.current.visibility,
        windSpeed: doc.current.windSpeed,
        windDeg: doc.current.windDeg,
        rainLastHour: doc.current.rainLastHour,
        rainProbability: doc.current.rainProbability,
        condition: {
          id: doc.current.condition?.id ?? null,
          main: doc.current.condition?.main ?? null,
          description: doc.current.condition?.description ?? null,
          icon: doc.current.condition?.icon ?? null,
        },
        metadata: doc.current.metadata ?? {},
      },
      (doc.hourly ?? []).map((h) => ({
        timestamp: h.timestamp,
        temperature: h.temperature,
        feelsLike: h.feelsLike,
        humidity: h.humidity,
        pressure: h.pressure,
        dewPoint: h.dewPoint,
        uvi: h.uvi,
        clouds: h.clouds,
        visibility: h.visibility,
        windSpeed: h.windSpeed,
        windDeg: h.windDeg,
        rainLastHour: h.rainLastHour,
        rainProbability: h.rainProbability,
        condition: {
          id: h.condition?.id ?? null,
          main: h.condition?.main ?? null,
          description: h.condition?.description ?? null,
          icon: h.condition?.icon ?? null,
        },
        metadata: h.metadata ?? {},
      })),
      (doc.daily ?? []).map((d) => ({
        date: d.date,
        tempMin: d.tempMin,
        tempMax: d.tempMax,
        tempDay: d.tempDay,
        tempNight: d.tempNight,
        humidity: d.humidity,
        pressure: d.pressure,
        dewPoint: d.dewPoint,
        windSpeed: d.windSpeed,
        windDeg: d.windDeg,
        uvi: d.uvi,
        clouds: d.clouds,
        rainProbability: d.rainProbability,
        rainAmount: d.rainAmount,
        condition: {
          id: d.condition?.id ?? null,
          main: d.condition?.main ?? null,
          description: d.condition?.description ?? null,
          icon: d.condition?.icon ?? null,
        },
        metadata: d.metadata ?? {},
      })),
      doc.createdAt,
    );
  }

  async save(snapshot: WeatherSnapshot): Promise<WeatherSnapshot> {
    const { id, ...data } = snapshot as any;
    const created = await this.model.create(data);
    return this.mapToDomain(created);
  }

  async findLatest(): Promise<WeatherSnapshot | null> {
    const doc = await this.model.findOne().sort({ createdAt: -1 }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async listLogs(
    params: ListWeatherLogsParams,
  ): Promise<ListWeatherLogsResult> {
    const limit = params.limit ?? 50;

    const query: any = {};

    if (params.startDate || params.endDate) {
      query.createdAt = {};
      if (params.startDate) {
        query.createdAt.$gte = params.startDate;
      }
      if (params.endDate) {
        query.createdAt.$lte = params.endDate;
      }
    }

    if (params.cursor) {
      query._id = { $lt: new Types.ObjectId(params.cursor) };
    }

    const docs = await this.model
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .exec();

    const hasNextPage = docs.length > limit;
    const pageDocs = hasNextPage ? docs.slice(0, limit) : docs;

    const items = pageDocs.map((d) => this.mapToDomain(d));

    const nextCursor = hasNextPage
      ? pageDocs[pageDocs.length - 1]._id.toString()
      : undefined;

    return {
      items,
      nextCursor,
    };
  }

  async findById(id: string): Promise<WeatherSnapshot | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.mapToDomain(doc) : null;
  }
}
