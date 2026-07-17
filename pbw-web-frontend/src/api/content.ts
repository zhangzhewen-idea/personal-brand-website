import { http } from './http'
import type { BasicInfo, Course, MaterialItem, MatrixAccount, VideoItem } from '@/types/models'

export const contentApi = {
  getBasicInfo: () => http.get<BasicInfo, BasicInfo>('/user/basic-info'),
  getVideos: (limit?: number) => http.get<VideoItem[], VideoItem[]>('/user/videos', { params: { limit } }),
  getMaterials: (limit?: number) => http.get<MaterialItem[], MaterialItem[]>('/user/materials', { params: { limit } }),
  getMatrixAccounts: () => http.get<MatrixAccount[], MatrixAccount[]>('/user/matrix-accounts'),
  getCourses: () => http.get<Course[], Course[]>('/user/courses'),
}
