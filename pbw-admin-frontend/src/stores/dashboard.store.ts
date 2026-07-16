import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardSummary } from '@/models/dashboard'
import { dashboardService } from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let latestRequestId = 0

  const load = async () => {
    const requestId = ++latestRequestId
    loading.value = true
    error.value = null
    try {
      const nextSummary = await dashboardService.getSummary()
      if (requestId === latestRequestId) {
        summary.value = nextSummary
      }
      return nextSummary
    } catch (cause) {
      if (requestId === latestRequestId) {
        error.value = cause instanceof Error ? cause.message : '工作台数据加载失败'
      }
      return undefined
    } finally {
      if (requestId === latestRequestId) {
        loading.value = false
      }
    }
  }

  return { summary, loading, error, load }
})
