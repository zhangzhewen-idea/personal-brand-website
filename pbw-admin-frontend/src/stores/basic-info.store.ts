import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BasicInfo } from '@/models/entities'
import { basicInfoRepository } from '@/mocks/repositories'

export const useBasicInfoStore = defineStore('basic-info', () => {
  const info = ref<BasicInfo | null>(null)
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      info.value = await basicInfoRepository.get()
    } finally {
      loading.value = false
    }
  }

  return { info, loading, load }
})
