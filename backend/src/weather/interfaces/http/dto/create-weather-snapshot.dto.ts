import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ConditionDto {
  @IsOptional()
  @IsNumber()
  id: number | null;

  @IsOptional()
  @IsString()
  main: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  icon: string;
}

class CurrentDto {
  @IsString()
  timestamp: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  feelsLike: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  pressure: number;

  @IsOptional()
  @IsNumber()
  dewPoint?: number;

  @IsOptional()
  @IsNumber()
  uvi?: number;

  @IsOptional()
  @IsNumber()
  clouds?: number;

  @IsOptional()
  @IsNumber()
  visibility?: number;

  @IsOptional()
  @IsNumber()
  windSpeed?: number;

  @IsOptional()
  @IsNumber()
  windDeg?: number;

  @IsOptional()
  @IsNumber()
  rainLastHour?: number;

  @IsOptional()
  @IsNumber()
  rainProbability?: number;

  @ValidateNested()
  @Type(() => ConditionDto)
  condition: ConditionDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

class HourlyEntryDto extends CurrentDto {}

class DailyEntryDto {
  @IsString()
  date: string;

  @IsOptional()
  @IsNumber()
  tempMin?: number;

  @IsOptional()
  @IsNumber()
  tempMax?: number;

  @IsOptional()
  @IsNumber()
  tempDay?: number;

  @IsOptional()
  @IsNumber()
  tempNight?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  pressure?: number;

  @IsOptional()
  @IsNumber()
  dewPoint?: number;

  @IsOptional()
  @IsNumber()
  windSpeed?: number;

  @IsOptional()
  @IsNumber()
  windDeg?: number;

  @IsOptional()
  @IsNumber()
  uvi?: number;

  @IsOptional()
  @IsNumber()
  clouds?: number;

  @IsOptional()
  @IsNumber()
  rainProbability?: number;

  @IsOptional()
  @IsNumber()
  rainAmount?: number;

  @ValidateNested()
  @Type(() => ConditionDto)
  condition: ConditionDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

class LocationDto {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;

  @IsString()
  timezone: string;

  @IsNumber()
  timezoneOffset: number;
}

export class CreateWeatherSnapshotDto {
  @IsString()
  provider: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsString()
  fetchedAt: string;

  @ValidateNested()
  @Type(() => CurrentDto)
  current: CurrentDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HourlyEntryDto)
  hourly: HourlyEntryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyEntryDto)
  daily: DailyEntryDto[];
}
