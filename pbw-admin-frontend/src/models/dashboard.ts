export type DashboardItemType = '视频' | '素材' | '课程'

export interface DashboardRecentItem {
  id: number
  title: string
  type: DashboardItemType
  updateTime: string
}

export interface DashboardSummary {
  userCount: number
  videoCount: number
  materialCount: number
  materialTotalPrice: number
  matrixAccountCount: number
  courseCount: number
  onlineCourseCount: number
  totalPlayCount: number
  totalLikeCount: number
  totalFollowerCount: number
  recentItems: DashboardRecentItem[]
}
