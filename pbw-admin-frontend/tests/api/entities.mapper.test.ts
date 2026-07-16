import {
  mapBasicInfoDto,
  mapCourseDto,
  mapMaterialDto,
  mapMatrixAccountDto,
  mapUserDto,
  mapVideoDto,
} from '@/api/mappers/entities.mapper'

describe('entities mapper', () => {
  it('maps basic info JSON fields, booleans, and snake_case names', () => {
    const result = mapBasicInfoDto({
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
      annual_top_10_films: '["《奥本海默》","《寄生虫》"]',
      influential_three_directors: 'not-json',
      contact_info: '微信：brandstudio01',
      create_time: '2026-01-01 00:00:00',
      update_time: '2026-01-02 00:00:00',
      is_deleted: 1,
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

    expect(mapCourseDto({
      id: 5,
      course_name: '入门课',
      course_tag: null,
      course_intro: null,
      course_price: 199,
      is_online: 1,
      create_time: 'c',
      update_time: 'u',
      is_deleted: 0,
    }).isOnline).toBe(true)

    const user = mapUserDto({
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
    })

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
