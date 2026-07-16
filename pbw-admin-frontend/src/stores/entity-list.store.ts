import { defineStore } from 'pinia'
import { shallowRef, ref } from 'vue'
import type { EntityService } from '@/services/entity.service'

export const createEntityListStore = <T extends { id: number }>(
  id: string,
  service: EntityService<T>,
) =>
  defineStore(id, () => {
    const items = shallowRef<T[]>([])
    const loading = ref(false)
    const submittingId = ref<number | null>(null)
    const error = ref<string | null>(null)

    const load = async () => {
      loading.value = true
      error.value = null
      try {
        items.value = await service.list()
      } catch {
        error.value = '加载列表失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    const remove = async (id: number) => {
      submittingId.value = id
      error.value = null
      try {
        await service.remove(id)
        items.value = items.value.filter((item) => item.id !== id)
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : '删除记录失败，请稍后重试'
        throw cause
      } finally {
        submittingId.value = null
      }
    }

    return { items, loading, submittingId, error, load, remove }
  })
