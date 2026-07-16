import { describe, expect, it } from 'vitest'

import { createMemoryRepository } from '@/mocks/repositories/memory.repository'

interface TestRecord {
  id: number
  name: string
  tags: string[]
}

const seed: TestRecord[] = [
  { id: 1, name: '第一条', tags: ['初始'] },
  { id: 2, name: '第二条', tags: ['示例'] },
]

describe('createMemoryRepository', () => {
  it('list 返回不共享引用的深拷贝', async () => {
    const repository = createMemoryRepository(seed)
    const result = await repository.list()

    result[0].name = '已修改'
    result[0].tags.push('外部修改')

    expect(await repository.list()).toEqual(seed)
    expect(result).not.toBe(seed)
    expect(result[0]).not.toBe(seed[0])
    expect(result[0].tags).not.toBe(seed[0].tags)
  })

  it('remove 按 id 删除记录', async () => {
    const repository = createMemoryRepository(seed)

    await repository.remove(1)

    expect(await repository.list()).toEqual([seed[1]])
  })

  it('remove 找不到记录时抛出指定错误', async () => {
    const repository = createMemoryRepository(seed)

    await expect(repository.remove(999)).rejects.toThrow('记录不存在')
  })

  it('reset 恢复初始数据且不共享可变引用', async () => {
    const repository = createMemoryRepository(seed)

    await repository.remove(1)
    repository.reset()
    const result = await repository.list()
    result[0].tags.push('修改后的标签')
    repository.reset()

    expect(await repository.list()).toEqual(seed)
  })
})
