import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/AppSideBar'
import { AppHeader } from '@/components/AppHeader'

const DashboardLayout = ({ children }: React.ComponentProps<'div'>) => {
  return (
    <SidebarProvider
      // style={
      //   {
      //     '--sidebar-width': 'calc(var(--spacing) * 72)',
      //     '--header-height': 'calc(var(--spacing) * 12)',
      //   } as React.CSSProperties
      // }
      style={
        {
          backgroundColor: '#f4f7fa',
          '--sidebar-width': '200px',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        <div className="rounded-b-2xl h-full bg-white p-6">
          <main className="h-full">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
