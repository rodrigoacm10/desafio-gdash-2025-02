import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

type ProtectedRouteProps = {
  roles?: string[]
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <div>Carregando sessão...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
