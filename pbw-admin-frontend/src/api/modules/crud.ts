import { apiClient } from '@/api/client'

export interface PageQuery {
  page: number
  pageSize: number
  keyword?: string
  status?: 'all' | 'normal' | 'deleted'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const createCrudApi = <T extends { id: number }, C = Omit<T, 'id'>, U = C>(resource: string) => ({
  getPage(params: PageQuery) {
    return apiClient.get<PageResult<T>>(resource, { params })
  },
  getDetail(id: number) {
    return apiClient.get<T>(`${resource}/${id}`)
  },
  create(data: C) {
    return apiClient.post<T>(resource, data)
  },
  update(id: number, data: U) {
    return apiClient.put<T>(`${resource}/${id}`, data)
  },
  remove(id: number) {
    return apiClient.delete<void>(`${resource}/${id}`)
  },
  duplicate(id: number) {
    return apiClient.post<T>(`${resource}/${id}/copies`)
  },
})
