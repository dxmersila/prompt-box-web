import { apiClient } from './client'
import type {
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  User,
} from '@/types/auth'

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface LoginData {
  email: string
  password: string
}

export async function register(
  data: RegisterData,
): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function login(
  data: LoginData,
): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function verifyEmail(
  id: string,
  hash: string,
  expires: string,
  signature: string,
): Promise<{ message: string }> {
  const params = new URLSearchParams({
    expires,
    hash,
    signature,
  })

  return apiClient<{ message: string }>(
    `/auth/email/verify/${encodeURIComponent(id)}?${params.toString()}`,
  )
}

export async function resendVerification(
  email: string,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(
    '/auth/email/verification-notification',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
  )
}

export async function logout(token: string): Promise<LogoutResponse> {
  return apiClient<LogoutResponse>('/auth/logout', {
    method: 'POST',
    token,
  })
}

export async function me(token: string): Promise<{ data: User }> {
  return apiClient<{ data: User }>('/auth/me', {
    token,
  })
}
