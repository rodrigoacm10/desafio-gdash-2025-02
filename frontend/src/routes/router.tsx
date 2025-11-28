import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from '../App'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { ProtectedRoute } from './ProtectedRoute'
import { Users } from '@/pages/Users'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'users', element: <Users /> },
        ],
      },

      {
        path: '*',
        element: <Navigate to="/login" replace />,
      },
    ],
  },
])
