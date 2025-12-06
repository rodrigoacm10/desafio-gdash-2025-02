import type { User } from '@/@types/user'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editUserSchema, type EditUserFormData } from '@/schemas/editUserSchema'

const USERS_QUERY_KEY = ['users']

export const AlertEdit = ({
  user,
  open,
  onOpenChange,
}: {
  user: Partial<User>
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name ?? '',
    },
  })

  const editMutation = useMutation({
    mutationFn: async (data: EditUserFormData) => {
      await api.patch(`/users/${user.id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      onOpenChange(false)
    },
  })

  const onSubmit = (data: EditUserFormData) => {
    if (!user.id) return
    editMutation.mutate(data)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Altere o nome do usuário{' '}
              <span className="font-semibold text-[#156e6a]">{user.name}</span>{' '}
              abaixo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-muted-foreground"
            >
              Novo nome
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Digite o novo nome"
              autoComplete="off"
              className="!px-4 !py-5 !text-[16px]"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              type="button"
              className="py-5 px-4 font-bold cursor-pointer text-[#156e6a]"
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              type="submit"
              className="bg-[#156e6a] hover:bg-[#115c58] py-5 px-4 font-bold cursor-pointer"
              disabled={editMutation.isPending || isSubmitting}
            >
              {editMutation.isPending || isSubmitting
                ? 'Salvando...'
                : 'Salvar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
