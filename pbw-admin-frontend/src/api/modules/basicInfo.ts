import { apiClient } from '@/api/client'
import type { BasicInfo } from '@/types/database'

export const basicInfoApi = {
  get() {
    return apiClient.get<BasicInfo>('/basic-info')
  },
  update(data: Partial<BasicInfo>) {
    return apiClient.put<BasicInfo>('/basic-info', data)
  },
}
