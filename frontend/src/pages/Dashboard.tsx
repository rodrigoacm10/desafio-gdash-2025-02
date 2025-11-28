import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '../contexts/AuthContext'
import { AppSidebar } from '@/components/sidebar/AppSideBar'

const Dashboard = () => {
  const { user, logout } = useAuth()

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
          '--sidebar-width': '200px',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="h-full rounded-lg bg-red-200 p-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </header>

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
