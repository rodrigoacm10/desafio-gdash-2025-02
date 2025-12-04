import { useQuery } from '@tanstack/react-query'
import { type Pokemon } from '@/@types/pokemon'
import type { PokemonSpecies } from '@/@types/species'
import type { AbilityDetail } from '@/@types/abilities'
import { api } from '@/lib/api'
import type { TypeDetail } from '@/@types/types'

export function useGetPokemonDetails(id?: string) {
  return useQuery<
    {
      pokemon: Pokemon
      species: PokemonSpecies
      abilities: AbilityDetail[]
      chain: Pokemon[]
      types: TypeDetail[]
    },
    Error
  >({
    queryKey: ['pokemon', id],
    queryFn: async () => {
      const { data } = await api.get(`/pokemon/detail/${id}`)
      return data
    },
    enabled: !!id,
  })
}
