import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from '../App'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { ProtectedRoute } from './ProtectedRoute'
import { Users } from '@/pages/Users'
import { Snapshots } from '@/pages/Snapshots'
import { Register } from '@/pages/Register'
import { PokemonList } from '@/pages/PokemonList'
import { PokemonDetail } from '@/pages/PokemonDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'users', element: <Users /> },
          { path: 'snapshots', element: <Snapshots /> },
          { path: 'pokemon', element: <PokemonList /> },
          { path: 'pokemon/:id', element: <PokemonDetail /> },
        ],
      },

      {
        path: '*',
        element: <Navigate to="/login" replace />,
      },
    ],
  },
])
