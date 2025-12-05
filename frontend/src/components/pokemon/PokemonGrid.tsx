import type { Pokemon } from '@/@types/pokemon'
import { PokemonCard } from './PokemonCard'

export const PokemonGrid = ({ pokemons }: { pokemons: Pokemon[] }) => {
  return (
    <div
      className="
        grid gap-4
        grid-cols-1
        min-[450px]:grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
      "
    >
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} className="w-full  ">
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </div>
  )
}
