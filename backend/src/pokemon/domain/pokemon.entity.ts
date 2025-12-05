export interface PokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
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

// -------- MOVES ------------

export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number;
  priority: number;
  power: number | null;
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
  type: {
    name: string;
    url: string;
  };
  target: {
    name: string;
    url: string;
  };
}

// --------------- ABILITIES -----------------

export type PokemonSpecies = {
  base_happiness: number;
  capture_rate: number;
  color: { name: string; url: string };
  evolution_chain: { url: string };
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string; url: string };
    version: { name: string; url: string };
  }[];
  genera: { genus: string; language: { name: string } }[];
  habitat: { name: string; url: string } | null;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
};

export type EvolutionChain = {
  chain: EvolutionNode;
};

export type EvolutionNode = {
  species: { name: string; url: string };
  evolves_to: EvolutionNode[];
};

// --------------- ABILITIES ---------------------

export type AbilityDetail = {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};

// ------------- TYPES -----------------------

export interface DamageRelations {
  double_damage_from: Array<{ name: string; url: string }>;
  double_damage_to: Array<{ name: string; url: string }>;
  half_damage_from: Array<{ name: string; url: string }>;
  half_damage_to: Array<{ name: string; url: string }>;
  no_damage_from: Array<{ name: string; url: string }>;
  no_damage_to: Array<{ name: string; url: string }>;
}

export interface TypeDetail {
  id: number;
  name: string;
  damage_relations: DamageRelations;
}
