'use client'

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconTrash,
} from '@tabler/icons-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { AlertDelete } from '../users/AlertDelete'
import { AlertDialogTrigger } from '../ui/alert-dialog'
import { useState } from 'react'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()
  const [userBeingDeletedId, setUserBeingDeletedId] = useState<string | null>(
    null,
  )

  return (
    <>
      {user ? (
        <SidebarMenu>
          <SidebarMenuItem>
            <AlertDelete
              user={user}
              userSelectedId={userBeingDeletedId}
              changeUserSelectedId={setUserBeingDeletedId}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <IconUserCircle className="!w-8 !h-8" />

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user?.email}
                      </span>
                    </div>
                    <IconDotsVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <IconUserCircle className="w-8 h-8" />

                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.name}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>
                      <IconTrash />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <DropdownMenuItem onClick={logout}>
                    <IconLogout />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </AlertDelete>
          </SidebarMenuItem>
        </SidebarMenu>
      ) : (
        <p>not found</p>
      )}
    </>
  )
}
