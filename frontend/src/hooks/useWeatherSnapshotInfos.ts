import type { WeatherSnapshot } from '@/@types/weather'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const useWeatherSnapshotInfos = ({
  snapshotId,
}: {
  snapshotId: string | null
}) => {
  const query = useQuery<WeatherSnapshot, Error>({
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

  const snapshot = query.data
  const effectiveSnapshotId = snapshotId ?? snapshot?.id

  return {
    ...query,
    snapshot,
    effectiveSnapshotId,
  }
}
