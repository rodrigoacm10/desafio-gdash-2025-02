import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { RefreshTokensUseCase } from '../../application/auth/use-cases/refresh-tokens.use-case';
import { LogoutUseCase } from '../../application/auth/use-cases/logout.use-case';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtTokenService } from './jwt/jwt-token.service';
import { TOKEN_SERVICE } from '../../domain/auth/token.service';
import { AuthController } from '../../interfaces/auth/http/auth.controller';
import { AdminGuard } from './jwt/admin.guard';
import { CreateUserUseCase } from 'src/application/users/use-cases/create-user.use-case';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret =
          config.get<string>('JWT_ACCESS_SECRET') ?? 'changeme-access';
        const expiresIn = config.get('JWT_ACCESS_EXPIRES_IN') ?? '15m';
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RefreshTokensUseCase,
    LogoutUseCase,
    JwtStrategy,
    JwtAuthGuard,
    AdminGuard,
    CreateUserUseCase,
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
  ],
  exports: [JwtAuthGuard, AdminGuard],
})
export class AuthModule {}
