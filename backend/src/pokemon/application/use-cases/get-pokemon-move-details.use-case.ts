import { Inject, Injectable } from '@nestjs/common';
import {
  POKEMON_REPOSITORY,
  type IPokemonRepository,
} from '../../domain/pokemon.repository';

@Injectable()
export class GetPokemonMoveDetailsUseCase {
  constructor(
    @Inject(POKEMON_REPOSITORY)
    private readonly pokemonRepo: IPokemonRepository,
  ) {}

  async execute(url: string): Promise<any> {
    return this.pokemonRepo.getPokemonMove(url);
  }
}
