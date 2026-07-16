import type { ListRepository, ResettableRepository } from '@/repositories/contracts'

const clone = <T>(value: T): T => structuredClone(value)

export const createMemoryRepository = <T extends { id: number }>(
  seed: T[],
): ListRepository<T> & ResettableRepository => {
  const initialData = clone(seed)
  let data = clone(initialData)

  return {
    async list() {
      return clone(data)
    },

    async remove(id) {
      const index = data.findIndex((item) => item.id === id)
      if (index === -1) {
        throw new Error('记录不存在')
      }
      data.splice(index, 1)
    },

    reset() {
      data = clone(initialData)
    },
  }
}
