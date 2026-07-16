export type UserRole = '用户' | '管理员'

export interface AuditedEntity {
  id: number
  createTime: string
  updateTime: string
  isDeleted: boolean
}

export interface BasicInfo extends AuditedEntity {
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

export interface Video extends AuditedEntity {
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
}

export interface MaterialLibraryItem extends AuditedEntity {
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  netdiskUrl: string | null
}

export interface MatrixAccount extends AuditedEntity {
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
}

export interface Course extends AuditedEntity {
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
}

export interface UserProfile extends AuditedEntity {
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: UserRole
}
