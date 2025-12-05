import type { PokemonResponse } from '@/@types/pokemon'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import { PokemonGrid } from '@/components/pokemon/PokemonGrid'
import { PokemonSearch } from '@/components/pokemon/PokemonSearch'
import { StateMessage } from '@/components/StateMessage'
import { usePokemonList } from '@/hooks/pokemon/usePokemonList'
import { PaginationComplete } from '@/components/PaginationComplete'

export function PokemonList() {
  const {
    data,
    isLoading,
    isFetching,
    error,
    currentPage,
    itemsPerPage,
    handlePageChange,
  } = usePokemonList()

  return (
    <div className="flex flex-col flex-1 h-full">
      <p className="text-3xl font-bold text-[#156e6a]">Pokémons</p>
      <p className="text-accent-foreground mb-6">List of registered Pokémons</p>

      <div className="w-full flex justify-end items-center my-6">
        <PokemonSearch redirectToHome={false} />
      </div>

      <HandleState
        loading={isLoading}
        data={data}
        error={error}
        fetching={isFetching}
      />

      <div className="mt-8 flex justify-center">
        <PaginationComplete
          data={data}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

const HandleState = ({
  loading,
  fetching,
  data,
  error,
}: {
  loading: boolean
  fetching: boolean
  data: PokemonResponse | undefined
  error: Error | null
}) => {
  if (loading || fetching) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <LoadingIcon />
        <p className="text-gray-600 font-semibold">Loading Pokémons...</p>
      </div>
    )
  }

  if (error) {
    return (
      <StateMessage
        img="../../public/error-icon.png"
        alt="Error Icon"
        text="Error loading Pokémons"
        color="text-[#a40000]"
      />
    )
  }

  if (data?.pokemons?.length === 0) {
    return (
      <StateMessage
        img="../../public/not-found-icon.png"
        alt="Not Found Icon"
        text="No Pokémon found"
        color="text-[#6d6e71]"
      />
    )
  }

  if (data?.pokemons && data.pokemons.length > 0) {
    return <PokemonGrid pokemons={data.pokemons} />
  }

  return (
    <StateMessage
      img="../../public/error-icon.png"
      alt="Error Icon"
      text="Unexpected error"
      color="text-[#a40000]"
    />
  )
}
