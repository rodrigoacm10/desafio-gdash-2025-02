import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './config/mongo.module';
import { UsersModule } from './users/users.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    MongoModule,
    UsersModule,
    AuthModule,
    WeatherModule,
    BootstrapModule,
  ],
})
export class AppModule {}
