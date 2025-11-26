import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../infra/jwt-auth.guard';
import { Request } from 'express';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../../users/interfaces/http/dto/create-user.dto';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza login e retorna o JWT' })
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Cria um novo usuário (registro)' })
  async register(@Body() body: CreateUserDto) {
    return this.createUserUseCase.execute(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  async me(@Req() req: AuthenticatedRequest) {
    return {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
  }
}
