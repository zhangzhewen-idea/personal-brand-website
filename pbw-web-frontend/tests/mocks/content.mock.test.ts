import { describe, expect, it } from 'vitest'
import {
  basicInfoMock,
  courseMocks,
  materialMocks,
  matrixAccountMocks,
  userProfileMocks,
  videoMocks,
} from '@/mocks/content.mock'
import type {
  BasicInfo,
  Course,
  MaterialLibraryItem,
  MatrixAccount,
  UserProfile,
  Video,
} from '@/models'

const auditFields = ['id', 'createTime', 'updateTime', 'isDeleted'] as const
const camelCaseKeyPattern = /^[a-z][A-Za-z0-9]*$/

function expectAuditFields(value: object) {
  for (const field of auditFields) {
    expect(value).toHaveProperty(field)
  }
}

function collectKeys(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectKeys)
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nestedValue]) => [
      key,
      ...collectKeys(nestedValue),
    ])
  }

  return []
}

describe('content mocks', () => {
  it('exports a BasicInfo-compatible basicInfoMock', () => {
    const basicInfo: BasicInfo = basicInfoMock

    expectAuditFields(basicInfo)
    expect(Array.isArray(basicInfo.annualTop10Films)).toBe(true)
    expect(Array.isArray(basicInfo.influentialThreeDirectors)).toBe(true)
    expect(basicInfo.annualTop10Films.every((film) => typeof film === 'string')).toBe(true)
    expect(
      basicInfo.influentialThreeDirectors.every((director) => typeof director === 'string'),
    ).toBe(true)
    expect(typeof basicInfo.totalPlayCount).toBe('number')
    expect(typeof basicInfo.isDeleted).toBe('boolean')
  })

  it('uses camelCase keys throughout every content mock', () => {
    const contentMocks = {
      basicInfoMock,
      videoMocks,
      materialMocks,
      matrixAccountMocks,
      courseMocks,
      userProfileMocks,
    }

    expect(collectKeys(contentMocks).every((key) => camelCaseKeyPattern.test(key))).toBe(true)
  })

  it('exports Video-compatible videoMocks with frontend primitive types', () => {
    expect(videoMocks.length).toBe(4)

    for (const video of videoMocks) {
      const typedVideo: Video = video

      expectAuditFields(typedVideo)
      expect(typeof typedVideo.videoTitle).toBe('string')
      expect(typeof typedVideo.videoUrl).toBe('string')
      expect(typeof typedVideo.isDeleted).toBe('boolean')
      expect(Object.keys(typedVideo).some((key) => key.includes('_'))).toBe(false)
    }
  })

  it('exports MaterialLibraryItem-compatible materialMocks', () => {
    expect(materialMocks.length).toBe(4)

    for (const material of materialMocks) {
      const typedMaterial: MaterialLibraryItem = material

      expectAuditFields(typedMaterial)
      expect(typeof typedMaterial.price).toBe('number')
      expect(typeof typedMaterial.isDeleted).toBe('boolean')
    }
  })

  it('exports MatrixAccount-compatible matrixAccountMocks', () => {
    expect(matrixAccountMocks.length).toBe(4)

    for (const account of matrixAccountMocks) {
      const typedAccount: MatrixAccount = account

      expectAuditFields(typedAccount)
      expect(typeof typedAccount.platformName).toBe('string')
      expect(typeof typedAccount.isDeleted).toBe('boolean')
    }
  })

  it('exports Course-compatible courseMocks with boolean online status', () => {
    expect(courseMocks.length).toBe(4)

    for (const course of courseMocks) {
      const typedCourse: Course = course

      expectAuditFields(typedCourse)
      expect(typeof typedCourse.coursePrice).toBe('number')
      expect(typeof typedCourse.isOnline).toBe('boolean')
    }
  })

  it('exports password-free UserProfile-compatible userProfileMocks', () => {
    expect(userProfileMocks.length).toBeGreaterThan(0)

    for (const profile of userProfileMocks) {
      const typedProfile: UserProfile = profile

      expectAuditFields(typedProfile)
      expect(typeof typedProfile.nickname).toBe('string')
      expect(typeof typedProfile.account).toBe('string')
      expect(typeof typedProfile.isDeleted).toBe('boolean')
      expect(Object.keys(typedProfile)).not.toContain('password')
      expect(Object.keys(typedProfile).some((key) => key.includes('_'))).toBe(false)
    }
  })
})
