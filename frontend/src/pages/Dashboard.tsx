import { useQuery } from '@tanstack/react-query'

import { InfoCard } from '@/components/InfoCard'
import { api } from '@/lib/api'
import type { WeatherSnapshot } from '@/@types/weather'
import { formatDate } from '@/utils/formatters/formatData'
import DailyForecast from '@/components/DailyForecast'
import { TemperatureHourlyChart } from '@/components/charts/TemperatureHourlyChart'
import { RainProbabilityHourlyChart } from '@/components/charts/RainProbabilityHourlyChart'

export const Dashboard = () => {
  const {
    data: weatherData,
    isLoading,
    isError,
    error,
  } = useQuery<WeatherSnapshot, Error>({
    queryKey: ['weather-latest'],
    queryFn: async () => {
      const response = await api.get<WeatherSnapshot>('/weather/latest')
      return response.data
    },
  })

  if (isLoading) {
    return <p>Carregando último snapshot de clima...</p>
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

  const { location, current, fetchedAt } = weatherData

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

  console.log('WEATHER DATA ->', weatherData)

  return (
    <div className="h-full">
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

      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        <div className="min-h-60">
          <TemperatureHourlyChart hourly={weatherData.hourly} />
        </div>

        <div className="min-h-60">
          <RainProbabilityHourlyChart hourly={weatherData.hourly} />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-card">
        <DailyForecast daily={weatherData.daily} />
      </div>
    </div>
  )
}
