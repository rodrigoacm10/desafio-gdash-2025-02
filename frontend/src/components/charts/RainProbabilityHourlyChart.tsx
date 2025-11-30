import React, { useMemo } from 'react'
import { BarChart } from './bases/BarChart'

type HourlyItem = {
  timestamp: string
  rainProbability?: number
}

type RainProbabilityHourlyChartProps = {
  hourly: HourlyItem[]
}

// const PRIMARY = '#25a9e0'

const formatHour = (iso: string) => {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const RainProbabilityHourlyChart: React.FC<
  RainProbabilityHourlyChartProps
> = ({ hourly }) => {
  const chartData = useMemo(
    () =>
      (hourly ?? []).slice(0, 12).map((h) => ({
        time: formatHour(h.timestamp),
        rainProbabilityPercent: Math.round((h.rainProbability ?? 0) * 100),
      })),
    [hourly],
  )

  return (
    <BarChart
      title="Rain probability per hour (next 12h)"
      data={chartData}
      xKey="time"
      valueKey="rainProbabilityPercent"
      valueLabel="Rain probability (%)"
      fill="rgba(37, 169, 224, 0.6)"
    />
  )
}
