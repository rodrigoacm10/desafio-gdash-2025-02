import { Inject, Injectable } from '@nestjs/common';
import {
  type IWeatherSnapshotRepository,
  WEATHER_SNAPSHOT_REPOSITORY,
} from '../../domain/weather-snapshot.repository';
import {
  CurrentExportRow,
  WeatherExportMapper,
} from '../services/weather-export.mapper';
import * as ExcelJS from 'exceljs';

export interface ExportCurrentXlsxInput {
  snapshotId?: string;
}

export interface ExportCurrentXlsxOutput {
  filename: string;
  mimeType: string;
  buffer: ExcelJS.Buffer;
}

@Injectable()
export class ExportWeatherCurrentXlsxUseCase {
  constructor(
    @Inject(WEATHER_SNAPSHOT_REPOSITORY)
    private readonly repo: IWeatherSnapshotRepository,
    private readonly mapper: WeatherExportMapper,
  ) {}

  async execute(
    input: ExportCurrentXlsxInput,
  ): Promise<ExportCurrentXlsxOutput | null> {
    const snapshot = input.snapshotId
      ? await this.repo.findById(input.snapshotId)
      : await this.repo.findLatest();

    if (!snapshot) {
      return null;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Current');

    const rowData: CurrentExportRow = this.mapper.toCurrentRow(snapshot);
    const columns = Object.keys(rowData);

    sheet.addRow(columns);

    sheet.addRow(columns.map((c) => rowData[c] ?? null));

    sheet.columns.forEach((column) => {
      let maxLength = 10;

      column.eachCell?.((cell) => {
        const value = cell.value;
        const length =
          value === null || value === undefined ? 0 : String(value).length;
        if (length > maxLength) {
          maxLength = length;
        }
      });

      column.width = maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const filename =
      `weather_current_${snapshot.location.city}_${snapshot.fetchedAt}.xlsx`
        .replace(/[: ]/g, '_')
        .replace(/[^\w_.-]/g, '');

    return {
      filename,
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer,
    };
  }
}
