import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../lib/api'
import type { AuthResponse, AuthUser } from '../@types/auth'

type AuthContextType = {
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async (): Promise<string> => {
    const { data } = await api.post<AuthResponse>('/auth/refresh')
    setAccessToken(data.accessToken)
    setUser(data.user)
    return data.accessToken
  }

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    })

    setAccessToken(data.accessToken)
    setUser(data.user)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      console.error('Error on logout', e)
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        await refresh()
      } catch {
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    })

    const resId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (
          error.response?.status !== 401 ||
          originalRequest._retry ||
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/refresh')
        ) {
          return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
          const newToken = await refresh()
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshError) {
          await logout()
          return Promise.reject(refreshError)
        }
      },
    )

    return () => {
      api.interceptors.request.eject(reqId)
      api.interceptors.response.eject(resId)
    }
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
