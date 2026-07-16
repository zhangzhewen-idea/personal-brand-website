import type {
  Course,
  MaterialLibraryItem,
  MatrixAccount,
  UserProfile,
  Video,
} from '@/models/entities'
import {
  courseRepository,
  materialRepository,
  matrixAccountRepository,
  userRepository,
  videoRepository,
} from '@/mocks/repositories'
import { createEntityService } from '@/services/entity.service'
import { createEntityListStore } from './entity-list.store'

export const useUserStore = createEntityListStore<UserProfile>(
  'users',
  createEntityService(userRepository, '用户'),
)

export const useVideoStore = createEntityListStore<Video>(
  'videos',
  createEntityService(videoRepository, '视频'),
)

export const useMaterialStore = createEntityListStore<MaterialLibraryItem>(
  'materials',
  createEntityService(materialRepository, '素材'),
)

export const useMatrixAccountStore = createEntityListStore<MatrixAccount>(
  'matrix-accounts',
  createEntityService(matrixAccountRepository, '矩阵账号'),
)

export const useCourseStore = createEntityListStore<Course>(
  'courses',
  createEntityService(courseRepository, '课程'),
)
