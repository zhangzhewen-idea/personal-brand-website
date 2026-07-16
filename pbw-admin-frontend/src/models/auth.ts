import type { UserProfile } from './entities'

export interface LoginPayload {
  account: string
  password: string
  testMode: boolean
}

export interface AuthSession {
  token: string
  user: UserProfile
}

export interface SessionStoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}
