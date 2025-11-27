import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
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
  )
}

export default Dashboard
