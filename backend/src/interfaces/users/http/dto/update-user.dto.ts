import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { type UserRole } from '../../../../domain/users/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New user name',
    example: 'John Doe Updated',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'New user email',
    example: 'john.new@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'New user password',
    minLength: 6,
    example: 'newPassword123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'New user role',
    enum: ['admin', 'user'],
    example: 'admin',
  })
  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: UserRole;
}
