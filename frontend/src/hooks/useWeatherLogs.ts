import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { WeatherSnapshot } from '@/@types/weather'
import { buildDateRange } from '@/utils/buildDateRange'

const PAGE_LIMIT_DEFAULT = 10

export type WeatherLogsResponse = {
  items: WeatherSnapshot[]
  nextCursor?: string | null
}

type UseWeatherLogsParams = {
  startDate?: string | null
  endDate?: string | null
  limit?: number
}

export const useWeatherLogs = ({
  startDate,
  endDate,
  limit = PAGE_LIMIT_DEFAULT,
}: UseWeatherLogsParams) => {
  const query = useInfiniteQuery<WeatherLogsResponse, Error>({
    queryKey: [
      'weather-logs',
      {
        limit,
        startDate: startDate || null,
        endDate: endDate || null,
      },
    ],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const { startDate: normalizedStart, endDate: normalizedEnd } =
        buildDateRange(startDate || null, endDate || null)

      const response = await api.get<WeatherLogsResponse>('/weather/logs', {
        params: {
          limit,
          cursor: pageParam ?? undefined,
          startDate: normalizedStart,
          endDate: normalizedEnd,
        },
      })

      return response.data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
  })

  const snapshots = query.data?.pages.flatMap((page) => page.items) ?? []

  return {
    ...query,
    snapshots,
  }
}
