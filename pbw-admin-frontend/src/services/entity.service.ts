import type { ListRepository } from '@/repositories/contracts'
import { AppError } from './app-error'

export interface EntityService<T extends { id: number }> {
  list(): Promise<T[]>
  remove(id: number): Promise<void>
}

const isNotFoundError = (cause: unknown) =>
  cause instanceof AppError
    ? cause.code === 'NOT_FOUND'
    : cause instanceof Error && /不存在|已删除/.test(cause.message)

export const createEntityService = <T extends { id: number }>(
  repository: ListRepository<T>,
  label: string,
): EntityService<T> => ({
  list: () => repository.list(),

  async remove(id) {
    try {
      await repository.remove(id)
    } catch (cause) {
      if (isNotFoundError(cause)) {
        throw new AppError('记录不存在或已删除', 'NOT_FOUND')
      }
      throw new AppError(`删除${label}失败，请稍后重试`, 'DELETE_FAILED')
    }
  },
})
