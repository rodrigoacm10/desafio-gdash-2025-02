import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AuthDefault from '@/components/layouts/AuthDefault'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: '123456',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null)

    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setApiError('Credenciais inválidas ou erro ao autenticar.')
    }
  }

  return (
    <AuthDefault title="Entre na sua conta" func={handleSubmit(onSubmit)}>
      {apiError && <p className="mb-4 text-sm text-red-600">{apiError}</p>}

      <label className="block mb-4">
        <span className="block  font-medium mb-1">E-mail</span>
        <Input
          type="email"
          placeholder="seuemail@gmail.com"
          className="!px-4 !py-5 !text-[16px]"
          {...register('email')}
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </label>

      <label className="block mb-6">
        <span className="block text-sm font-medium mb-1">Senha</span>
        <Input
          type="password"
          placeholder="******"
          className="!px-4 !py-5 !text-[16px]"
          {...register('password')}
        />

        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </label>

      <Button
        disabled={isSubmitting}
        type="submit"
        size="lg"
        className="text-[16px] w-full py-5 px-4  bg-[#156e6a] text-white font-semibold hover:bg-[#115c58] disabled:opacity-70"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </AuthDefault>
  )
}
