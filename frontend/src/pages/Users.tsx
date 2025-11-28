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
      <p className="text-3xl font-bold text-[#156e6a]">Users</p>
      <p className="text-accent-foreground mb-6">users registred on system</p>

      {isLoading && <p>Loading users...</p>}

      {isError && (
        <p className="text-red-500">
          Error loading users:
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {users && users.length === 0 && (
            <p className="text-sm text-muted-foreground">No users found.</p>
          )}

          <div className="flex flex-col gap-2">
            {users?.map((user) => (
              <CardUser user={user} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
