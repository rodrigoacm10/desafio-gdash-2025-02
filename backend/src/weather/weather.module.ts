import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WEATHER_SNAPSHOT_REPOSITORY } from './domain/weather-snapshot.repository';
import {
  WeatherSnapshotDocument,
  WeatherSnapshotSchema,
} from './infra/mongo/weather-snapshot.schema';
import { WeatherSnapshotMongoRepository } from './infra/mongo/weather-snapshot-mongo.repository';
import { GetLatestSnapshotUseCase } from './application/use-cases/get-latest-weather-snapshot.use-case';
import { SaveWeatherSnapshotUseCase } from './application/use-cases/save-weather-snapshot.use-case';
import { WeatherController } from './interfaces/http/weather.controller';
import { ListWeatherLogsUseCase } from './application/use-cases/list-weather-logs.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WeatherSnapshotDocument.name,
        schema: WeatherSnapshotSchema,
      },
    ]),
  ],
  controllers: [WeatherController],
  providers: [
    {
      provide: WEATHER_SNAPSHOT_REPOSITORY,
      useClass: WeatherSnapshotMongoRepository,
    },
    SaveWeatherSnapshotUseCase,
    GetLatestSnapshotUseCase,
    ListWeatherLogsUseCase,
  ],
  exports: [WEATHER_SNAPSHOT_REPOSITORY],
})
export class WeatherModule {}
