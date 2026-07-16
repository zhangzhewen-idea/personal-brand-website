import type { SingletonRepository } from '@/repositories/contracts'
import type { BasicInfo } from '@/models/entities'
import {
  basicInfoMock,
  coursesMock,
  materialsMock,
  matrixAccountsMock,
  usersMock,
  videosMock,
} from '@/mocks/data/database.mock'
import { createMemoryRepository } from './memory.repository'

const clone = <T>(value: T): T => structuredClone(value)

export const basicInfoRepository: SingletonRepository<BasicInfo> = {
  async get() {
    return clone(basicInfoMock)
  },
}

export const userRepository = createMemoryRepository(usersMock)
export const videoRepository = createMemoryRepository(videosMock)
export const materialRepository = createMemoryRepository(materialsMock)
export const matrixAccountRepository = createMemoryRepository(matrixAccountsMock)
export const courseRepository = createMemoryRepository(coursesMock)
