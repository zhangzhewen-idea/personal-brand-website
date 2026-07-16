import { http } from './http'
import type { User } from '@/types/models'

export interface LoginPayload { account: string; password: string }
export interface RegisterPayload { nickname: string; account: string; email: string; password: string }

export const userApi = {
  login: (payload: LoginPayload) => http.post<User>('/users/login', payload),
  register: (payload: RegisterPayload) => http.post<User>('/users/register', payload),
}
