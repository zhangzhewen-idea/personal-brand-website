import { apiClient } from '@/api/client'
import type { DashboardData } from '@/types/database'

export const dashboardApi = {
  get(params = { trendDays: 30, latestVideoLimit: 3 }) {
    return apiClient.get<DashboardData>('/admin/dashboard', { params })
  },
}
