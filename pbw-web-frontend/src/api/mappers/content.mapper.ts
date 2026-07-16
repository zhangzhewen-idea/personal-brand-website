import type { BasicInfo } from '@/models'

export function mapBasicInfoDto(dto: BasicInfo): BasicInfo {
  return {
    ...dto,
    annualTop10Films: [...dto.annualTop10Films],
    influentialThreeDirectors: [...dto.influentialThreeDirectors],
  }
}
