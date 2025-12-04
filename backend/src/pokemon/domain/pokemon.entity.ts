export interface PokemonAbility {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStats {
  base_stat: number;
  stat: { name: string; url: string };
}

export interface PokemonMove {
  move: { name: string; url: string };
  version_group_details: {
    level_learned_at: number | undefined;
    move_learn_method: { name: string };
    version_group: { name: string };
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  types: PokemonType[];
  stats: PokemonStats[];
  moves: PokemonMove[];
  sprites: any;
  species: {
    name: string;
    url: string;
  };
  cries: {
    latest: string;
    legacy: string;
  };
}

export interface PokemonPaginationResponse {
  pokemons: Pokemon[];
  totalCount: number;
}
