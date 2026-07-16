import { createCrudApi } from './crud'
import type { Course, MaterialLibrary, MatrixAccount, User, Video } from '@/types/database'

export const videoApi = createCrudApi<Video>('/videos')
export const materialLibraryApi = createCrudApi<MaterialLibrary>('/materials')
export const matrixAccountApi = createCrudApi<MatrixAccount>('/matrix-accounts')
export const courseApi = createCrudApi<Course>('/courses')
export const userApi = createCrudApi<User>('/users')
