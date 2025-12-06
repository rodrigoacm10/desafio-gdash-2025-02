import { Injectable } from '@nestjs/common';
import { WeatherSnapshot } from '../../../domain/weather/weather-snapshot.entity';

export interface CurrentExportRow {
  snapshotId: string | null;
  fetchedAt: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  locationLat: number;
  locationLon: number;
  locationTimezone: string;
  timestamp: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  dewPoint?: number;
  uvi?: number;
  clouds?: number;
  visibility?: number;
  windSpeed?: number;
  windDeg?: number;
  rainLastHour?: number;
  rainProbability?: number;
  conditionId: number | null;
  conditionMain: string | null;
  conditionDescription: string | null;
  conditionIcon: string | null;
  sourceDt?: number;
  sunrise?: number;
  sunset?: number;
}

@Injectable()
export class WeatherExportMapper {
  toCurrentRow(snapshot: WeatherSnapshot): CurrentExportRow {
    const c = snapshot.current;

    return {
      snapshotId: snapshot.id,
      fetchedAt: snapshot.fetchedAt,
      locationCity: snapshot.location.city,
      locationState: snapshot.location.state,
      locationCountry: snapshot.location.country,
      locationLat: snapshot.location.lat,
      locationLon: snapshot.location.lon,
      locationTimezone: snapshot.location.timezone,
      timestamp: c.timestamp,
      temperature: c.temperature,
      feelsLike: c.feelsLike,
      humidity: c.humidity,
      pressure: c.pressure,
      dewPoint: c.dewPoint,
      uvi: c.uvi,
      clouds: c.clouds,
      visibility: c.visibility,
      windSpeed: c.windSpeed,
      windDeg: c.windDeg,
      rainLastHour: c.rainLastHour,
      rainProbability: c.rainProbability,
      conditionId: c.condition?.id ?? null,
      conditionMain: c.condition?.main ?? null,
      conditionDescription: c.condition?.description ?? null,
      conditionIcon: c.condition?.icon ?? null,
      sourceDt: c.metadata?.sourceDt,
      sunrise: c.metadata?.sunrise,
      sunset: c.metadata?.sunset,
    };
  }

  toCsv<T extends CurrentExportRow>(
    rows: T[],
    orderedColumns?: (keyof T)[],
  ): string {
    if (!rows.length) return '';

    const columns =
      orderedColumns && orderedColumns.length
        ? orderedColumns
        : (Object.keys(rows[0]) as (keyof T)[]);

    const escape = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const header = columns.join(',');
    const data = rows
      .map((row) => columns.map((col) => escape(row[col])).join(','))
      .join('\n');

    return `${header}\n${data}`;
  }
}
