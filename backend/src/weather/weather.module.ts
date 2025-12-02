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
import { GetSnapshotUseCase } from './application/use-cases/get-weather-snapshot.use-case';
import { WeatherExportMapper } from './application/services/weather-export.mapper';
import { ExportWeatherCurrentCsvUseCase } from './application/use-cases/export-weather-current-csv.use-case';
import { ExportWeatherCurrentXlsxUseCase } from './application/use-cases/export-weather-current-xlsx.use-case';
import { WEATHER_INSIGHT_REPOSITORY } from './domain/weather-insight.repository';
import { WeatherInsightMongoRepository } from './infra/mongo/weather-insight-mongo.repository';
import { WEATHER_INSIGHTS_LLM } from './application/ports/weather-insights-llm.port';
import { OpenAIWeatherInsightsProvider } from './infra/openai/openai-weather-insights.provider';
import { GetOrCreateWeatherInsightUseCase } from './application/use-cases/get-or-create-weather-insight.use-case';
import {
  WeatherInsightDocument,
  WeatherInsightSchema,
} from './infra/mongo/weather-insight.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WeatherSnapshotDocument.name,
        schema: WeatherSnapshotSchema,
      },
      { name: WeatherInsightDocument.name, schema: WeatherInsightSchema },
    ]),
  ],
  controllers: [WeatherController],
  providers: [
    {
      provide: WEATHER_SNAPSHOT_REPOSITORY,
      useClass: WeatherSnapshotMongoRepository,
    },
    {
      provide: WEATHER_INSIGHT_REPOSITORY,
      useClass: WeatherInsightMongoRepository,
    },
    {
      provide: WEATHER_INSIGHTS_LLM,
      useClass: OpenAIWeatherInsightsProvider,
    },
    SaveWeatherSnapshotUseCase,
    GetLatestSnapshotUseCase,
    GetSnapshotUseCase,
    ListWeatherLogsUseCase,

    WeatherExportMapper,
    ExportWeatherCurrentCsvUseCase,
    ExportWeatherCurrentXlsxUseCase,

    GetOrCreateWeatherInsightUseCase,
  ],
  exports: [WEATHER_SNAPSHOT_REPOSITORY],
})
export class WeatherModule {}
