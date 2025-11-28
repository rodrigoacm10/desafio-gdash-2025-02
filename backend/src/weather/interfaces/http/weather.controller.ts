import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateWeatherSnapshotDto } from './dto/create-weather-snapshot.dto';
import { SaveWeatherSnapshotUseCase } from '../../application/use-cases/save-weather-snapshot.use-case';
import { GetLatestSnapshotUseCase } from '../../application/use-cases/get-latest-weather-snapshot.use-case';
import { WeatherSnapshot } from '../../domain/weather-snapshot.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infra/jwt-auth.guard';
import { ListWeatherLogsQueryDto } from './dto/list-weather-logs.query.dto';
import { ListWeatherLogsUseCase } from 'src/weather/application/use-cases/list-weather-logs.use-case';
import { GetSnapshotUseCase } from 'src/weather/application/use-cases/get-weather-snapshot.use-case';

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

  @Get(':id')
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

  // via fazer um post/get que passe o ID do snapshot, isso vai fazer um find para ver os dados vai ver se tem algum insight relacionado ao snapshot, caso não tenha vai criar um insight, depois disso vai relacionar o insight com o snapshot, e vai retornar os dados do insight relacionado desse id de snapshot.
}
