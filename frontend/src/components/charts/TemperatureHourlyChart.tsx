import React, { useMemo } from 'react'
import { LineChart } from './bases/LineChart'

type HourlyItem = {
  timestamp: string
  temperature: number
  feelsLike: number
}

type TemperatureHourlyChartProps = {
  hourly: HourlyItem[]
}

const PRIMARY = '#156e6a'
const SECONDARY = '#f97316'

const formatHour = (iso: string) => {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const TemperatureHourlyChart: React.FC<TemperatureHourlyChartProps> = ({
  hourly,
}) => {
  const chartData = useMemo(
    () =>
      (hourly ?? []).slice(0, 12).map((h) => ({
        time: formatHour(h.timestamp),
        temperature: h.temperature,
        feelsLike: h.feelsLike,
      })),
    [hourly],
  )

  return (
    <LineChart
      title="Temperature per hour (next 12h)"
      data={chartData}
      xKey="time"
      lines={[
        {
          dataKey: 'temperature',
          name: 'Temperature (°C)',
          stroke: PRIMARY,
          // fill: 'rgba(37, 169, 224, 0.25)',
        },
        {
          dataKey: 'feelsLike',
          name: 'Feels like (°C)',
          stroke: SECONDARY,
          strokeDasharray: '4 4',
          // fill: 'rgba(249, 115, 22, 0.15)',
        },
      ]}
    />
  )
}
