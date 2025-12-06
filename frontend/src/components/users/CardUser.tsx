import type { User } from '@/@types/user'
import { useState } from 'react'
import { AlertDelete } from './AlertDelete'
import { AlertEdit } from './AlertEdit'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical, IconTrash, IconPencil } from '@tabler/icons-react'
import { Button } from '../ui/button'

export const CardUser = ({ user }: { user: User }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

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

      <div className="flex items-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <IconDotsVertical className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" className="w-28" align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setIsEditOpen(true)
              }}
            >
              <IconPencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setIsDeleteOpen(true)
              }}
            >
              <IconTrash className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertEdit user={user} open={isEditOpen} onOpenChange={setIsEditOpen} />
        <AlertDelete
          user={user}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      </div>
    </div>
  )
}
