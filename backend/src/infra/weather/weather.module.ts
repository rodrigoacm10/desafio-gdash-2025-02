import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WEATHER_SNAPSHOT_REPOSITORY } from '../../domain/weather/weather-snapshot.repository';
import {
  WeatherSnapshotDocument,
  WeatherSnapshotSchema,
} from './mongo/weather-snapshot.schema';
import { WeatherSnapshotMongoRepository } from './mongo/weather-snapshot-mongo.repository';
import { GetLatestSnapshotUseCase } from '../../application/weather/use-cases/get-latest-weather-snapshot.use-case';
import { SaveWeatherSnapshotUseCase } from '../../application/weather/use-cases/save-weather-snapshot.use-case';
import { WeatherController } from '../../interfaces/weather/http/weather.controller';
import { ListWeatherLogsUseCase } from '../../application/weather/use-cases/list-weather-logs.use-case';
import { GetSnapshotUseCase } from '../../application/weather/use-cases/get-weather-snapshot.use-case';
import { WeatherExportMapper } from '../../application/weather/services/weather-export.mapper';
import { ExportWeatherCurrentCsvUseCase } from '../../application/weather/use-cases/export-weather-current-csv.use-case';
import { ExportWeatherCurrentXlsxUseCase } from '../../application/weather/use-cases/export-weather-current-xlsx.use-case';
import { WEATHER_INSIGHT_REPOSITORY } from '../../domain/weather/weather-insight.repository';
import { WeatherInsightMongoRepository } from './mongo/weather-insight-mongo.repository';
import { WEATHER_INSIGHTS_LLM } from '../../application/weather/ports/weather-insights-llm.port';
import { OpenAIWeatherInsightsProvider } from './openai/openai-weather-insights.provider';
import { GetOrCreateWeatherInsightUseCase } from '../../application/weather/use-cases/get-or-create-weather-insight.use-case';
import {
  WeatherInsightDocument,
  WeatherInsightSchema,
} from './mongo/weather-insight.schema';

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
