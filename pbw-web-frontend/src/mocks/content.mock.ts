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
  annualTop10Films: [
    '花样年华：在克制与错过中凝视一段无法说出口的爱情。',
    '海上钢琴师：用音乐讲述天才与远方之间的选择。',
    '饮食男女：从一桌家常饭看见亲情的变化与和解。',
    '千与千寻：在奇幻旅程里完成关于成长与勇气的告别。',
    '小偷家族：用温柔目光重新思考家庭与陪伴的定义。',
    '重庆森林：在城市夜色中捕捉孤独、相遇和新鲜心动。',
    '情书：借一封寄往远方的信追问记忆如何留下回声。',
    '天堂电影院：让一座小镇影院保存少年时代的光。',
    '无间道：在身份交错之间书写忠诚、选择与救赎。',
    '春光乍泄：以流动的镜头记录亲密关系中的靠近与离开。',
  ],
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
    videoCover: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    ...auditDefaults,
  },
  {
    id: 2,
    videoTitle: '我的年度观影清单',
    videoIntro: '整理一年里最值得回看的电影与观看理由。',
    videoUrl: 'https://cdn.example.com/videos/annual-film-list.mp4',
    videoCover: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    ...auditDefaults,
  },
  {
    id: 3,
    videoTitle: '一支短片的声音设计',
    videoIntro: '从环境声到配乐，拆解短片声音设计的基本方法。',
    videoUrl: 'https://cdn.example.com/videos/short-film-sound-design.mp4',
    videoCover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    ...auditDefaults,
  },
  {
    id: 4,
    videoTitle: '如何建立个人素材库',
    videoIntro: '分享素材整理、备份与检索的实用工作流。',
    videoUrl: 'https://cdn.example.com/videos/personal-asset-library.mp4',
    videoCover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    ...auditDefaults,
  },
]

export const materialMocks: MaterialLibraryItem[] = [
  {
    id: 1,
    materialTitle: '影视剪辑音效素材包',
    materialPhoto: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    materialIntro: '适合短视频和影视混剪的常用音效合集。',
    price: 0,
    netdiskUrl: 'https://pan.example.com/materials/sound-effects',
    ...auditDefaults,
  },
  {
    id: 2,
    materialTitle: '电影感调色预设合集',
    materialPhoto: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
    materialIntro: '覆盖室内、夜景和人像场景的调色预设。',
    price: 39.9,
    netdiskUrl: 'https://pan.example.com/materials/color-presets',
    ...auditDefaults,
  },
  {
    id: 3,
    materialTitle: '旅行纪录片转场素材',
    materialPhoto: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    materialIntro: '适合旅行记录与生活方式视频的转场素材。',
    price: 29.9,
    netdiskUrl: 'https://pan.example.com/materials/travel-transitions',
    ...auditDefaults,
  },
  {
    id: 4,
    materialTitle: '创作者分镜模板包',
    materialPhoto: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    materialIntro: '帮助创作者快速梳理镜头、节奏与拍摄计划。',
    price: 19.9,
    netdiskUrl: 'https://pan.example.com/materials/storyboard-templates',
    ...auditDefaults,
  },
]

export const matrixAccountMocks: MatrixAccount[] = [
  {
    id: 1,
    platformName: 'Bilibili',
    platformLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=160&q=80',
    accountUrl: 'https://space.bilibili.com/example',
    intro: '分享影视创作、剪辑技巧与观影思考。',
    ...auditDefaults,
  },
  {
    id: 2,
    platformName: '小红书',
    platformLogo: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=160&q=80',
    accountUrl: 'https://www.xiaohongshu.com/user/profile/example',
    intro: '记录创作日常与电影灵感。',
    ...auditDefaults,
  },
  {
    id: 3,
    platformName: '抖音',
    platformLogo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=160&q=80',
    accountUrl: 'https://www.douyin.com/user/example',
    intro: '发布短视频创作技巧与幕后花絮。',
    ...auditDefaults,
  },
  {
    id: 4,
    platformName: '微信公众号',
    platformLogo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=160&q=80',
    accountUrl: 'https://mp.weixin.qq.com/example',
    intro: '沉淀长文、课程笔记与创作方法。',
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
  {
    id: 3,
    courseName: '电影感画面实战课',
    courseTag: '专项课程',
    courseIntro: '掌握构图、光线与色彩，让画面更有电影质感。',
    coursePrice: 299,
    isOnline: true,
    ...auditDefaults,
  },
  {
    id: 4,
    courseName: '内容账号运营课',
    courseTag: '运营课程',
    courseIntro: '从定位、选题到发布，搭建可持续的内容账号。',
    coursePrice: 499,
    isOnline: false,
    ...auditDefaults,
  },
]

export const userProfileMocks: UserProfile[] = [
  {
    id: 1,
    nickname: 'PBW Creator',
    account: 'pbw_creator',
    email: 'creator@pbw.example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
    role: '用户',
    ...auditDefaults,
  },
]
