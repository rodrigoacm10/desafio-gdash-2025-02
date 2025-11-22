import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  IWeatherSnapshotRepository,
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

  // async findLatest(): Promise<WeatherSnapshot | null> {
  async findLatest(): Promise<WeatherSnapshot | null> {
    const doc = await this.model.findOne().sort({ createdAt: -1 }).exec();
    // return doc ? this.mapToDomain(doc) : { data: 0};
    return doc ? this.mapToDomain(doc) : null;
  }

  async list(limit = 50): Promise<WeatherSnapshot[]> {
    const docs = await this.model
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return docs.map((d) => this.mapToDomain(d));
  }

  async findByDateRange(start: Date, end: Date): Promise<WeatherSnapshot[]> {
    const docs = await this.model
      .find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({ createdAt: 1 })
      .exec();

    return docs.map((d) => this.mapToDomain(d));
  }
}
