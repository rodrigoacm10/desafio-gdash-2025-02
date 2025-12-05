import {
  AbilityDetail,
  MoveDetail,
  Pokemon,
  PokemonAbility,
  PokemonPaginationResponse,
  PokemonSpecies,
  PokemonType,
  TypeDetail,
} from './pokemon.entity';

export interface IPokemonRepository {
  getPokemonById(id: string): Promise<Pokemon | null>;
  getPokemonList(
    offset: number,
    limit: number,
    name?: string,
  ): Promise<PokemonPaginationResponse>;
  getPokemonMove(url: string): Promise<MoveDetail>;
  getPokemonAbilities(abilities: PokemonAbility[]): Promise<AbilityDetail[]>;
  getPokemonSpecies(url: string): Promise<PokemonSpecies>;
  getPokemonSpeciesEvolution(species: PokemonSpecies): Promise<Pokemon[]>;
  getPokemonTypes(types: PokemonType[]): Promise<TypeDetail[]>;
}

export const POKEMON_REPOSITORY = 'POKEMON_REPOSITORY';
