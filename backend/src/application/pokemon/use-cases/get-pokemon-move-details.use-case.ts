import { Inject, Injectable } from '@nestjs/common';
import {
  POKEMON_REPOSITORY,
  type IPokemonRepository,
} from '../../../domain/pokemon/pokemon.repository';
import { MoveDetail } from 'src/domain/pokemon/pokemon.entity';

@Injectable()
export class GetPokemonMoveDetailsUseCase {
  constructor(
    @Inject(POKEMON_REPOSITORY)
    private readonly pokemonRepo: IPokemonRepository,
  ) {}

  async execute(url: string): Promise<MoveDetail> {
    return await this.pokemonRepo.getPokemonMove(url);
  }
}
