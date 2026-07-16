export type AppErrorCode =
  | 'APP_ERROR'
  | 'API_UNAVAILABLE'
  | 'INVALID_CREDENTIALS'
  | 'TEST_USER_MISSING'
  | 'SESSION_PERSIST_FAILED'

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(message: string, code: AppErrorCode = 'APP_ERROR') {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}
