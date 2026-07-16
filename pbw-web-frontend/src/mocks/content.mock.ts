import type {
  BasicInfo,
  Course,
  MaterialLibraryItem,
  MatrixAccount,
  UserProfile,
  Video,
} from '@/models'

const auditDefaults = {
  createTime: '2025-01-01T00:00:00.000Z',
  updateTime: '2025-01-01T00:00:00.000Z',
  isDeleted: false,
} as const

export const basicInfoMock: BasicInfo = {
  id: 1,
  homeCoverVideo: 'https://cdn.example.com/videos/home-cover.mp4',
  contactEmail: 'hello@pbw.example.com',
  contactQrCode: 'https://cdn.example.com/images/contact-qr-code.png',
  totalPlayCount: 10_000_000,
  totalLikeCount: 500_000,
  totalFollowerCount: 200_000,
  authorIdentityTag: '独立创作者 · 影视内容人',
  slogan: '把热爱拍成作品，把作品分享给更多人。',
  creationAttitude: '保持好奇，持续创作。',
  authorPhoto: 'https://cdn.example.com/images/author-photo.jpg',
  editingDeskWorkPhoto: 'https://cdn.example.com/images/editing-desk.jpg',
  assetLibraryScreenshot: 'https://cdn.example.com/images/asset-library.jpg',
  dailyMovieWatchingPhoto: 'https://cdn.example.com/images/movie-watching.jpg',
  annualTop10Films: ['花样年华', '海上钢琴师', '饮食男女'],
  influentialThreeDirectors: ['王家卫', '是枝裕和', 'Christopher Nolan'],
  contactInfo: '工作日 10:00 - 18:00 回复合作消息',
  ...auditDefaults,
}

export const videoMocks: Video[] = [
  {
    id: 1,
    videoTitle: '如何用镜头记录日常灵感',
    videoIntro: '从选题、拍摄到剪辑，分享一支视频的完整创作过程。',
    videoUrl: 'https://cdn.example.com/videos/daily-inspiration.mp4',
    videoCover: 'https://cdn.example.com/images/daily-inspiration-cover.jpg',
    ...auditDefaults,
  },
  {
    id: 2,
    videoTitle: '我的年度观影清单',
    videoIntro: '整理一年里最值得回看的电影与观看理由。',
    videoUrl: 'https://cdn.example.com/videos/annual-film-list.mp4',
    videoCover: 'https://cdn.example.com/images/annual-film-list-cover.jpg',
    ...auditDefaults,
  },
]

export const materialMocks: MaterialLibraryItem[] = [
  {
    id: 1,
    materialTitle: '影视剪辑音效素材包',
    materialPhoto: 'https://cdn.example.com/images/sound-effects.jpg',
    materialIntro: '适合短视频和影视混剪的常用音效合集。',
    price: 0,
    netdiskUrl: 'https://pan.example.com/materials/sound-effects',
    ...auditDefaults,
  },
  {
    id: 2,
    materialTitle: '电影感调色预设合集',
    materialPhoto: 'https://cdn.example.com/images/color-presets.jpg',
    materialIntro: '覆盖室内、夜景和人像场景的调色预设。',
    price: 39.9,
    netdiskUrl: 'https://pan.example.com/materials/color-presets',
    ...auditDefaults,
  },
]

export const matrixAccountMocks: MatrixAccount[] = [
  {
    id: 1,
    platformName: 'Bilibili',
    platformLogo: 'https://cdn.example.com/images/platform-bilibili.png',
    accountUrl: 'https://space.bilibili.com/example',
    intro: '分享影视创作、剪辑技巧与观影思考。',
    ...auditDefaults,
  },
  {
    id: 2,
    platformName: '小红书',
    platformLogo: 'https://cdn.example.com/images/platform-xiaohongshu.png',
    accountUrl: 'https://www.xiaohongshu.com/user/profile/example',
    intro: '记录创作日常与电影灵感。',
    ...auditDefaults,
  },
]

export const courseMocks: Course[] = [
  {
    id: 1,
    courseName: '短视频剪辑入门',
    courseTag: '入门课程',
    courseIntro: '从零开始掌握短视频剪辑的完整工作流。',
    coursePrice: 199,
    isOnline: true,
    ...auditDefaults,
  },
  {
    id: 2,
    courseName: '个人创作者进阶课',
    courseTag: '进阶课程',
    courseIntro: '建立稳定的内容方法，完成从灵感到作品的转化。',
    coursePrice: 399,
    isOnline: true,
    ...auditDefaults,
  },
]

export const userProfileMocks: UserProfile[] = [
  {
    id: 1,
    nickname: 'PBW Creator',
    account: 'pbw_creator',
    email: 'creator@pbw.example.com',
    avatar: 'https://cdn.example.com/images/avatar-creator.jpg',
    role: '用户',
    ...auditDefaults,
  },
]
