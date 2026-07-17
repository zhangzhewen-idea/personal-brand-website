import axios, { AxiosError } from 'axios'

export interface ProblemDetail {
  title?: string
  detail?: string
  status?: number
  code?: string
  fieldErrors?: Array<{ field: string; message: string }>
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pbw-admin-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetail>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pbw-admin-token')
      localStorage.removeItem('pbw-admin-user')
      if (window.location.pathname !== '/login') {
        const redirect = `${window.location.pathname}${window.location.search}`
        window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`)
      }
    }
    return Promise.reject(error)
  },
)

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ProblemDetail>(error)) {
    return error instanceof Error ? error.message : fallback
  }

  const problem = error.response?.data
  const fieldMessage = problem?.fieldErrors?.map((item) => item.message).filter(Boolean).join('；')
  return fieldMessage || problem?.detail || problem?.title || (error.request ? '无法连接后端服务' : fallback)
}
