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
    let operationVersion = 0
    let removeRequestVersion = 0
    const pendingRemovalIds = new Set<number>()

    const load = async () => {
      const version = ++operationVersion
      loading.value = true
      error.value = null
      successMessage.value = null
      try {
        const nextItems = await service.list()
        if (version === operationVersion) {
          items.value = nextItems.filter((item) => !pendingRemovalIds.has(item.id))
        }
      } catch (cause) {
        if (version === operationVersion) {
          error.value = cause instanceof Error ? '加载列表失败，请稍后重试' : '数据加载失败'
        }
      } finally {
        if (version === operationVersion) {
          loading.value = false
        }
      }
    }

    const remove = async (id: number) => {
      // 删除进行中时忽略重复提交，避免并发修改同一列表。
      if (submittingId.value !== null) {
        return
      }
      const version = ++operationVersion
      const requestVersion = ++removeRequestVersion
      pendingRemovalIds.add(id)
      submittingId.value = id
      loading.value = false
      error.value = null
      successMessage.value = null
      try {
        await service.remove(id)
        pendingRemovalIds.delete(id)
        items.value = items.value.filter((item) => item.id !== id)
        successMessage.value = '删除成功'
      } catch (cause) {
        pendingRemovalIds.delete(id)
        if (version === operationVersion) {
          successMessage.value = null
          error.value = cause instanceof Error ? cause.message : '删除记录失败，请稍后重试'
        }
        throw cause
      } finally {
        if (requestVersion === removeRequestVersion) {
          submittingId.value = null
        }
      }
    }

    return { items, loading, submittingId, error, successMessage, load, remove }
  })
