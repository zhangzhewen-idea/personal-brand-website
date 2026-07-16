import { apiClient } from '@/api/client'

export interface PageQuery {
  page: number
  pageSize: number
  keyword?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
}

export const createCrudApi = <T extends { id: number }>(resource: string) => ({
  getPage(params: PageQuery) {
    return apiClient.get<PageResult<T>>(resource, { params })
  },
  getDetail(id: number) {
    return apiClient.get<T>(`${resource}/${id}`)
  },
  create(data: Omit<T, 'id'>) {
    return apiClient.post<T>(resource, data)
  },
  update(id: number, data: Partial<T>) {
    return apiClient.put<T>(`${resource}/${id}`, data)
  },
  remove(id: number) {
    return apiClient.delete<void>(`${resource}/${id}`)
  },
})
