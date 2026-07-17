import { apiClient } from '@/api/client'

export interface LoginPayload {
  account: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
  nickname: string
  role: '管理员'
}

export interface PasswordResetRequestResponse {
  accepted: boolean
  expiresIn: number
}

export const authApi = {
  login(payload: LoginPayload) {
    return apiClient.post<LoginResponse>('/admin/session', payload)
  },
  getSession() {
    return apiClient.get<Omit<LoginResponse, 'token'>>('/admin/session')
  },
  logout() {
    return apiClient.delete<void>('/admin/session')
  },
  requestPasswordReset(accountOrEmail: string) {
    return apiClient.post<PasswordResetRequestResponse>('/admin/password-reset-requests', {
      accountOrEmail,
    })
  },
}
