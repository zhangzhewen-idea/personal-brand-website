import type {
  Course,
  MaterialLibraryItem,
  MatrixAccount,
  UserProfile,
  Video,
} from '@/models/entities'
import {
  courseService,
  materialService,
  matrixAccountService,
  userService,
  videoService,
} from '@/services/entities'
import { createEntityListStore } from './entity-list.store'

export const useUserStore = createEntityListStore<UserProfile>(
  'users',
  userService,
)

export const useVideoStore = createEntityListStore<Video>(
  'videos',
  videoService,
)

export const useMaterialStore = createEntityListStore<MaterialLibraryItem>(
  'materials',
  materialService,
)

export const useMatrixAccountStore = createEntityListStore<MatrixAccount>(
  'matrix-accounts',
  matrixAccountService,
)

export const useCourseStore = createEntityListStore<Course>(
  'courses',
  courseService,
)
