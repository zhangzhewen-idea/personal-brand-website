import { apiClient } from '@/api/client'

export interface LoginPayload {
  account: string
  password: string
}

export interface LoginResponse {
  token: string
  nickname: string
  role: '管理员'
}

export const authApi = {
  login(payload: LoginPayload) {
    return apiClient.post<LoginResponse>('/admin/login', payload)
  },
}
