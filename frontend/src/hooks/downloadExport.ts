import { api } from '@/lib/api'

export const handleDownload = async (
  type: 'csv' | 'xlsx',
  snapshotId: string | null | undefined,
) => {
  try {
    const endpoint =
      type === 'csv' ? '/weather/export/csv' : '/weather/export/xlsx'

    const params = snapshotId ? { snapshotId: snapshotId } : undefined

    const response = await api.get(endpoint, {
      params,
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type:
        type === 'csv'
          ? 'text/csv;charset=utf-8;'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    const ext = type === 'csv' ? 'csv' : 'xlsx'
    const filename = `weather_${snapshotId ?? 'latest'}.${ext}`

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Erro ao exportar arquivo', err)
    alert('Erro ao exportar arquivo. Tente novamente.')
  }
}
