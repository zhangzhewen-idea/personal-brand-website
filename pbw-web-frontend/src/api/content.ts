import { http } from './http'
import type { BasicInfo, Course, MaterialItem, MatrixAccount, VideoItem } from '@/types/models'

export const contentApi = {
  getBasicInfo: () => http.get<BasicInfo>('/basic-info'),
  getVideos: () => http.get<VideoItem[]>('/videos'),
  getMaterials: () => http.get<MaterialItem[]>('/materials'),
  getMatrixAccounts: () => http.get<MatrixAccount[]>('/matrix-accounts'),
  getCourses: () => http.get<Course[]>('/courses'),
}
