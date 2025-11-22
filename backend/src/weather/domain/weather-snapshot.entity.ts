export interface WeatherCondition {
  id: number | null;
  main: string | null;
  description: string | null;
  icon: string | null;
}

export interface WeatherCurrent {
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
  condition: WeatherCondition;
  metadata?: Record<string, any>;
}

export interface WeatherHourlyEntry extends WeatherCurrent {}

export interface WeatherDailyEntry {
  date: string;
  tempMin?: number;
  tempMax?: number;
  tempDay?: number;
  tempNight?: number;
  humidity?: number;
  pressure?: number;
  dewPoint?: number;
  windSpeed?: number;
  windDeg?: number;
  uvi?: number;
  clouds?: number;
  rainProbability?: number;
  rainAmount?: number;
  condition: WeatherCondition;
  metadata?: Record<string, any>;
}

export interface WeatherSnapshotLocation {
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  timezoneOffset: number;
}

export class WeatherSnapshot {
  constructor(
    public readonly id: string | null,
    public readonly provider: string,
    public readonly type: string,
    public readonly location: WeatherSnapshotLocation,
    public readonly fetchedAt: string,
    public readonly current: WeatherCurrent,
    public readonly hourly: WeatherHourlyEntry[],
    public readonly daily: WeatherDailyEntry[],
    public readonly createdAt?: Date,
  ) {}
}
