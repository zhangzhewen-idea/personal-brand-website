import { usersMock } from '@/mocks/data/database.mock'
import type { AuthSession, LoginPayload, SessionStoragePort } from '@/models/auth'
import type { UserProfile } from '@/models/entities'
import { AppError } from './app-error'

export const AUTH_SESSION_STORAGE_KEY = 'pbw-admin-session'
export const TEST_AUTH_TOKEN = 'pbw-admin-test-token'

type RuntimeUser = UserProfile & { password?: unknown }

const browserSessionStorage: SessionStoragePort = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
  removeItem: (key) => sessionStorage.removeItem(key),
}

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

const isUserProfile = (value: unknown): value is RuntimeUser => {
  if (!value || typeof value !== 'object') return false
  const user = value as Partial<RuntimeUser>
  return (
    typeof user.id === 'number' &&
    isNonEmptyString(user.account) &&
    isNonEmptyString(user.nickname) &&
    (user.role === '用户' || user.role === '管理员') &&
    typeof user.createTime === 'string' &&
    typeof user.updateTime === 'string' &&
    user.isDeleted === false &&
    (user.email === null || typeof user.email === 'string') &&
    (user.avatar === null || typeof user.avatar === 'string')
  )
}

export const sanitizeUser = (user: RuntimeUser): UserProfile => ({
  id: user.id,
  createTime: user.createTime,
  updateTime: user.updateTime,
  isDeleted: user.isDeleted,
  nickname: user.nickname,
  account: user.account,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
})

export const createAuthService = (storage: SessionStoragePort, source: readonly RuntimeUser[] = usersMock) => ({
  async login(payload: LoginPayload): Promise<AuthSession> {
    if (!payload.testMode) {
      throw new AppError('真实登录 API 暂不可用', 'API_UNAVAILABLE')
    }

    const user = source.find((candidate) => candidate.account === 'admin')
    if (!user) {
      throw new AppError('测试用户不存在', 'TEST_USER_MISSING')
    }
    if (user.role !== '管理员' || user.isDeleted !== false) {
      throw new AppError('测试用户不是管理员', 'TEST_USER_MISSING')
    }
    if (payload.account !== 'admin' || payload.password !== '123456') {
      throw new AppError('账号或密码错误', 'INVALID_CREDENTIALS')
    }

    const session: AuthSession = {
      token: TEST_AUTH_TOKEN,
      user: sanitizeUser(user),
    }
    try {
      storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
    } catch {
      try {
        storage.removeItem(AUTH_SESSION_STORAGE_KEY)
      } catch {
        // 存储不可用时不能留下可能过期的会话。
      }
      throw new AppError('会话持久化失败', 'SESSION_PERSIST_FAILED')
    }
    return session
  },

  restore(): AuthSession | null {
    try {
      const raw = storage.getItem(AUTH_SESSION_STORAGE_KEY)
      if (!raw) return null

      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') throw new Error('invalid session')
      const candidate = parsed as { token?: unknown; user?: unknown }
      if (candidate.token !== TEST_AUTH_TOKEN || !isUserProfile(candidate.user) || candidate.user.role !== '管理员') {
        throw new Error('invalid session')
      }

      return { token: candidate.token, user: sanitizeUser(candidate.user) }
    } catch {
      try {
        storage.removeItem(AUTH_SESSION_STORAGE_KEY)
      } catch {
        // 存储不可用时不能阻断应用启动。
      }
      return null
    }
  },

  logout(): void {
    storage.removeItem(AUTH_SESSION_STORAGE_KEY)
  },
})

export const authService = createAuthService(browserSessionStorage)
