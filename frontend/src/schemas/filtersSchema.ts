import { z } from 'zod'

export const filtersSchema = z
  .object({
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true
      return new Date(data.startDate) <= new Date(data.endDate)
    },
    {
      message: 'Data inicial não pode ser maior que a data final.',
      path: ['endDate'],
    },
  )

export type FiltersForm = z.infer<typeof filtersSchema>
