import { Module } from '@nestjs/common';
import { PokemonController } from './interfaces/http/pokemon.controller';
import { PokemonRepository } from './infra/pokemon.repository';
import { GetPokemonDetailsUseCase } from './application/use-cases/get-pokemon-details.use-case';
import { GetPokemonListUseCase } from './application/use-cases/get-pokemon-list.use-case';
import { GetPokemonMoveDetailsUseCase } from './application/use-cases/get-pokemon-move-details.use-case';
import { POKEMON_REPOSITORY } from './domain/pokemon.repository';

@Module({
  controllers: [PokemonController],
  providers: [
    { provide: POKEMON_REPOSITORY, useClass: PokemonRepository },
    GetPokemonDetailsUseCase,
    GetPokemonListUseCase,
    GetPokemonMoveDetailsUseCase,
  ],
})
export class PokemonModule {}
