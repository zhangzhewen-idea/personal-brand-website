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
    const successMessage = ref<string | null>(null)

    const load = async () => {
      loading.value = true
      error.value = null
      successMessage.value = null
      try {
        items.value = await service.list()
      } catch (cause) {
        error.value = cause instanceof Error ? '加载列表失败，请稍后重试' : '数据加载失败'
      } finally {
        loading.value = false
      }
    }

    const remove = async (id: number) => {
      // 删除进行中时忽略重复提交，避免并发修改同一列表。
      if (submittingId.value !== null) {
        return
      }
      submittingId.value = id
      error.value = null
      successMessage.value = null
      try {
        await service.remove(id)
        items.value = items.value.filter((item) => item.id !== id)
        successMessage.value = '删除成功'
      } catch (cause) {
        successMessage.value = null
        error.value = cause instanceof Error ? cause.message : '删除记录失败，请稍后重试'
        throw cause
      } finally {
        submittingId.value = null
      }
    }

    return { items, loading, submittingId, error, successMessage, load, remove }
  })
