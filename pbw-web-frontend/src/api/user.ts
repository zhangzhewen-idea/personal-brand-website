import { http } from './http'
import type { LoginResult, User } from '@/types/models'

export interface LoginPayload { account: string; password: string }
export interface RegisterPayload { nickname: string; account: string; email: string; password: string }
export interface PasswordResetRequestPayload { accountOrEmail: string }
export interface PasswordResetPayload { resetToken: string; newPassword: string }
export interface AcceptedMessage { message: string }

export const userApi = {
  login: (payload: LoginPayload) => http.post<LoginResult, LoginResult>('/user/session', payload),
  current: () => http.get<User, User>('/user/session'),
  logout: () => http.delete<void, void>('/user/session'),
  register: (payload: RegisterPayload) => http.post<LoginResult, LoginResult>('/user/users', payload, { headers: { 'Idempotency-Key': crypto.randomUUID() } }),
  requestPasswordReset: (payload: PasswordResetRequestPayload) => http.post<AcceptedMessage, AcceptedMessage>('/user/password-reset-requests', payload),
  resetPassword: (payload: PasswordResetPayload) => http.post<void, void>('/user/password-resets', payload),
}
