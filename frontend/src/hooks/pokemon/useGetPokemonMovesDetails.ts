import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { MoveDetail } from '@/@types/moves'

export function usePokemonMovesDetails(url: string) {
  return useQuery<MoveDetail, Error>({
    queryKey: ['move', url],
    queryFn: async () => {
      const { data } = await api.get<MoveDetail>('/pokemon/moves', {
        params: { url },
      })
      return data
    },
    enabled: !!url,
  })
}
