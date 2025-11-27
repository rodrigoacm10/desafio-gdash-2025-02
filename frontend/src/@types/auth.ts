export type Role = 'admin' | 'user' | string

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}
