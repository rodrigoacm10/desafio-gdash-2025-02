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

import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const USERS_QUERY_KEY = ['users']

export const AlertDelete = ({
  user,
  userSelectedId,
  changeUserSelectedId,
  children,
}: {
  user: Partial<User>
  userSelectedId?: string | null
  changeUserSelectedId?: (value: string | null) => void
} & React.ComponentProps<'div'>) => {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      changeUserSelectedId && changeUserSelectedId(null)
    },
  })

  const handleConfirmDelete = () => {
    if (!userSelectedId) return
    deleteMutation.mutate(userSelectedId)
  }

  return (
    <AlertDialog
      open={userSelectedId === user.id}
      onOpenChange={(open) => {
        if (open) {
          changeUserSelectedId && changeUserSelectedId(user.id as string)
        } else {
          changeUserSelectedId && changeUserSelectedId(null)
        }
      }}
    >
      {children}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user{' '}
            <span className="font-semibold">{user.name}</span> and remove all
            their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            className="text-white hover:cursor-pointer bg-destructive hover:bg-destructive/90"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
