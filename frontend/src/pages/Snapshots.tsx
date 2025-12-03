import { SnapshotCard } from '@/components/snapshots/SnapshotCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { filtersSchema, type FiltersForm } from '@/schemas/filtersSchema'
import { useWeatherLogs } from '@/hooks/useWeatherLogs'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const PAGE_LIMIT = 10

export const Snapshots = () => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<FiltersForm>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  })

  const startDateInput = watch('startDate')
  const endDateInput = watch('endDate')

  const {
    snapshots,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useWeatherLogs({
    startDate: startDateInput || null,
    endDate: endDateInput || null,
    limit: PAGE_LIMIT,
  })

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isLoadingMore: isFetchingNextPage,
    onLoadMore: () => {
      fetchNextPage()
    },
  })

  return (
    <div>
      <p className="text-3xl font-bold text-[#156e6a]">Weather snapshots</p>
      <p className="text-accent-foreground mb-4">
        Histórico de snapshots de clima
      </p>

      <form
        className="flex flex-wrap items-end gap-3 mb-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Data inicial
          </span>
          <Input type="date" className="w-48 h-10" {...register('startDate')} />
          {errors.startDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.startDate.message}
            </p>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Data final
          </span>
          <Input type="date" className="w-48 h-10" {...register('endDate')} />
          {errors.endDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.endDate.message}
            </p>
          )}
        </label>

        {(startDateInput || endDateInput) && (
          <Button
            variant="ghost"
            type="button"
            onClick={() =>
              reset({
                startDate: '',
                endDate: '',
              })
            }
          >
            Limpar filtro
          </Button>
        )}
      </form>

      {isLoading && <p>Carregando snapshots...</p>}

      {isError && (
        <p className="text-red-500">
          Erro ao carregar snapshots:{' '}
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {snapshots.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum snapshot encontrado.
            </p>
          )}

          <div className="flex flex-col gap-2 mb-4">
            {snapshots.map((snapshot) => (
              <SnapshotCard key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>

          <div
            ref={loadMoreRef}
            className="h-10 flex items-center justify-center"
          >
            {isFetchingNextPage ? (
              <p className="text-xs text-muted-foreground">
                Carregando mais...
              </p>
            ) : hasNextPage ? (
              <p className="text-xs text-muted-foreground">
                Role para carregar mais
              </p>
            ) : (
              snapshots.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Você chegou ao fim do histórico.
                </p>
              )
            )}
          </div>

          {isFetching && !isFetchingNextPage && (
            <p className="text-xs text-muted-foreground mt-1">Atualizando...</p>
          )}
        </>
      )}
    </div>
  )
}
