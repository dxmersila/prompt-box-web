import { API_BASE_URL } from './config'

type RequestOptions = RequestInit & {
  token?: string
}

export interface ApiError {
  message?: string
  code?: string
  status: number
}

export class ApiRequestError extends Error {
  readonly code?: string
  readonly status: number

  constructor({ message, code, status }: ApiError) {
    super(message ?? `API request failed with status ${status}`)
    this.name = 'ApiRequestError'
    this.code = code
    this.status = status
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, ...requestInit } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    headers: {
      Accept: 'application/json',
      ...(requestInit.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...requestInit.headers,
    },
  })

  if (!response.ok) {
    let error: ApiError = {
      status: response.status,
    }

    try {
      const data = (await response.json()) as {
        message?: string
        code?: string
      }

      error = {
        message: data.message,
        code: data.code,
        status: response.status,
      }
    } catch {
      // Keep the status-only error when the response has no JSON body.
    }

    throw new ApiRequestError(error)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
