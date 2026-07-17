export interface BaseRecord {
  id: number
  createTime: string
  updateTime: string
  isDeleted: boolean
}

export interface BasicInfo extends BaseRecord {
  homeCoverVideo: string | null
  contactEmail: string | null
  contactQrCode: string | null
  totalPlayCount: number
  totalLikeCount: number
  totalFollowerCount: number
  authorIdentityTag: string | null
  slogan: string | null
  creationAttitude: string | null
  authorPhoto: string | null
  editingDeskWorkPhoto: string | null
  assetLibraryScreenshot: string | null
  dailyMovieWatchingPhoto: string | null
  annualTop10Films: string[]
  influentialThreeDirectors: string[]
  contactInfo: string | null
}

export interface Video extends BaseRecord {
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface MaterialLibrary extends BaseRecord {
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  stock: number
  specifications: ProductSpecification[]
  netdiskUrl: string | null
}

export interface MatrixAccount extends BaseRecord {
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
}

export interface Course extends BaseRecord {
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
}

export type UserRole = '用户' | '管理员'

export interface User extends BaseRecord {
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: UserRole
  passwordConfigured: boolean
}

export interface CreateUserRequest {
  nickname: string
  account: string
  password: string
  email: string | null
  avatar: string | null
  role: UserRole
}

export interface UpdateUserRequest extends Omit<CreateUserRequest, 'password'> {
  password?: string | null
}

export type EntityWritePayload = Record<string, unknown>

export type ManagementRecord = Video | MaterialLibrary | MatrixAccount | Course | User

export type EntityFormSubmission = ManagementRecord | (User & { password: string })

export type ColumnFormat =
  | 'text'
  | 'multiline'
  | 'url'
  | 'image'
  | 'money'
  | 'boolean'
  | 'online'
  | 'role'
  | 'password'
  | 'specifications'
  | 'datetime'

export interface EntityColumn {
  field: string
  label: string
  width?: number
  minWidth?: number
  format?: ColumnFormat
}

export interface EntityPageConfig {
  key: 'video' | 'material' | 'matrix' | 'course' | 'user'
  eyebrow: string
  title: string
  description: string
  createLabel: string
  searchPlaceholder: string
  searchFields: string[]
  columns: EntityColumn[]
}

export interface DashboardMetric {
  key: 'totalPlayCount' | 'totalLikeCount' | 'totalFollowerCount' | 'onlineCourseCount'
  value: number
  trendRate: number | null
  trendDirection: 'up' | 'down' | 'flat'
  caption: string
}

export interface DashboardData {
  serverTime: string
  adminNickname: string
  metrics: DashboardMetric[]
  contentSummary: {
    videoCount: number
    materialCount: number
    matrixAccountCount: number
    userCount: number
  }
  courseSummary: { onlineCount: number; totalCount: number; onlineRate: number }
  latestVideos: Array<Pick<Video, 'id' | 'videoTitle' | 'videoIntro' | 'videoCover' | 'createTime'>>
  profileSummary: Pick<BasicInfo, 'authorIdentityTag' | 'slogan' | 'creationAttitude'> | null
  profileCompleteness: {
    score: number
    brandBasicInfoComplete: boolean
    mediaResourcesComplete: boolean
    annualTop10FilmCount: number
    annualTop10FilmTarget: number
  }
}
