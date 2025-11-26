import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { JwtStrategy } from './infra/jwt.strategy';
import { JwtAuthGuard } from './infra/jwt-auth.guard';
import { JwtTokenService } from './infra/jwt-token.service';
import { TOKEN_SERVICE } from './domain/token.service';
import { AuthController } from './interfaces/http/auth.controller';
import { CreateUserUseCase } from 'src/users/application/use-cases/create-user.use-case';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET') ?? 'changeme';
        const expiresIn = config.get('JWT_EXPIRES_IN') ?? '1h';
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
    JwtStrategy,
    JwtAuthGuard,
    CreateUserUseCase,
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
