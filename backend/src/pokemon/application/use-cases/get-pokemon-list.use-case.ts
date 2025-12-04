import { Inject, Injectable } from '@nestjs/common';
import {
  POKEMON_REPOSITORY,
  type IPokemonRepository,
} from '../../domain/pokemon.repository';
import { PokemonPaginationResponse } from '../../domain/pokemon.entity';

@Injectable()
export class GetPokemonListUseCase {
  constructor(
    @Inject(POKEMON_REPOSITORY)
    private readonly pokemonRepo: IPokemonRepository,
  ) {}

  async execute(
    offset: number,
    limit: number,
    name?: string,
  ): Promise<PokemonPaginationResponse> {
    return this.pokemonRepo.getPokemonList(offset, limit, name);
  }
}
