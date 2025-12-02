import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AuthDefault from '@/components/layouts/AuthDefault'
import { registerSchema, type RegisterFormData } from '@/schemas/registerSchema'

export const Register = () => {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'user',
        }),
      })

      if (!response.ok) {
        let message = 'Erro ao registrar usuário.'
        try {
          const body = await response.json()
          if (body?.message) {
            message = body.message
          }
        } catch {}
        throw new Error(message)
      }

      navigate('/login')
    } catch (err) {
      console.error(err)
      setApiError(
        err instanceof Error
          ? err.message
          : 'Erro inesperado ao registrar usuário.',
      )
    }
  }

  return (
    <AuthDefault title="Crie sua conta" func={handleSubmit(onSubmit)}>
      {apiError && <p className="mb-4 text-sm text-red-600">{apiError}</p>}

      <label className="block mb-4">
        <span className="block font-medium mb-1">Nome</span>
        <Input
          type="text"
          placeholder="Seu nome completo"
          className="!px-4 !py-5 !text-[16px]"
          {...register('name')}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </label>

      <label className="block mb-4">
        <span className="block font-medium mb-1">E-mail</span>
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

      <label className="block mb-4">
        <span className="block font-medium mb-1">Senha</span>
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

      <label className="block mb-6">
        <span className="block font-medium mb-1">Confirmar senha</span>
        <Input
          type="password"
          placeholder="******"
          className="!px-4 !py-5 !text-[16px]"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </label>

      <Button
        disabled={isSubmitting}
        type="submit"
        size="lg"
        className="text-[16px] w-full py-5 px-4 bg-[#156e6a] text-white font-semibold hover:bg-[#115c58] disabled:opacity-70"
      >
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </Button>

      <div className="flex justify-between">
        <Link to="/">
          <Button
            variant="link"
            className="text-[#156e6a] font-bold hover:text-[#115c58] p-0"
          >
            voltar
          </Button>
        </Link>

        <Link to="/login">
          <Button
            variant="link"
            className="text-[#156e6a] font-bold hover:text-[#115c58] p-0"
          >
            possuo conta
          </Button>
        </Link>
      </div>
    </AuthDefault>
  )
}
