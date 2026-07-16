import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { LoginPayload, RegisterPayload, UserProfile } from '@/models'

function withoutPassword(data: UserProfile & { password?: unknown }): UserProfile {
  const { password: _password, ...profile } = data
  return profile
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await http.get<UserProfile>(endpoints.currentUser)
  return withoutPassword(data)
}

export async function login(payload: LoginPayload): Promise<UserProfile> {
  const { data } = await http.post<UserProfile>(endpoints.login, payload)
  return withoutPassword(data)
}

export async function register(payload: RegisterPayload): Promise<UserProfile> {
  const { data } = await http.post<UserProfile>(endpoints.register, payload)
  return withoutPassword(data)
}
