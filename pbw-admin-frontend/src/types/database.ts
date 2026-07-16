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

export interface MaterialLibrary extends BaseRecord {
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
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
  password: string
  email: string | null
  avatar: string | null
  role: UserRole
}

export type ManagementRecord = Video | MaterialLibrary | MatrixAccount | Course | User

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
  rows: ManagementRecord[]
}
