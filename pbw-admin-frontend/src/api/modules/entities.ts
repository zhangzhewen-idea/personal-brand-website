import { createCrudApi } from './crud'
import type {
  Course,
  CreateUserRequest,
  EntityWritePayload,
  MaterialLibrary,
  MatrixAccount,
  UpdateUserRequest,
  User,
  Video,
} from '@/types/database'

export const videoApi = createCrudApi<Video, EntityWritePayload>('/admin/videos')
export const materialLibraryApi = createCrudApi<MaterialLibrary, EntityWritePayload>('/admin/materials')
export const matrixAccountApi = createCrudApi<MatrixAccount, EntityWritePayload>('/admin/matrix-accounts')
export const courseApi = createCrudApi<Course, EntityWritePayload>('/admin/courses')
export const userApi = createCrudApi<User, CreateUserRequest, UpdateUserRequest>('/admin/users')

export const entityApis = {
  video: videoApi,
  material: materialLibraryApi,
  matrix: matrixAccountApi,
  course: courseApi,
  user: userApi,
}
