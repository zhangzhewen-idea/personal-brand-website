import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { Video } from '@/models'

export async function getVideos(): Promise<Video[]> {
  const { data } = await http.get<Video[]>(endpoints.videos)
  return data
}
