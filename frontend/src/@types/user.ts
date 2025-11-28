import type { Role } from './auth'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}
