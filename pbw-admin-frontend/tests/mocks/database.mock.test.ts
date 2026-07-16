import { describe, expect, it } from 'vitest'

import {
  basicInfoMock,
  coursesMock,
  materialsMock,
  matrixAccountsMock,
  usersMock,
  videosMock,
} from '@/mocks/data/database.mock'
import { basicInfoRepository } from '@/mocks/repositories'

describe('database mock data', () => {
  it('matches the database example scale', () => {
    expect(basicInfoMock.id).toBe(1)
    expect(videosMock).toHaveLength(3)
    expect(materialsMock).toHaveLength(3)
    expect(matrixAccountsMock).toHaveLength(3)
    expect(coursesMock).toHaveLength(3)
    expect(usersMock).toHaveLength(3)
  })

  it('uses domain fields with audit fields and no user password', () => {
    expect(Object.keys(basicInfoMock)).toEqual(
      expect.arrayContaining([
        'id',
        'createTime',
        'updateTime',
        'isDeleted',
        'homeCoverVideo',
        'contactEmail',
        'contactQrCode',
        'totalPlayCount',
        'totalLikeCount',
        'totalFollowerCount',
        'authorIdentityTag',
        'slogan',
        'creationAttitude',
        'authorPhoto',
        'editingDeskWorkPhoto',
        'assetLibraryScreenshot',
        'dailyMovieWatchingPhoto',
        'annualTop10Films',
        'influentialThreeDirectors',
        'contactInfo',
      ]),
    )

    for (const user of usersMock) {
      expect(user).not.toHaveProperty('password')
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          createTime: expect.any(String),
          updateTime: expect.any(String),
          isDeleted: expect.any(Boolean),
          nickname: expect.any(String),
          account: expect.any(String),
          role: expect.stringMatching(/^(用户|管理员)$/),
        }),
      )
    }
  })

  it('contains nullable values represented as null', () => {
    expect(videosMock.some((video) => video.videoIntro === null)).toBe(true)
    expect(materialsMock.some((material) => material.netdiskUrl === null)).toBe(true)
    expect(matrixAccountsMock.some((account) => account.platformLogo === null)).toBe(true)
    expect(coursesMock.some((course) => course.courseTag === null)).toBe(true)
    expect(usersMock.some((user) => user.email === null)).toBe(true)
  })

  it('basicInfoRepository.get 返回深拷贝', async () => {
    const result = await basicInfoRepository.get()
    result.annualTop10Films.push('外部修改')

    expect(await basicInfoRepository.get()).toEqual(basicInfoMock)
  })
})
