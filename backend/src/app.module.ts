import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './infra/weather/weather.module';
import { PokemonModule } from './infra/pokemon/pokemon.module';
import { UsersModule } from './infra/users/users.module';
import { AuthModule } from './infra/auth/auth.module';
import { MongoModule } from './infra/config/mongo.module';
import { BootstrapModule } from './infra/bootstrap/bootstrap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    PokemonModule,
    MongoModule,
    UsersModule,
    AuthModule,
    WeatherModule,
    BootstrapModule,
  ],
})
export class AppModule {}
