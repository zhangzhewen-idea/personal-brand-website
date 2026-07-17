import axios from 'axios'
import { tokenStorage } from '@/auth/token-storage'

export const http = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  const isAuthenticatedSessionRequest = config.url === '/user/session' && config.method !== 'post'
  if (token && isAuthenticatedSessionRequest) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use((response) => response.data)

interface ApiProblem {
  detail?: string
  title?: string
  fieldErrors?: Array<{ field: string; message: string }>
}

export function getApiErrorMessage(error: unknown, fallback = '请求失败，请稍后重试'): string {
  if (!axios.isAxiosError<ApiProblem>(error)) return fallback
  const fieldMessage = error.response?.data?.fieldErrors?.[0]?.message
  return fieldMessage || error.response?.data?.detail || error.response?.data?.title || (error.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : fallback)
}
