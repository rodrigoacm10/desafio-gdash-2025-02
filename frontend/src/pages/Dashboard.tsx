import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/AppSideBar'
import { AppHeader } from '@/components/AppHeader'

const Dashboard = () => {
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
        <div className="rounded-b-2xl h-full rounded- bg-red-200 p-6">
          <main>
            <p className="text-slate-700">
              Você está autenticado e vendo uma rota protegida.
            </p>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboard
