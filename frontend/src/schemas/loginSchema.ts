import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
