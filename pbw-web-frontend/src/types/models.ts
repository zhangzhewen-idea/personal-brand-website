export interface BasicInfo {
  id: number
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

export interface VideoItem {
  id: number
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
  platformName: string | null
  playCountText: string | null
}

export type MaterialIconName = 'Scissors' | 'Volume2' | 'Video' | 'Gift'

export interface MaterialItem {
  id: number
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  netdiskUrl: string | null
  itemCount: number
  isFree: boolean
  colorClass: string
  iconName: MaterialIconName
}

export interface MatrixAccount {
  id: number
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
  followerCountText: string | null
  colorClass: string
}

export type CourseIconName = 'Video' | 'GraduationCap' | 'Palette' | 'TrendingUp'

export interface Course {
  id: number
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
  duration: string | null
  lessonCount: number
  features: string[]
  colorClass: string
  iconName: CourseIconName
}

export interface User {
  id: number
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: '用户'
}

export interface LoginResult {
  token: string
  expiresIn: number
  user: User
}
