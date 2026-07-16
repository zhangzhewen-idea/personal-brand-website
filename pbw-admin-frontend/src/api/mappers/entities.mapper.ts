import type {
  BasicInfoDto,
  CourseDto,
  MaterialDto,
  MatrixAccountDto,
  UserDto,
  VideoDto,
} from '@/api/dto/entities.dto'
import type {
  BasicInfo,
  Course,
  MaterialLibraryItem,
  MatrixAccount,
  UserProfile,
  Video,
} from '@/models/entities'
import type { AuditFields } from '@/models/entities'

const mapAuditFields = (dto: {
  id: number
  create_time: string
  update_time: string
  is_deleted: 0 | 1
}): AuditFields => ({
  id: dto.id,
  createTime: dto.create_time,
  updateTime: dto.update_time,
  isDeleted: dto.is_deleted === 1,
})

const mapStringArray = (value: string | string[] | null): string[] => {
  if (Array.isArray(value)) {
    return value
  }

  if (value === null) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) && parsed.every((item): item is string => typeof item === 'string')
      ? parsed
      : []
  } catch {
    return []
  }
}

export const mapBasicInfoDto = (dto: BasicInfoDto): BasicInfo => ({
  ...mapAuditFields(dto),
  homeCoverVideo: dto.home_cover_video,
  contactEmail: dto.contact_email,
  contactQrCode: dto.contact_qr_code,
  totalPlayCount: dto.total_play_count,
  totalLikeCount: dto.total_like_count,
  totalFollowerCount: dto.total_follower_count,
  authorIdentityTag: dto.author_identity_tag,
  slogan: dto.slogan,
  creationAttitude: dto.creation_attitude,
  authorPhoto: dto.author_photo,
  editingDeskWorkPhoto: dto.editing_desk_work_photo,
  assetLibraryScreenshot: dto.asset_library_screenshot,
  dailyMovieWatchingPhoto: dto.daily_movie_watching_photo,
  annualTop10Films: mapStringArray(dto.annual_top_10_films),
  influentialThreeDirectors: mapStringArray(dto.influential_three_directors),
  contactInfo: dto.contact_info,
})

export const mapVideoDto = (dto: VideoDto): Video => ({
  ...mapAuditFields(dto),
  videoTitle: dto.video_title,
  videoIntro: dto.video_intro,
  videoUrl: dto.video_url,
  videoCover: dto.video_cover,
})

export const mapMaterialDto = (dto: MaterialDto): MaterialLibraryItem => ({
  ...mapAuditFields(dto),
  materialTitle: dto.material_title,
  materialPhoto: dto.material_photo,
  materialIntro: dto.material_intro,
  price: Number(dto.price),
  netdiskUrl: dto.netdisk_url,
})

export const mapMatrixAccountDto = (dto: MatrixAccountDto): MatrixAccount => ({
  ...mapAuditFields(dto),
  platformName: dto.platform_name,
  platformLogo: dto.platform_logo,
  accountUrl: dto.account_url,
  intro: dto.intro,
})

export const mapCourseDto = (dto: CourseDto): Course => ({
  ...mapAuditFields(dto),
  courseName: dto.course_name,
  courseTag: dto.course_tag,
  courseIntro: dto.course_intro,
  coursePrice: Number(dto.course_price),
  isOnline: dto.is_online === 1,
})

export const mapUserDto = (dto: UserDto): UserProfile => ({
  ...mapAuditFields(dto),
  nickname: dto.nickname,
  account: dto.account,
  email: dto.email,
  avatar: dto.avatar,
  role: dto.role,
})
