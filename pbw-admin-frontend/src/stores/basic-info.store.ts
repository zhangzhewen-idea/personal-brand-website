import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BasicInfo } from '@/models/entities'
import { basicInfoService } from '@/services/basic-info.service'

export const useBasicInfoStore = defineStore('basic-info', () => {
  const info = ref<BasicInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      info.value = await basicInfoService.get()
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '基本信息加载失败'
      throw cause
    } finally {
      loading.value = false
    }
  }

  return { info, loading, error, load }
})
