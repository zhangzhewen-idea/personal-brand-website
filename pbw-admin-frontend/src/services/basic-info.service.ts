import type { BasicInfo } from '@/models/entities'
import type { SingletonRepository } from '@/repositories/contracts'
import { basicInfoRepository } from '@/mocks/repositories'

export const basicInfoService: SingletonRepository<BasicInfo> = {
  get: () => basicInfoRepository.get(),
}
