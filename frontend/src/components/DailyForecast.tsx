import type { WeatherDailyEntry } from '@/@types/weather'
import React from 'react'

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
}

const toCsvValue = (value: unknown) => {
  if (value === null || value === undefined) return '""'
  const str = String(value).replace(/"/g, '""')
  return `"${str}"`
}

const DailyForecast = ({ daily }: { daily: WeatherDailyEntry[] }) => {
  const handleDownloadCsv = React.useCallback(() => {
    const days = (daily || []).slice(0, 7)

    const header = [
      'Data',
      'Temperatura mínima (°C)',
      'Temperatura máxima (°C)',
      'Temperatura de dia (°C)',
      'Temperatura de noite (°C)',
      'Probabilidade de chuva (%)',
      'Chuva (mm)',
      'Umidade (%)',
      'Vento (m/s)',
      'Direção do vento (°)',
      'UVI',
      'Condição',
      'Descrição',
    ]

    const rows = days.map((day) => {
      const rainProb = Math.round((day.rainProbability ?? 0) * 100)

      return [
        formatDate(day.date),
        day.tempMin != null ? day.tempMin.toFixed(1) : '',
        day.tempMax != null ? day.tempMax.toFixed(1) : '',
        day.tempDay != null ? day.tempDay.toFixed(1) : '',
        day.tempNight != null ? day.tempNight.toFixed(1) : '',
        rainProb,
        day.rainAmount != null ? day.rainAmount.toFixed(1) : '',
        day.humidity ?? '',
        day.windSpeed != null ? day.windSpeed.toFixed(1) : '',
        day.windDeg ?? '',
        day.uvi != null ? day.uvi.toFixed(1) : '',
        day.condition?.main ?? '',
        day.condition?.description ?? '',
      ]
    })

    const csvContent = [
      header.map(toCsvValue).join(','),
      ...rows.map((row) => row.map(toCsvValue).join(',')),
    ].join('\r\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)

    link.href = url
    link.setAttribute('download', `previsao-diaria-${today}.csv`)
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [daily])

  const days = (daily || []).slice(0, 7)

  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Previsão Diária</p>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-sidebar-border/60 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted dark:border-sidebar-border"
          onClick={handleDownloadCsv}
        >
          Baixar CSV
        </button>
      </div>

      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-sidebar-border/60 text-xs text-muted-foreground uppercase dark:border-sidebar-border">
            <tr>
              <th className="py-3 pr-5">Data</th>
              <th className="py-3 pr-5">Temp. Min / Max</th>
              <th className="py-3 pr-5">Dia / Noite</th>
              <th className="py-3 pr-5">Chuva</th>
              <th className="py-3 pr-5">Umidade</th>
              <th className="py-3 pr-5">Vento</th>
              <th className="py-3 pr-5">UV</th>
              <th className="py-3 pr-5">Condição</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr
                key={day.date}
                className="border-b border-sidebar-border/40 last:border-b-0 dark:border-sidebar-border"
              >
                <td className="py-3 pr-5">{formatDate(day.date)}</td>
                <td className="py-3 pr-5">
                  {day.tempMin?.toFixed(1)}°C / {day.tempMax?.toFixed(1)}°C
                </td>
                <td className="py-3 pr-5">
                  {day.tempDay?.toFixed(1)}°C / {day.tempNight?.toFixed(1)}°C
                </td>
                <td className="py-3 pr-5">
                  {Math.round((day.rainProbability ?? 0) * 100)}%
                  {day.rainAmount != null && (
                    <span> ({day.rainAmount.toFixed(1)} mm)</span>
                  )}
                </td>
                <td className="py-3 pr-5">{day.humidity}%</td>
                <td className="py-3 pr-5">
                  {day.windSpeed?.toFixed(1)} m/s ({day.windDeg}°)
                </td>
                <td className="py-3 pr-5">{day.uvi?.toFixed(1)}</td>
                <td className="py-3 pr-5">
                  <span className="block text-xs font-medium">
                    {day.condition?.main}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {day.condition?.description}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DailyForecast
