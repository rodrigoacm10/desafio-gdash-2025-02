import type { User } from '@/@types/user'
import { useState } from 'react'
import { AlertDelete } from './AlertDelete'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical, IconTrash } from '@tabler/icons-react'
import { Button } from '../ui/button'
import { AlertDialogTrigger } from '../ui/alert-dialog'

export const CardUser = ({ user }: { user: User }) => {
  const [userBeingDeletedId, setUserBeingDeletedId] = useState<string | null>(
    null,
  )

  return (
    <div
      key={user.id}
      className="border px-5 py-4 rounded-2xl flex justify-between items-start"
    >
      <div>
        <p className="text-[#156e6a] text-xl font-bold mb-1">{user.name}</p>
        <p className="text-sm">{user.email}</p>
        <p className="text-xs text-muted-foreground">Role: {user.role}</p>
      </div>

      <AlertDelete
        user={user}
        userSelectedId={userBeingDeletedId}
        changeUserSelectedId={setUserBeingDeletedId}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <IconDotsVertical className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" className="w-24" align="end">
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <IconTrash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDelete>
    </div>
  )
}
