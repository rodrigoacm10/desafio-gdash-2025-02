import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListWeatherLogsQueryDto {
  @ApiPropertyOptional({
    description: 'Quantidade máxima de itens por página',
    default: 50,
    minimum: 1,
    maximum: 200,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor da próxima página (id do último item retornado)',
    example: '6750325dcbdf3f2e93a1c4f1',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Data de início do filtro (ISO 8601)',
    example: '2025-11-20T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de fim do filtro (ISO 8601)',
    example: '2025-11-21T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
