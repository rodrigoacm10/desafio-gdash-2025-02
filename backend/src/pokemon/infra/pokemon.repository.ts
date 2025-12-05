import { Injectable } from '@nestjs/common';
import { IPokemonRepository } from '../domain/pokemon.repository';
import {
  AbilityDetail,
  MoveDetail,
  Pokemon,
  PokemonAbility,
  PokemonPaginationResponse,
  PokemonSpecies,
  PokemonType,
  TypeDetail,
} from '../domain/pokemon.entity';
import {
  getPokemonDetails,
  getPokemonList,
  getPokemonMove,
  getPokemonAbilities,
  getPokemonSpecies,
  getPokemonSpeciesEvolution,
  getPokemonTypes,
} from './pokemon.api';

@Injectable()
export class PokemonRepository implements IPokemonRepository {
  async getPokemonById(id: string): Promise<Pokemon | null> {
    try {
      return await getPokemonDetails(id);
    } catch (error) {
      return null;
    }
  }

  async getPokemonList(
    offset: number,
    limit: number,
    name?: string,
  ): Promise<PokemonPaginationResponse> {
    return getPokemonList(offset, limit, name);
  }

  async getPokemonMove(url: string): Promise<MoveDetail> {
    return getPokemonMove(url);
  }

  async getPokemonAbilities(
    abilities: PokemonAbility[],
  ): Promise<AbilityDetail[]> {
    return getPokemonAbilities(abilities);
  }
  async getPokemonSpecies(url: string): Promise<PokemonSpecies> {
    return getPokemonSpecies(url);
  }
  async getPokemonSpeciesEvolution(
    species: PokemonSpecies,
  ): Promise<Pokemon[]> {
    return getPokemonSpeciesEvolution(species);
  }
  async getPokemonTypes(types: PokemonType[]): Promise<TypeDetail[]> {
    return getPokemonTypes(types);
  }
}
