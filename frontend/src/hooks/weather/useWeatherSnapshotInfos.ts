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

    refetchInterval: snapshotId ? false : 10 * 60 * 1000,
    // refetchInterval: snapshotId ? false : 1 * 60 * 1000,

    refetchOnWindowFocus: false,
  })

  const snapshot = query.data
  const effectiveSnapshotId = snapshotId ?? snapshot?.id

  return {
    ...query,
    snapshot,
    effectiveSnapshotId,
  }
}
