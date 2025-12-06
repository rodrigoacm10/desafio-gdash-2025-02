import type { WeatherInsight } from '@/@types/weather-insights'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

type UseWeatherSnapshotInsightsParams = {
  snapshotId?: string | null
}

export const useWeatherSnapshotInsights = ({
  snapshotId,
}: UseWeatherSnapshotInsightsParams) => {
  const query = useQuery<WeatherInsight, AxiosError>({
    queryKey: ['weather-insight', snapshotId],
    enabled: !!snapshotId,
    queryFn: async () => {
      if (!snapshotId) {
        throw new Error('Snapshot ID não disponível para buscar insight.')
      }

      const response = await api.get<WeatherInsight>(
        `/weather/snapshot/insight/${snapshotId}`,
      )

      return response.data
    },
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false
      return failureCount < 3
    },
  })

  const isNotFound = query.isError && query.error?.response?.status === 404

  return {
    ...query,
    isNotFound,
  }
}
