import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import { InfoCard } from '@/components/InfoCard'
import { api } from '@/lib/api'
import type { WeatherSnapshot } from '@/@types/weather'
import { formatDate } from '@/utils/formatters/formatData'
import DailyForecast from '@/components/DailyForecast'
import { TemperatureHourlyChart } from '@/components/charts/TemperatureHourlyChart'
import { RainProbabilityHourlyChart } from '@/components/charts/RainProbabilityHourlyChart'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { handleDownload } from '@/hooks/downloadExport'
import type { WeatherInsight } from '@/@types/weather-insights'
import { WeatherSummary } from '@/components/insights/WeatherSummary'
import { InsightsAccordion } from '@/components/insights/InsightsAccordion'
import { AlertsAccordion } from '@/components/insights/AlertsAccordion'

export const Dashboard = () => {
  const [searchParams] = useSearchParams()
  const snapshotId = searchParams.get('snapshotId')

  const {
    data: weatherData,
    isLoading,
    isError,
    error,
  } = useQuery<WeatherSnapshot, Error>({
    queryKey: ['weather-snapshot', snapshotId ?? 'latest'],
    queryFn: async () => {
      if (snapshotId) {
        const response = await api.get<WeatherSnapshot>(
          `/weather/snapshot/${snapshotId}`,
        )
        return response.data
      }

      const response = await api.get<WeatherSnapshot>('/weather/latest')
      return response.data
    },
  })

  const effectiveSnapshotId = snapshotId ?? weatherData?.id

  const {
    data: insight,
    isLoading: isInsightLoading,
    isError: isInsightError,
    error: insightError,
  } = useQuery<WeatherInsight, Error>({
    queryKey: ['weather-insight', effectiveSnapshotId],
    enabled: !!effectiveSnapshotId,
    queryFn: async () => {
      if (!effectiveSnapshotId) {
        throw new Error('Snapshot ID não disponível para buscar insight.')
      }

      const response = await api.get<WeatherInsight>(
        `/weather/snapshot/insight/${effectiveSnapshotId}`,
      )
      return response.data
    },
  })

  if (isLoading) {
    return <p>Carregando snapshot de clima...</p>
  }

  if (isError) {
    return (
      <p className="text-red-500">
        Erro ao carregar dados de clima:{' '}
        {error instanceof Error ? error.message : 'Erro desconhecido'}
      </p>
    )
  }

  if (!weatherData) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum dado de clima disponível.
      </p>
    )
  }

  const { location, current, fetchedAt, id: currentSnapshotId } = weatherData

  const headerDate = fetchedAt
    ? formatDate(fetchedAt)
    : current?.timestamp
    ? formatDate(current.timestamp)
    : '-'

  const dewPointText =
    current.dewPoint != null ? `${current.dewPoint.toFixed(1)}°C` : 'N/A'

  const uviText = current.uvi != null ? current.uvi.toFixed(1) : '-'

  const rainLastHourText =
    current.rainLastHour != null ? current.rainLastHour : 0

  const rainProbabilityPercent = Math.round(
    (current.rainProbability ?? 0) * 100,
  )

  const comfortIndexText =
    insight?.metrics?.comfortIndex != null ? insight.metrics.comfortIndex : '--'

  return (
    <div className="h-full">
      <div className="flex justify-between gap-4 mb-2">
        <div className="font-bold flex items-center gap-2 text-xl">
          <p className="text-muted-foreground">Comfort:</p>
          <p className="text-[#156e6a]">
            {isInsightLoading ? '...' : comfortIndexText}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="py-5 px-4 font-bold cursor-pointer"
            variant="outline"
            type="button"
            onClick={() =>
              handleDownload(
                'xlsx',
                snapshotId ?? currentSnapshotId
                  ? snapshotId ?? currentSnapshotId
                  : undefined,
              )
            }
          >
            XLSX <Download className="ml-2 h-4 w-4" />
          </Button>

          <Button
            className="bg-[#156e6a] hover:bg-[#115c58] py-5 px-4 font-bold cursor-pointer"
            type="button"
            onClick={() =>
              handleDownload(
                'csv',
                snapshotId ?? currentSnapshotId
                  ? snapshotId ?? currentSnapshotId
                  : undefined,
              )
            }
          >
            CSV <Download className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-bold break-words text-[#25a9e0] sm:text-xl md:text-2xl">
            <span>
              {headerDate} - {location.city}
            </span>
          </p>

          <p className="text-sm text-[#7bb6e0] sm:text-base">
            ({location.state ? `${location.state} - ` : ''}
            {location.country})
          </p>

          {(snapshotId || currentSnapshotId) && (
            <p className="text-xs text-muted-foreground">
              Snapshot ID:{' '}
              <span className="font-mono">
                {snapshotId ?? currentSnapshotId}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm md:text-base">
          <span className="hidden text-muted-foreground md:inline">|</span>

          <div className="flex flex-wrap items-center gap-2">
            <p>lat: {location.lat}</p>
            <span className="hidden sm:inline">•</span>
            <p>lon: {location.lon}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          title="Current Temperature"
          main={`${current.temperature.toFixed(1)}°C`}
          lines={[`Feels like: ${current.feelsLike.toFixed(1)}°C`]}
        />

        <InfoCard
          title="Relative Humidity"
          main={`${current.humidity}%`}
          lines={[`Dew point: ${dewPointText}`]}
        />

        <InfoCard
          title="Wind"
          main={`${current.windSpeed?.toFixed(1) ?? '-'} m/s`}
          lines={[
            `Direction: ${current.windDeg}°`,
            `Clouds: ${current.clouds}%`,
          ]}
        />

        <InfoCard
          title="UV Index & Rain"
          main={`UVI: ${uviText}`}
          lines={[
            `Rain last hour: ${rainLastHourText} mm`,
            `Rain probability now: ${rainProbabilityPercent}%`,
          ]}
        />
      </div>

      <WeatherSummary
        summary={insight?.summary}
        isLoading={isInsightLoading}
        isError={isInsightError}
        error={insightError instanceof Error ? insightError : undefined}
      />

      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        <div className="min-h-60">
          <TemperatureHourlyChart hourly={weatherData.hourly} />
        </div>

        <div className="min-h-60">
          <RainProbabilityHourlyChart hourly={weatherData.hourly} />
        </div>

        <InsightsAccordion
          insights={insight?.insights}
          isLoading={isInsightLoading}
          isError={isInsightError}
          error={insightError instanceof Error ? insightError : undefined}
        />

        <AlertsAccordion
          alerts={insight?.alerts}
          isLoading={isInsightLoading}
          isError={isInsightError}
          error={insightError instanceof Error ? insightError : undefined}
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-card">
        <DailyForecast daily={weatherData.daily} />
      </div>
    </div>
  )
}
