import { Module } from '@nestjs/common';
import { PokemonController } from '../../interfaces/pokemon/http/pokemon.controller';
import { PokemonRepository } from '../../infra/pokemon/api/pokemon.repository';
import { GetPokemonDetailsUseCase } from '../../application/pokemon/use-cases/get-pokemon-details.use-case';
import { GetPokemonListUseCase } from '../../application/pokemon/use-cases/get-pokemon-list.use-case';
import { GetPokemonMoveDetailsUseCase } from '../../application/pokemon/use-cases/get-pokemon-move-details.use-case';
import { POKEMON_REPOSITORY } from '../../domain/pokemon/pokemon.repository';

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
