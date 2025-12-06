import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateWeatherSnapshotDto } from './dto/create-weather-snapshot.dto';
import { WeatherSnapshot } from '../../../domain/weather/weather-snapshot.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infra/auth/jwt/jwt-auth.guard';
import { ListWeatherLogsQueryDto } from './dto/list-weather-logs.query.dto';
import { ExportWeatherQueryDto } from './dto/export-weather.query.dto';
import { type Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { ListWeatherLogsUseCase } from 'src/application/weather/use-cases/list-weather-logs.use-case';
import { GetSnapshotUseCase } from 'src/application/weather/use-cases/get-weather-snapshot.use-case';
import { ExportWeatherCurrentCsvUseCase } from 'src/application/weather/use-cases/export-weather-current-csv.use-case';
import { ExportWeatherCurrentXlsxUseCase } from 'src/application/weather/use-cases/export-weather-current-xlsx.use-case';
import { WeatherInsight } from 'src/domain/weather/weather-insight.entity';
import { SaveWeatherSnapshotUseCase } from 'src/application/weather/use-cases/save-weather-snapshot.use-case';
import { GetLatestSnapshotUseCase } from 'src/application/weather/use-cases/get-latest-weather-snapshot.use-case';
import { GetOrCreateWeatherInsightUseCase } from 'src/application/weather/use-cases/get-or-create-weather-insight.use-case';
import { GetWeatherInsightUseCase } from 'src/application/weather/use-cases/get-weather-insight.use-case';
import { CreateWeatherInsightUseCase } from 'src/application/weather/use-cases/create-weather-insight.use-case';

@ApiTags('weather')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weather')
export class WeatherController {
  constructor(
    private readonly saveSnapshot: SaveWeatherSnapshotUseCase,
    private readonly getLatest: GetLatestSnapshotUseCase,
    private readonly listLogsUseCase: ListWeatherLogsUseCase,
    private readonly getSnapshot: GetSnapshotUseCase,
    private readonly exportCurrentCsv: ExportWeatherCurrentCsvUseCase,
    private readonly exportCurrentXlsx: ExportWeatherCurrentXlsxUseCase,
    private readonly getOrCreateInsight: GetOrCreateWeatherInsightUseCase,
    private readonly getInsight: GetWeatherInsightUseCase,
    private readonly createInsight: CreateWeatherInsightUseCase,
  ) {}

  @Post('snapshot')
  @ApiOperation({
    summary: 'Salva um snapshot de clima (chamado pelo worker Go)',
  })
  save(@Body() dto: CreateWeatherSnapshotDto): Promise<WeatherSnapshot> {
    return this.saveSnapshot.execute(dto);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Retorna o snapshot mais recente' })
  latest(): Promise<WeatherSnapshot | null> {
    return this.getLatest.execute();
  }

  @Get('snapshot/:id')
  @ApiOperation({ summary: 'Finds a snapshot by ID' })
  findOne(@Param('id') id: string): Promise<WeatherSnapshot | null> {
    return this.getSnapshot.execute(id);
  }

  @Get('logs')
  @ApiOperation({
    summary:
      'Lista snapshots (logs) com paginação por cursor e filtros opcionais de data',
  })
  async logs(@Query() query: ListWeatherLogsQueryDto) {
    const { limit, cursor, startDate, endDate } = query;

    const result = await this.listLogsUseCase.execute({
      limit,
      cursor,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return {
      items: result.items,
      nextCursor: result.nextCursor,
    };
  }

  @Get('export/csv')
  @ApiOperation({
    summary:
      'Exporta os dados CURRENT de um snapshot em CSV (usa o mais recente se snapshotId não for informado)',
  })
  async exportCurrentCsvRoute(
    @Query() query: ExportWeatherQueryDto,
    @Res() res: Response,
  ) {
    const result = await this.exportCurrentCsv.execute({
      snapshotId: query.snapshotId,
    });

    if (!result) {
      throw new NotFoundException(
        'Nenhum snapshot encontrado para exportação.',
      );
    }

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`,
    );
    res.send(result.content);
  }

  @Get('export/xlsx')
  @ApiOperation({
    summary:
      'Exporta os dados CURRENT de um snapshot em XLSX (usa o mais recente se snapshotId não for informado)',
  })
  async exportCurrentXlsxRoute(
    @Query() query: ExportWeatherQueryDto,
    @Res() res: Response,
  ) {
    const result = await this.exportCurrentXlsx.execute({
      snapshotId: query.snapshotId,
    });

    if (!result) {
      throw new NotFoundException(
        'Nenhum snapshot encontrado para exportação.',
      );
    }

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`,
    );
    res.send(result.buffer);
  }

  // @Get('snapshot/insight/:id')
  // @ApiOperation({
  //   summary:
  //     'Retorna o insight relacionado ao snapshot. Se não existir, gera via ChatGPT, salva e retorna.',
  // })
  // async getOrCreateInsightRoute(
  //   @Param('id') id: string,
  // ): Promise<WeatherInsight> {
  //   return this.getOrCreateInsight.execute(id);
  // }

  @Post('snapshot/insight/:id')
  @ApiOperation({
    summary: 'Retorna o insight gerado via ChatGPT, salva e retorna.',
  })
  async CreateInsightRoute(@Param('id') id: string): Promise<WeatherInsight> {
    return this.createInsight.execute(id);
  }

  @Get('snapshot/insight/:id')
  @ApiOperation({
    summary: 'Retorna o insight relacionado ao snapshot.',
  })
  async getInsightRoute(@Param('id') id: string): Promise<WeatherInsight> {
    return this.getInsight.execute(id);
  }
}
