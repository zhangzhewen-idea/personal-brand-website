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
    let latestLoadId = 0
    let removeRequestVersion = 0
    const pendingRemovalIds = new Set<number>()
    const removedIds = new Set<number>()
    const removalSnapshots = new Map<number, T[]>()

    const load = async () => {
      const loadId = ++latestLoadId
      loading.value = true
      error.value = null
      successMessage.value = null
      try {
        const nextItems = await service.list()
        if (loadId === latestLoadId) {
          items.value = nextItems.filter(
            (item) => !pendingRemovalIds.has(item.id) && !removedIds.has(item.id),
          )
        }
      } catch (cause) {
        if (loadId === latestLoadId) {
          error.value = cause instanceof Error ? '加载列表失败，请稍后重试' : '数据加载失败'
          successMessage.value = null
        }
      } finally {
        if (loadId === latestLoadId) {
          loading.value = false
        }
      }
    }

    const remove = async (id: number) => {
      // 删除进行中时忽略重复提交，避免并发修改同一列表。
      if (submittingId.value !== null) {
        return
      }
      const requestVersion = ++removeRequestVersion
      removalSnapshots.set(id, items.value.slice())
      removedIds.delete(id)
      pendingRemovalIds.add(id)
      submittingId.value = id
      error.value = null
      successMessage.value = null
      try {
        await service.remove(id)
        pendingRemovalIds.delete(id)
        removalSnapshots.delete(id)
        removedIds.add(id)
        items.value = items.value.filter((item) => item.id !== id)
        successMessage.value = '删除成功'
        error.value = null
      } catch (cause) {
        pendingRemovalIds.delete(id)
        removedIds.delete(id)
        const snapshot = removalSnapshots.get(id)
        removalSnapshots.delete(id)
        const snapshotItem = snapshot?.find((item) => item.id === id)
        if (snapshotItem && !items.value.some((item) => item.id === id)) {
          const snapshotIndex = snapshot?.findIndex((item) => item.id === id) ?? items.value.length
          const nextItems = items.value.slice()
          nextItems.splice(Math.min(snapshotIndex, nextItems.length), 0, snapshotItem)
          items.value = nextItems
        }
        successMessage.value = null
        error.value = cause instanceof Error ? cause.message : '删除记录失败，请稍后重试'
        throw cause
      } finally {
        if (requestVersion === removeRequestVersion) {
          submittingId.value = null
        }
      }
    }

    return { items, loading, submittingId, error, successMessage, load, remove }
  })
