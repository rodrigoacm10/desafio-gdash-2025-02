export type Stats = {
  base_stat: number
  stat: { name: string; url: string }
}

export type Abilities = {
  ability: { name: string; url: string }
  is_hidden: boolean
  slot: number
}

export type Moves = {
  move: { name: string; url: string }
  version_group_details: {
    level_learned_at: number | undefined
    move_learn_method: { name: string }
    version_group: { name: string }
  }[]
}

export type Types = {
  slot: number
  type: { name: string; url: string }
}

export type Pokemon = {
  id: number
  name: string
  height: number
  weight: number
  abilities: Abilities[]
  types: Types[]
  stats: Stats[]
  moves: Moves[]
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
    versions: {
      'generation-v': {
        'black-white': {
          animated: {
            front_default: string
          }
        }
      }
    }
  }
  species: {
    name: string
    url: string
  }
  cries: {
    latest: string
    legacy: string
  }
}

export type PokemonResponse = {
  pokemons: Pokemon[]
  totalCount: number
}
