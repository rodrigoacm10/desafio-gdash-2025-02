import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ExportWeatherQueryDto {
  @ApiPropertyOptional({
    description:
      'ID do snapshot a ser exportado. Se não informado, usa o snapshot mais recente.',
  })
  @IsOptional()
  @IsString()
  snapshotId?: string;
}
