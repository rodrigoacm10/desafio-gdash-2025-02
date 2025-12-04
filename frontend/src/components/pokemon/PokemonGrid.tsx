import type { Pokemon } from '@/@types/pokemon'
import { PokemonCard } from './PokemonCard'

export const PokemonGrid = ({ pokemons }: { pokemons: Pokemon[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} className="w-full  ">
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </div>
  )
}
