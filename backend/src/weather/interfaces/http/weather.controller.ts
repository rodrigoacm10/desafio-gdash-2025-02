import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateWeatherSnapshotDto } from './dto/create-weather-snapshot.dto';
import { SaveWeatherSnapshotUseCase } from '../../application/use-cases/save-weather-snapshot.use-case';
import { GetLatestSnapshotUseCase } from '../../application/use-cases/get-latest-weather-snapshot.use-case';
import { WeatherSnapshot } from '../../domain/weather-snapshot.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(
    private readonly saveSnapshot: SaveWeatherSnapshotUseCase,
    private readonly getLatest: GetLatestSnapshotUseCase,
  ) {}

  @Post('snapshot')
  save(@Body() dto: CreateWeatherSnapshotDto): Promise<WeatherSnapshot> {
    return this.saveSnapshot.execute(dto);
  }

  @Get('latest')
  latest(): Promise<WeatherSnapshot | null> {
    return this.getLatest.execute();
  }
}
