import type {
  Course,
  MaterialLibraryItem,
  MatrixAccount,
  UserProfile,
  Video,
} from '@/models/entities'
import type { ListRepository } from '@/repositories/contracts'
import {
  courseRepository,
  materialRepository,
  matrixAccountRepository,
  userRepository,
  videoRepository,
} from '@/mocks/repositories'
import { createEntityService } from './entity.service'

export interface EntityRepositories {
  userRepository: ListRepository<UserProfile>
  videoRepository: ListRepository<Video>
  materialRepository: ListRepository<MaterialLibraryItem>
  matrixAccountRepository: ListRepository<MatrixAccount>
  courseRepository: ListRepository<Course>
}

export const createEntityServices = (repositories: EntityRepositories) => ({
  userService: createEntityService(repositories.userRepository, '用户'),
  videoService: createEntityService(repositories.videoRepository, '视频'),
  materialService: createEntityService(repositories.materialRepository, '素材'),
  matrixAccountService: createEntityService(repositories.matrixAccountRepository, '矩阵账号'),
  courseService: createEntityService(repositories.courseRepository, '课程'),
})

export const mockEntityServices = createEntityServices({
  userRepository,
  videoRepository,
  materialRepository,
  matrixAccountRepository,
  courseRepository,
})

export const {
  userService,
  videoService,
  materialService,
  matrixAccountService,
  courseService,
} = mockEntityServices
