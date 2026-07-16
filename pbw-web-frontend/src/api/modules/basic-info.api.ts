import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import { mapBasicInfoDto } from '@/api/mappers/content.mapper'
import type { BasicInfo } from '@/models'

export async function getBasicInfo(): Promise<BasicInfo> {
  const { data } = await http.get<BasicInfo>(endpoints.basicInfo)
  return mapBasicInfoDto(data)
}
