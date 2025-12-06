import { z } from 'zod'

export const editUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
})

export type EditUserFormData = z.infer<typeof editUserSchema>
