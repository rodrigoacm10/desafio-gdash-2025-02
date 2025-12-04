export type PokemonSpecies = {
  base_happiness: number
  capture_rate: number
  color: { name: string; url: string }
  evolution_chain: { url: string }
  flavor_text_entries: {
    flavor_text: string
    language: { name: string; url: string }
    version: { name: string; url: string }
  }[]
  genera: { genus: string; language: { name: string } }[]
  habitat: { name: string; url: string } | null
  is_legendary: boolean
  is_mythical: boolean
  is_baby: boolean
}

// type EvolutionChain = {
//   chain: EvolutionNode
// }

// type EvolutionNode = {
//   species: { name: string; url: string }
//   evolves_to: EvolutionNode[]
// }
