type WeatherSummaryProps = {
  summary?: string
  isLoading: boolean
  isError: boolean
  error?: Error
}

export const WeatherSummary = ({
  summary,
  isLoading,
  isError,
  error,
}: WeatherSummaryProps) => {
  return (
    <div className="px-4 py-2 mt-3 text-sm border rounded-2xl border-sidebar-border/40 bg-card/60">
      <p className="font-semibold text-[#156e6a] mb-1">Resumo climático:</p>

      {isLoading && (
        <p className="text-xs text-muted-foreground">
          Gerando insights de IA para este snapshot...
        </p>
      )}

      {isError && (
        <p className="text-xs text-red-500">
          Erro ao carregar insights:{' '}
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
      )}

      {!isLoading && !isError && summary && <p>{summary}</p>}

      {!isLoading && !isError && !summary && (
        <p className="text-xs text-muted-foreground">
          Nenhum resumo disponível para este snapshot.
        </p>
      )}
    </div>
  )
}
