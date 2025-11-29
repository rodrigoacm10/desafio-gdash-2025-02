export const buildDateRange = (
  startStr: string | null,
  endStr: string | null,
) => {
  let startDate: string | undefined
  let endDate: string | undefined

  if (startStr) {
    const start = new Date(`${startStr}T00:00:00`)
    startDate = start.toISOString()
  }

  if (endStr) {
    const end = new Date(`${endStr}T23:59:59.999`)
    endDate = end.toISOString()
  }

  return { startDate, endDate }
}
