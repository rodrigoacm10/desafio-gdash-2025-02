import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { User } from '@/@types/user'
import { CardUser } from '@/components/users/CardUser'

const USERS_QUERY_KEY = ['users']

export const Users = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get<User[]>('/users')
      return response.data
    },
  })

  return (
    <div>
      <p className="text-3xl font-bold text-[#156e6a]">Usuários</p>
      <p className="text-accent-foreground mb-6">
        usuários registrados no sistema
      </p>

      {isLoading && <p>Carregando usuários...</p>}

      {isError && (
        <p className="text-red-500">
          Erro ao carregar usuários:{' '}
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {users && users.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum usuário encontrado.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {users?.map((user) => (
              <CardUser key={user.id} user={user} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
