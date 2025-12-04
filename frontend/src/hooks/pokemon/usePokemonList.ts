import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { setCurrentPage } from '@/store/pokemonSlice'
import { useAppDispatch, useAppSelector } from '../redux'

export function usePokemonList() {
  const dispatch = useAppDispatch()
  const { currentPage, itemsPerPage, searchTerm } = useAppSelector(
    (state) => state.pokemon,
  )

  const query = useQuery({
    queryKey: ['pokemons', currentPage, itemsPerPage, searchTerm],
    queryFn: async () => {
      const { data } = await api.get('/pokemon', {
        params: {
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          name: searchTerm || undefined,
        },
      })
      return data
    },
    placeholderData: keepPreviousData,
  })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return {
    ...query,
    currentPage,
    itemsPerPage,
    handlePageChange,
  }
}
