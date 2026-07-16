import axios from 'axios'

const UNKNOWN_HTTP_ERROR_MESSAGE = '网络请求失败，请稍后重试'

export class HttpError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

const hasMessage = (value: unknown): value is { message: string } =>
  typeof value === 'object' &&
  value !== null &&
  'message' in value &&
  typeof value.message === 'string' &&
  value.message.length > 0

export const normalizeHttpError = (error: unknown): HttpError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const message = hasMessage(error.response?.data)
      ? error.response.data.message
      : UNKNOWN_HTTP_ERROR_MESSAGE

    return new HttpError(message, status)
  }

  return new HttpError(UNKNOWN_HTTP_ERROR_MESSAGE)
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeHttpError(error)),
)

export default http
