import type {
  CourseDto,
  MaterialDto,
  MatrixAccountDto,
  UserDto,
  VideoDto,
} from '@/api/dto/entities.dto'
import { courses, materials, matrixAccounts, users, videos } from '@/api/endpoints'
import { createCrudApi } from './crud.api'

export const userApi = createCrudApi<UserDto>(users)
export const videoApi = createCrudApi<VideoDto>(videos)
export const materialApi = createCrudApi<MaterialDto>(materials)
export const matrixAccountApi = createCrudApi<MatrixAccountDto>(matrixAccounts)
export const courseApi = createCrudApi<CourseDto>(courses)
