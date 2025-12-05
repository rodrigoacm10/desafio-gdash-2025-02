import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  POKEMON_REPOSITORY,
  type IPokemonRepository,
} from '../../domain/pokemon.repository';

@Injectable()
export class GetPokemonDetailsUseCase {
  constructor(
    @Inject(POKEMON_REPOSITORY)
    private readonly pokemonRepo: IPokemonRepository,
  ) {}

  async execute(id: string) {
    const pokemon = await this.pokemonRepo.getPokemonById(id);
    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }
    const species = await this.pokemonRepo.getPokemonSpecies(
      pokemon.species.url,
    );
    const abilities = await this.pokemonRepo.getPokemonAbilities(
      pokemon.abilities,
    );
    const chain = await this.pokemonRepo.getPokemonSpeciesEvolution(species);
    const types = await this.pokemonRepo.getPokemonTypes(pokemon.types);

    return { pokemon, species, abilities, chain, types };
  }
}
