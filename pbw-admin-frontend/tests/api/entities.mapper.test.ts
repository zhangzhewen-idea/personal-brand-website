import {
  mapBasicInfoDto,
  mapCourseDto,
  mapMaterialDto,
  mapMatrixAccountDto,
  mapUserDto,
  mapVideoDto,
} from '@/api/mappers/entities.mapper'
import type { BasicInfoDto, UserDto } from '@/api/dto/entities.dto'

const basicInfoDto: BasicInfoDto = {
  id: 1,
  home_cover_video: 'cover.mp4',
  contact_email: null,
  contact_qr_code: 'qr.png',
  total_play_count: 12800000,
  total_like_count: 860000,
  total_follower_count: 240000,
  author_identity_tag: '创作者',
  slogan: '用镜头拆解故事',
  creation_attitude: null,
  author_photo: null,
  editing_desk_work_photo: null,
  asset_library_screenshot: null,
  daily_movie_watching_photo: null,
  annual_top_10_films: null,
  influential_three_directors: null,
  contact_info: '微信：brandstudio01',
  create_time: '2026-01-01 00:00:00',
  update_time: '2026-01-02 00:00:00',
  is_deleted: 1,
}

const mapBasicInfoWith = (overrides: Partial<Pick<BasicInfoDto, 'annual_top_10_films' | 'influential_three_directors'>>) =>
  mapBasicInfoDto({ ...basicInfoDto, ...overrides })

describe('entities mapper', () => {
  it('maps basic info JSON fields, booleans, and snake_case names', () => {
    const result = mapBasicInfoDto({
      ...basicInfoDto,
      annual_top_10_films: '["《奥本海默》","《寄生虫》"]',
      influential_three_directors: 'not-json',
    })

    expect(result).toEqual({
      id: 1,
      createTime: '2026-01-01 00:00:00',
      updateTime: '2026-01-02 00:00:00',
      isDeleted: true,
      homeCoverVideo: 'cover.mp4',
      contactEmail: null,
      contactQrCode: 'qr.png',
      totalPlayCount: 12800000,
      totalLikeCount: 860000,
      totalFollowerCount: 240000,
      authorIdentityTag: '创作者',
      slogan: '用镜头拆解故事',
      creationAttitude: null,
      authorPhoto: null,
      editingDeskWorkPhoto: null,
      assetLibraryScreenshot: null,
      dailyMovieWatchingPhoto: null,
      annualTop10Films: ['《奥本海默》', '《寄生虫》'],
      influentialThreeDirectors: [],
      contactInfo: '微信：brandstudio01',
    })
  })

  it('returns arrays for valid JSON and native arrays, and [] for invalid JSON or invalid arrays', () => {
    const invalidArray = [1, '导演'] as unknown as string[]

    expect(mapBasicInfoWith({ annual_top_10_films: '["影片 A"]' }).annualTop10Films).toEqual(['影片 A'])
    expect(mapBasicInfoWith({ annual_top_10_films: ['影片 B'] }).annualTop10Films).toEqual(['影片 B'])
    expect(mapBasicInfoWith({ annual_top_10_films: null }).annualTop10Films).toEqual([])
    expect(mapBasicInfoWith({ annual_top_10_films: 'invalid-json' }).annualTop10Films).toEqual([])
    expect(mapBasicInfoWith({ annual_top_10_films: invalidArray }).annualTop10Films).toEqual([])

    expect(mapBasicInfoWith({ influential_three_directors: '["导演 A"]' }).influentialThreeDirectors).toEqual(['导演 A'])
    expect(mapBasicInfoWith({ influential_three_directors: ['导演 B'] }).influentialThreeDirectors).toEqual(['导演 B'])
    expect(mapBasicInfoWith({ influential_three_directors: null }).influentialThreeDirectors).toEqual([])
    expect(mapBasicInfoWith({ influential_three_directors: 'invalid-json' }).influentialThreeDirectors).toEqual([])
    expect(mapBasicInfoWith({ influential_three_directors: invalidArray }).influentialThreeDirectors).toEqual([])
  })

  it('uses zero for invalid or non-finite material and course prices', () => {
    const invalidPrices: Array<number | string> = [
      '',
      'not-a-number',
      'NaN',
      'Infinity',
      '-Infinity',
      Number.NaN,
      Number.POSITIVE_INFINITY,
    ]

    for (const price of invalidPrices) {
      expect(mapMaterialDto({
        id: 3,
        material_title: '素材',
        material_photo: null,
        material_intro: null,
        price,
        netdisk_url: null,
        create_time: 'c',
        update_time: 'u',
        is_deleted: 0,
      }).price).toBe(0)

      expect(mapCourseDto({
        id: 5,
        course_name: '课程',
        course_tag: null,
        course_intro: null,
        course_price: price,
        is_online: 0,
        create_time: 'c',
        update_time: 'u',
        is_deleted: 0,
      }).coursePrice).toBe(0)
    }
  })

  it('maps list DTOs and excludes user password from the domain model', () => {
    expect(mapVideoDto({
      id: 2,
      video_title: '视频',
      video_intro: null,
      video_url: '/video.mp4',
      video_cover: null,
      create_time: 'c',
      update_time: 'u',
      is_deleted: 0,
    }).videoTitle).toBe('视频')

    expect(mapMaterialDto({
      id: 3,
      material_title: '素材',
      material_photo: null,
      material_intro: null,
      price: '39.90',
      netdisk_url: null,
      create_time: 'c',
      update_time: 'u',
      is_deleted: 0,
    }).price).toBe(39.9)

    expect(mapMatrixAccountDto({
      id: 4,
      platform_name: '抖音',
      platform_logo: null,
      account_url: null,
      intro: null,
      create_time: 'c',
      update_time: 'u',
      is_deleted: 0,
    }).platformName).toBe('抖音')

    const onlineCourse = mapCourseDto({
      id: 5,
      course_name: '入门课',
      course_tag: null,
      course_intro: null,
      course_price: '199.00',
      is_online: 1,
      create_time: 'c',
      update_time: 'u',
      is_deleted: 0,
    })

    expect(onlineCourse.coursePrice).toBe(199)
    expect(onlineCourse.isOnline).toBe(true)
    expect(mapCourseDto({
      id: 7,
      course_name: '未上线课程',
      course_tag: null,
      course_intro: null,
      course_price: '299.00',
      is_online: 0,
      create_time: 'c',
      update_time: 'u',
      is_deleted: 0,
    }).isOnline).toBe(false)

    const userDtoWithRuntimePassword: Omit<UserDto, 'password'> & { password: string } = {
      id: 6,
      nickname: '管理员',
      account: 'admin',
      password: 'secret',
      email: null,
      avatar: null,
      role: '管理员',
      create_time: 'c',
      update_time: 'u',
      is_deleted: 0,
    }
    const user = mapUserDto(userDtoWithRuntimePassword)

    expect(user).toEqual({
      id: 6,
      createTime: 'c',
      updateTime: 'u',
      isDeleted: false,
      nickname: '管理员',
      account: 'admin',
      email: null,
      avatar: null,
      role: '管理员',
    })
    expect('password' in user).toBe(false)
  })
})
