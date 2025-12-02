import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome é obrigatório'),
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    password: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
    confirmPassword: z
      .string()
      .min(4, 'Confirmação deve ter pelo menos 4 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })

export type RegisterFormData = z.infer<typeof registerSchema>
