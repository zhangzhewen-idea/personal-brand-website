import { apiClient } from '@/api/client'
import type { BasicInfo } from '@/types/database'

export type BasicInfoPayload = Omit<BasicInfo, 'id' | 'createTime' | 'updateTime' | 'isDeleted'>

export const basicInfoApi = {
  get() {
    return apiClient.get<BasicInfo>('/admin/basic-info')
  },
  create(data: BasicInfoPayload) {
    return apiClient.post<BasicInfo>('/admin/basic-info', data)
  },
  update(id: number, data: BasicInfoPayload) {
    return apiClient.put<BasicInfo>(`/admin/basic-info/${id}`, data)
  },
}
