import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getHomeContent } from '@/services/site.service'
import type { BasicInfo, HomeContent, MaterialCardViewModel, MatrixAccountViewModel, VideoCardViewModel } from '@/models'

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export const useSiteStore = defineStore('site', () => {
  const basicInfo = ref<BasicInfo | null>(null)
  const videos = ref<VideoCardViewModel[]>([])
  const materials = ref<MaterialCardViewModel[]>([])
  const matrixAccounts = ref<MatrixAccountViewModel[]>([])
  const status = ref<LoadStatus>('idle')
  const errorMessage = ref<string | null>(null)
  let loadingPromise: Promise<void> | null = null

  async function load(): Promise<void> {
    if (status.value === 'success') {
      return
    }

    if (status.value === 'loading' && loadingPromise) {
      return loadingPromise
    }

    status.value = 'loading'
    errorMessage.value = null
    loadingPromise = getHomeContent()
      .then((content: HomeContent) => {
        basicInfo.value = content.basicInfo
        videos.value = content.videos
        materials.value = content.materials
        matrixAccounts.value = content.matrixAccounts
        status.value = 'success'
      })
      .catch((error: unknown) => {
        status.value = 'error'
        errorMessage.value = error instanceof Error ? error.message : '站点内容加载失败'
      })
      .finally(() => {
        loadingPromise = null
      })

    return loadingPromise
  }

  return {
    basicInfo,
    videos,
    materials,
    matrixAccounts,
    status,
    errorMessage,
    load,
  }
})
