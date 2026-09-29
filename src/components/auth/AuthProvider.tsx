'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  login as loginRequest,
  logout as logoutRequest,
  me,
  register as registerRequest,
} from '@/lib/api/authService'
import {
  getToken,
  removeToken,
  setToken,
} from '@/lib/api/token'
import type { RegisterResponse, User } from '@/types/auth'

type AuthStatus = 'loading' | 'guest' | 'authenticated'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<RegisterResponse>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setStatus('guest')
      return
    }

    me(token)
      .then(({ data }) => {
        setUser(data)
        setStatus('authenticated')
      })
      .catch(() => {
        removeToken()
        setUser(null)
        setStatus('guest')
      })
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginRequest(credentials)

    setToken(response.token)
    setUser(response.user)
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    return registerRequest(data)
  }, [])

  const logout = useCallback(async () => {
    const token = getToken()

    removeToken()
    setUser(null)
    setStatus('guest')

    if (token) {
      void logoutRequest(token).catch(() => {})
    }
  }, [])

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
