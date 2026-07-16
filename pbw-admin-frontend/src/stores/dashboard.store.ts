import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardSummary } from '@/models/dashboard'
import { dashboardService } from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      summary.value = await dashboardService.getSummary()
      return summary.value
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '工作台数据加载失败'
      throw cause
    } finally {
      loading.value = false
    }
  }

  return { summary, loading, error, load }
})
