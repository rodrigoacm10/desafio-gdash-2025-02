'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain } from './NavMain'
import { NavUser } from './NavUser'
import { sidebar } from '@/config/sidebar'
import { useAuth } from '@/hooks/useAuth'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const sidebarFiltred = sidebar.filter((route) => {
    if (user?.role !== 'admin') {
      return route.title !== 'Users'
    }

    return route
  })

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="bg-[#f4f7fa]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img src="/gdash-logo-colorful.png" className="w-20" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#f4f7fa]">
        <NavMain items={sidebarFiltred} />
      </SidebarContent>
      <SidebarFooter className="bg-[#f4f7fa]">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
