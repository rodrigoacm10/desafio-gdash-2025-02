import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { type Request, type Response } from 'express';

import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokensUseCase } from '../../application/use-cases/refresh-tokens.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';

import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../infra/jwt-auth.guard';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../../users/interfaces/http/dto/create-user.dto';

import { setRefreshCookie, clearRefreshCookie } from '../../infra/auth.cookies';

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
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Realiza login e retorna o JWT' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(body);

    setRefreshCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
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

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Gera novo access token a partir do refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['refresh_token'];

    if (!token) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const result = await this.refreshTokensUseCase.execute(token);

    setRefreshCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Efetua logout e limpa o refresh token' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];

    if (token) {
      await this.logoutUseCase.execute(token);
    }

    clearRefreshCookie(res);
    return { success: true };
  }
}
