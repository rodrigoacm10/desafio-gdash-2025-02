import axios from 'axios'; // Usando Axios para fazer as requisições HTTP
import { Pokemon, PokemonPaginationResponse } from '../domain/pokemon.entity';

export const apiPokemon = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
});

// Função para obter os detalhes de um Pokémon
export const getPokemonDetails = async (id: string): Promise<Pokemon> => {
  const { data } = await apiPokemon.get<Pokemon>(`pokemon/${id}`);
  return data;
};

// Função para obter a lista de Pokémons com paginação
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

// Função para obter os detalhes de um movimento específico
export const getPokemonMove = async (url: string): Promise<any> => {
  const { data } = await apiPokemon.get(url);
  return data;
};

// Função para obter os detalhes das habilidades de um Pokémon
export const getPokemonAbilities = async (abilities: any[]) => {
  const abilitiesFull = await Promise.all(
    abilities.map(async (ability) => {
      const { data } = await apiPokemon.get(ability.ability.url);
      return data;
    }),
  );
  return abilitiesFull;
};

// Função para obter os detalhes das espécies de um Pokémon
export const getPokemonSpecies = async (url: string) => {
  const { data } = await apiPokemon.get(url);
  return data;
};

// Função para obter a evolução de uma espécie de Pokémon
export const getPokemonSpeciesEvolution = async (species: any) => {
  if (!species.evolution_chain?.url) return [];

  const { data } = await apiPokemon.get(species.evolution_chain.url);

  const evolutions: string[] = [];
  const traverse = (node: any) => {
    evolutions.push(node.species.name);

    if (node.evolves_to.length > 0) {
      node.evolves_to.forEach((child: any) => traverse(child));
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

// Função para obter os tipos de um Pokémon
export const getPokemonTypes = async (types: any[]) => {
  const typeDetailsPromises = types.map((t) =>
    apiPokemon.get(t.type.url).then((res) => res.data),
  );

  const typeDetails = await Promise.all(typeDetailsPromises);

  return typeDetails;
};
