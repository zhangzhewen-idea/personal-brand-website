import type { BasicInfo, Course, MaterialLibraryItem, MatrixAccount, Video } from './entities'

export type CardColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'black' | 'red'

export interface VideoCardViewModel extends Video {
  platform: string
  views: string
}

export interface MaterialCardViewModel extends MaterialLibraryItem {
  itemCount: number
  icon: 'scissors' | 'volume' | 'video' | 'gift'
  color: CardColor
}

export interface MatrixAccountViewModel extends MatrixAccount {
  displayName: string
  followers: string
  color: CardColor
}

export interface CourseCardViewModel extends Course {
  duration: string
  lessons: number
  features: string[]
  icon: 'video' | 'graduation' | 'palette' | 'trending'
  color: CardColor
}

export interface HomeContent {
  basicInfo: BasicInfo
  videos: VideoCardViewModel[]
  materials: MaterialCardViewModel[]
  matrixAccounts: MatrixAccountViewModel[]
}
