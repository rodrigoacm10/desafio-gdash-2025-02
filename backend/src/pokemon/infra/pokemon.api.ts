import axios from 'axios';
import {
  AbilityDetail,
  EvolutionChain,
  EvolutionNode,
  MoveDetail,
  Pokemon,
  PokemonAbility,
  PokemonPaginationResponse,
  PokemonSpecies,
  PokemonType,
  TypeDetail,
} from '../domain/pokemon.entity';

export const apiPokemon = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
});

export const getPokemonDetails = async (id: string): Promise<Pokemon> => {
  const { data } = await apiPokemon.get<Pokemon>(`pokemon/${id}`);
  return data;
};

export const getPokemonList = async (
  offset: number,
  limit: number,
  name?: string,
): Promise<PokemonPaginationResponse> => {
  const { data } = await apiPokemon.get<{
    results: { name: string; url: string }[];
    count: number;
  }>(`pokemon?offset=${offset}&limit=${limit}${name ? `&name=${name}` : ''}`);

  const pokemons = await Promise.all(
    data.results.map(async (p) => {
      const { data: details } = await apiPokemon.get<Pokemon>(
        `pokemon/${p.name}`,
      );
      return details;
    }),
  );

  return { pokemons, totalCount: data.count };
};

export const getPokemonMove = async (url: string): Promise<MoveDetail> => {
  const { data } = await apiPokemon.get(url);
  return data;
};

export const getPokemonAbilities = async (
  abilities: PokemonAbility[],
): Promise<AbilityDetail[]> => {
  const abilitiesFull = await Promise.all(
    abilities.map(async (ability) => {
      const { data } = await apiPokemon.get<AbilityDetail>(ability.ability.url);
      return data;
    }),
  );
  return abilitiesFull;
};

export const getPokemonSpecies = async (
  url: string,
): Promise<PokemonSpecies> => {
  const { data } = await apiPokemon.get(url);
  return data;
};

export const getPokemonSpeciesEvolution = async (
  species: PokemonSpecies,
): Promise<Pokemon[]> => {
  if (!species.evolution_chain?.url) return [];

  const { data } = await apiPokemon.get<EvolutionChain>(
    species.evolution_chain.url,
  );

  const evolutions: string[] = [];
  const traverse = (node: EvolutionNode) => {
    evolutions.push(node.species.name);

    if (node.evolves_to.length > 0) {
      node.evolves_to.forEach((child) => traverse(child));
    }
  };

  traverse(data.chain);

  const pokemons = await Promise.all(
    evolutions.map(async (name) => {
      const { data: details } = await apiPokemon.get(`pokemon/${name}`);
      return details;
    }),
  );

  return pokemons;
};

export const getPokemonTypes = async (
  types: PokemonType[],
): Promise<TypeDetail[]> => {
  const typeDetailsPromises = types.map((t) =>
    apiPokemon.get(t.type.url).then((res) => res.data),
  );

  const typeDetails = await Promise.all(typeDetailsPromises);

  return typeDetails;
};
