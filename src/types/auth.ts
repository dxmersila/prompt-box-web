export type UserRole = 'user' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  email_verified: boolean
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterResponse {
  user: User
}

export interface LogoutResponse {
  message: string
}
