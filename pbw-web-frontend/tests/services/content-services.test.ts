import { describe, expect, it } from 'vitest'
import {
  basicInfoMock,
  courseMocks,
  materialMocks,
  matrixAccountMocks,
  videoMocks,
} from '@/mocks/content.mock'
import {
  materialPresentation,
  matrixPresentation,
  videoPresentation,
} from '@/configs/home.config'
import { coursePresentation } from '@/configs/course.config'
import { getHomeContent } from '@/services/site.service'
import { getCourses } from '@/services/course.service'

describe('content services', () => {
  it('returns four active home content records with presentation fields merged by entity id', async () => {
    const content = await getHomeContent()

    expect(content.basicInfo).toMatchObject({
      id: basicInfoMock.id,
      slogan: basicInfoMock.slogan,
    })
    expect(content.videos).toHaveLength(4)
    expect(content.videos[0]).toMatchObject({ id: 1, platform: '抖音', views: '180万' })
    expect(content.materials).toHaveLength(4)
    expect(content.materials[0]).toMatchObject({ id: 1, itemCount: 150, icon: 'scissors' })
    expect(content.matrixAccounts).toHaveLength(4)
    expect(content.matrixAccounts[0]).toMatchObject({ id: 1, displayName: '影像创作者' })
  })

  it('returns four active courses with course presentation fields merged by entity id', async () => {
    const courses = await getCourses()

    expect(courses).toHaveLength(4)
    expect(courses[0]).toMatchObject({
      id: 1,
      courseName: courseMocks[0].courseName,
      duration: '8周',
      lessons: 32,
      features: coursePresentation[1].features,
      icon: 'video',
      color: 'blue',
    })
  })

  it('returns isolated copies and throws a Chinese error when presentation config is missing', async () => {
    const first = await getHomeContent()
    first.basicInfo.annualTop10Films[0] = '已修改'
    first.videos[0].videoTitle = '已修改'
    first.materials[0].itemCount = 999
    first.matrixAccounts[0].displayName = '已修改'

    const second = await getHomeContent()

    expect(second.basicInfo.annualTop10Films[0]).toBe(basicInfoMock.annualTop10Films[0])
    expect(second.videos[0].videoTitle).toBe(videoMocks[0].videoTitle)
    expect(second.materials[0].itemCount).toBe(materialPresentation[1].itemCount)
    expect(second.matrixAccounts[0].displayName).toBe(matrixPresentation[1].displayName)

    const originalConfig = videoPresentation[4]
    delete videoPresentation[4]

    await expect(getHomeContent()).rejects.toThrow('视频 4 缺少展示配置')

    videoPresentation[4] = originalConfig
  })
})
