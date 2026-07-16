import axios, { AxiosError } from 'axios'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const http = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message ?? '请求失败'
    return Promise.reject(new ApiError(message, error.response?.status ?? null))
  },
)

export default http
