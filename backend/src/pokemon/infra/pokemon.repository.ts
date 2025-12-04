import { Injectable } from '@nestjs/common';
import { IPokemonRepository } from '../domain/pokemon.repository';
import { Pokemon, PokemonPaginationResponse } from '../domain/pokemon.entity';
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

  async getPokemonMove(url: string): Promise<any> {
    return getPokemonMove(url);
  }

  async getPokemonAbilities(abilities: any[]): Promise<any> {
    return getPokemonAbilities(abilities);
  }
  async getPokemonSpecies(url: any): Promise<any> {
    return getPokemonSpecies(url);
  }
  async getPokemonSpeciesEvolution(species: any): Promise<any> {
    return getPokemonSpeciesEvolution(species);
  }
  async getPokemonTypes(types: any[]): Promise<any> {
    return getPokemonTypes(types);
  }
}
