import type { BasicInfo, Course, MaterialItem, VideoItem } from '@/types/models'

export const basicInfoFixture: BasicInfo = {
  id: 1,
  homeCoverVideo: null,
  contactEmail: 'contact@example.com',
  contactQrCode: 'http://localhost/contact-qr.jpg',
  totalPlayCount: 100,
  totalLikeCount: 20,
  totalFollowerCount: 10,
  authorIdentityTag: '影像创作者',
  slogan: '让每一帧都有力量',
  creationAttitude: '持续创作',
  authorPhoto: null,
  editingDeskWorkPhoto: null,
  assetLibraryScreenshot: null,
  dailyMovieWatchingPhoto: null,
  annualTop10Films: [],
  influentialThreeDirectors: [],
  contactInfo: 'brandstudio011',
}

export const videoFixture: VideoItem = {
  id: 1,
  videoTitle: '测试视频',
  videoIntro: '视频介绍',
  videoUrl: 'http://localhost/test.mp4',
  videoCover: null,
  platformName: '测试平台',
  playCountText: '100',
}

export const paidMaterialFixture: MaterialItem = {
  id: 1,
  materialTitle: '字幕样式模板',
  materialPhoto: null,
  materialIntro: '模板介绍',
  price: 29,
  netdiskUrl: null,
  itemCount: 20,
  isFree: false,
  colorClass: 'bg-green-600',
  iconName: 'Video',
}

export const onlineCourseFixture: Course = {
  id: 1,
  courseName: '短视频剪辑实战课',
  courseTag: '实战',
  courseIntro: '课程介绍',
  coursePrice: 399,
  isOnline: true,
  duration: '8周',
  lessonCount: 32,
  features: ['实战项目练习'],
  colorClass: 'bg-purple-500',
  iconName: 'GraduationCap',
}
