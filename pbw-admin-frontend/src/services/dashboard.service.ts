import type { BasicInfo, Course, MaterialLibraryItem, MatrixAccount, UserProfile, Video } from '@/models/entities'
import type { DashboardRecentItem, DashboardSummary } from '@/models/dashboard'
import { basicInfoService } from './basic-info.service'
import { courseService, materialService, matrixAccountService, userService, videoService } from './entities'

type ListSource<T> = Pick<{ list(): Promise<T[]> }, 'list'>

export interface DashboardSources {
  userService: ListSource<UserProfile>
  videoService: ListSource<Video>
  materialService: ListSource<MaterialLibraryItem>
  matrixAccountService: ListSource<MatrixAccount>
  courseService: ListSource<Course>
  basicInfoService: Pick<typeof basicInfoService, 'get'>
}

const defaultSources: DashboardSources = {
  userService,
  videoService,
  materialService,
  matrixAccountService,
  courseService,
  basicInfoService,
}

const createRecentItems = (videos: Video[], materials: MaterialLibraryItem[], courses: Course[]) => {
  const items: Array<DashboardRecentItem & { order: number }> = [
    ...videos.map((item, order) => ({ id: item.id, title: item.videoTitle, type: '视频' as const, updateTime: item.updateTime, order })),
    ...materials.map((item, order) => ({ id: item.id, title: item.materialTitle, type: '素材' as const, updateTime: item.updateTime, order: videos.length + order })),
    ...courses.map((item, order) => ({ id: item.id, title: item.courseName, type: '课程' as const, updateTime: item.updateTime, order: videos.length + materials.length + order })),
  ]

  return items
    .sort((left, right) => {
      const updateDiff = right.updateTime.localeCompare(left.updateTime)
      return updateDiff || left.order - right.order
    })
    .slice(0, 5)
    .map(({ order: _order, ...item }) => item)
}

export const createDashboardService = (sources: DashboardSources = defaultSources) => ({
  async getSummary(): Promise<DashboardSummary> {
    const [users, videos, materials, matrixAccounts, courses, basicInfo] = await Promise.all([
      sources.userService.list(),
      sources.videoService.list(),
      sources.materialService.list(),
      sources.matrixAccountService.list(),
      sources.courseService.list(),
      sources.basicInfoService.get(),
    ])

    return {
      userCount: users.length,
      videoCount: videos.length,
      materialCount: materials.length,
      materialTotalPrice: materials.reduce((total, item) => total + item.price, 0),
      matrixAccountCount: matrixAccounts.length,
      courseCount: courses.length,
      onlineCourseCount: courses.filter((course) => course.isOnline).length,
      totalPlayCount: basicInfo.totalPlayCount,
      totalLikeCount: basicInfo.totalLikeCount,
      totalFollowerCount: basicInfo.totalFollowerCount,
      recentItems: createRecentItems(videos, materials, courses),
    }
  },
})

export const dashboardService = createDashboardService()
