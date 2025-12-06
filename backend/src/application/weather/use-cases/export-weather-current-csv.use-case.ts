import { Inject, Injectable } from '@nestjs/common';
import {
  type IWeatherSnapshotRepository,
  WEATHER_SNAPSHOT_REPOSITORY,
} from '../../../domain/weather/weather-snapshot.repository';
import { WeatherExportMapper } from '../services/weather-export.mapper';

export interface ExportCurrentCsvInput {
  snapshotId?: string;
}

export interface ExportFileOutput {
  filename: string;
  mimeType: string;
  content: string;
}

@Injectable()
export class ExportWeatherCurrentCsvUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly repo: IWeatherSnapshotRepository,
    private readonly mapper: WeatherExportMapper,
  ) {}

  async execute(
    input: ExportCurrentCsvInput,
  ): Promise<ExportFileOutput | null> {
    const snapshot = input.snapshotId
      ? await this.repo.findById(input.snapshotId)
      : await this.repo.findLatest();

    if (!snapshot) {
      return null;
    }

    const row = this.mapper.toCurrentRow(snapshot);
    const csv = this.mapper.toCsv([row]);

    const filename =
      `weather_current_${snapshot.location.city}_${snapshot.fetchedAt}.csv`
        .replace(/[: ]/g, '_')
        .replace(/[^\w_.-]/g, '');

    return {
      filename,
      mimeType: 'text/csv; charset=utf-8',
      content: csv,
    };
  }
}
