import {
  courseRepository,
  materialRepository,
  matrixAccountRepository,
  userRepository,
  videoRepository,
} from '@/mocks/repositories'
import { createEntityService } from './entity.service'

export const userService = createEntityService(userRepository, '用户')
export const videoService = createEntityService(videoRepository, '视频')
export const materialService = createEntityService(materialRepository, '素材')
export const matrixAccountService = createEntityService(matrixAccountRepository, '矩阵账号')
export const courseService = createEntityService(courseRepository, '课程')
