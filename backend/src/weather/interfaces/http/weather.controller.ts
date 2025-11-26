import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateWeatherSnapshotDto } from './dto/create-weather-snapshot.dto';
import { SaveWeatherSnapshotUseCase } from '../../application/use-cases/save-weather-snapshot.use-case';
import { GetLatestSnapshotUseCase } from '../../application/use-cases/get-latest-weather-snapshot.use-case';
import { WeatherSnapshot } from '../../domain/weather-snapshot.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infra/jwt-auth.guard';
import { ListWeatherLogsQueryDto } from './dto/list-weather-logs.query.dto';
import { ListWeatherLogsUseCase } from 'src/weather/application/use-cases/list-weather-logs.use-case';

@ApiTags('weather')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weather')
export class WeatherController {
  constructor(
    private readonly saveSnapshot: SaveWeatherSnapshotUseCase,
    private readonly getLatest: GetLatestSnapshotUseCase,
    private readonly listLogsUseCase: ListWeatherLogsUseCase,
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
}
