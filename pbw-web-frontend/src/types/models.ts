export interface BaseEntity {
  id: number
  createTime: string
  updateTime: string
  isDeleted: boolean
}

export interface BasicInfo extends BaseEntity {
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

export interface VideoItem extends BaseEntity {
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
  platformName?: string
  playCountText?: string
}

export interface MaterialItem extends BaseEntity {
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  netdiskUrl: string | null
  itemCount?: number
  isFree?: boolean
  colorClass?: string
  iconName?: string
}

export interface MatrixAccount extends BaseEntity {
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
  followerCountText?: string
  colorClass?: string
}

export interface Course extends BaseEntity {
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
  duration?: string
  lessonCount?: number
  features?: string[]
  colorClass?: string
  iconName?: string
}

export interface User extends BaseEntity {
  nickname: string
  account: string
  password: string
  email: string | null
  avatar: string | null
  role: '用户' | '管理员'
}
