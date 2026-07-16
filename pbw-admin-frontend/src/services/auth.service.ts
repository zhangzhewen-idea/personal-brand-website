import { usersMock } from '@/mocks/data/database.mock'
import type { AuthSession, LoginPayload, SessionStoragePort } from '@/models/auth'
import type { UserProfile } from '@/models/entities'
import { AppError } from './app-error'

export const AUTH_SESSION_STORAGE_KEY = 'pbw-admin-session'
export const TEST_AUTH_TOKEN = 'pbw-admin-test-token'

const browserSessionStorage: SessionStoragePort = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
  removeItem: (key) => sessionStorage.removeItem(key),
}

const isUserProfile = (value: unknown): value is UserProfile => {
  if (!value || typeof value !== 'object') return false
  const user = value as Partial<UserProfile>
  return typeof user.id === 'number' && typeof user.account === 'string' && typeof user.nickname === 'string'
}

export const createAuthService = (storage: SessionStoragePort) => ({
  async login(payload: LoginPayload): Promise<AuthSession> {
    if (!payload.testMode) {
      throw new AppError('真实登录 API 暂不可用', 'API_UNAVAILABLE')
    }

    const user = usersMock.find((candidate) => candidate.account === 'admin')
    if (!user) {
      throw new AppError('测试用户不存在', 'TEST_USER_MISSING')
    }
    if (payload.account !== 'admin' || payload.password !== '123456') {
      throw new AppError('账号或密码错误', 'INVALID_CREDENTIALS')
    }

    const session: AuthSession = {
      token: TEST_AUTH_TOKEN,
      user: { ...user },
    }
    storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
    return session
  },

  restore(): AuthSession | null {
    const raw = storage.getItem(AUTH_SESSION_STORAGE_KEY)
    if (!raw) return null

    try {
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') throw new Error('invalid session')
      const candidate = parsed as { token?: unknown; user?: unknown }
      if (typeof candidate.token !== 'string' || !isUserProfile(candidate.user)) throw new Error('invalid session')

      const { password: _password, ...safeUser } = candidate.user as UserProfile & { password?: unknown }
      return { token: candidate.token, user: safeUser }
    } catch {
      storage.removeItem(AUTH_SESSION_STORAGE_KEY)
      return null
    }
  },

  logout(): void {
    storage.removeItem(AUTH_SESSION_STORAGE_KEY)
  },
})

export const authService = createAuthService(browserSessionStorage)
