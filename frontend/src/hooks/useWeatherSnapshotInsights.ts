import type { WeatherInsight } from '@/@types/weather-insights'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const useWeatherSnapshotInsights = ({
  snapshotId,
}: {
  snapshotId?: string | null
}) => {
  return useQuery<WeatherInsight, Error>({
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
  })
}
