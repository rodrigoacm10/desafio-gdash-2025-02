import { Pokemon, PokemonPaginationResponse } from './pokemon.entity';

export interface IPokemonRepository {
  getPokemonById(id: string): Promise<Pokemon | null>;
  getPokemonList(
    offset: number,
    limit: number,
    name?: string,
  ): Promise<PokemonPaginationResponse>;
  getPokemonMove(url: string): Promise<any>;
  getPokemonAbilities(abilities: any[]): Promise<any>;
  getPokemonSpecies(url: string): Promise<any>;
  getPokemonSpeciesEvolution(species: string): Promise<any>;
  getPokemonTypes(types: any[]): Promise<any>;
}

export const POKEMON_REPOSITORY = 'POKEMON_REPOSITORY';
