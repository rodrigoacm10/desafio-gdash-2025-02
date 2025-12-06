import type { WeatherInsight } from '@/@types/weather-insights'
import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type CreateInsightVariables = {
  snapshotId: string
}

export const useCreateWeatherSnapshotInsight = () => {
  const queryClient = useQueryClient()

  return useMutation<WeatherInsight, Error, CreateInsightVariables>({
    mutationFn: async ({ snapshotId }) => {
      const response = await api.post<WeatherInsight>(
        `/weather/snapshot/insight/${snapshotId}`,
      )

      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<WeatherInsight>(
        ['weather-insight', variables.snapshotId],
        data,
      )
    },
  })
}
