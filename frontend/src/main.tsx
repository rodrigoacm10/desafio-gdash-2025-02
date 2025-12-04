import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'

import { AuthProvider } from './contexts/AuthContext'
import { router } from './routes/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
