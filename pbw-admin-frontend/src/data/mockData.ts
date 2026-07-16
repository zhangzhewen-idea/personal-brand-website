import type {
  BasicInfo,
  Course,
  MaterialLibrary,
  MatrixAccount,
  User,
  Video,
} from '@/types/database'

const timestamps = {
  createTime: '2026-07-16 21:00:00',
  updateTime: '2026-07-16 21:00:00',
  isDeleted: false,
}

export const basicInfo: BasicInfo = {
  id: 1,
  homeCoverVideo: 'https://cdn.example.com/videos/home-cover-1.mp4',
  contactEmail: 'contact@example.com',
  contactQrCode: 'https://cdn.example.com/qrcode/contact-qr-1.png',
  totalPlayCount: 12800000,
  totalLikeCount: 860000,
  totalFollowerCount: 240000,
  authorIdentityTag: '电影解说创作者 / 剪辑师',
  slogan: '用镜头拆解故事',
  creationAttitude: '先理解，再表达；先克制，再准确。',
  authorPhoto: 'https://cdn.example.com/images/author-photo-1.jpg',
  editingDeskWorkPhoto: 'https://cdn.example.com/images/editing-desk-1.jpg',
  assetLibraryScreenshot: 'https://cdn.example.com/images/asset-library-1.jpg',
  dailyMovieWatchingPhoto: 'https://cdn.example.com/images/daily-movie-1.jpg',
  annualTop10Films: ['《奥本海默》', '《爱乐之城》', '《燃烧女子的肖像》', '《敦刻尔克》', '《寄生虫》'],
  influentialThreeDirectors: ['希区柯克', '诺兰', '是枝裕和'],
  contactInfo: '微信：brandstudio01',
  ...timestamps,
}

export const videos: Video[] = [
  {
    id: 1,
    videoTitle: '为什么这部电影能封神',
    videoIntro: '从叙事结构、镜头语言和人物动机三个角度拆解。',
    videoUrl: 'https://cdn.example.com/videos/video-1.mp4',
    videoCover: 'https://cdn.example.com/covers/video-cover-1.jpg',
    ...timestamps,
  },
  {
    id: 2,
    videoTitle: '三分钟看懂角色弧光',
    videoIntro: '用一个完整案例讲清角色变化如何服务主题表达。',
    videoUrl: 'https://cdn.example.com/videos/video-2.mp4',
    videoCover: 'https://cdn.example.com/covers/video-cover-2.jpg',
    ...timestamps,
  },
  {
    id: 3,
    videoTitle: '我最常用的剪辑节奏模板',
    videoIntro: '分享节奏控制、转场和音效搭配的常用方法。',
    videoUrl: 'https://cdn.example.com/videos/video-3.mp4',
    videoCover: 'https://cdn.example.com/covers/video-cover-3.jpg',
    ...timestamps,
  },
]

export const materials: MaterialLibrary[] = [
  {
    id: 1,
    materialTitle: '电影海报素材包',
    materialPhoto: 'https://cdn.example.com/materials/poster-pack.jpg',
    materialIntro: '适合电影解说封面、分镜展示和宣传页使用。',
    price: 39.9,
    stock: 120,
    specifications: [
      { name: '颜色', value: '红色' },
      { name: '尺寸', value: 'L 码' },
    ],
    netdiskUrl: 'https://pan.example.com/s/abcd1234',
    ...timestamps,
  },
  {
    id: 2,
    materialTitle: '转场动效合集',
    materialPhoto: 'https://cdn.example.com/materials/transition-pack.jpg',
    materialIntro: '包含 100+ 常用转场，适合短视频快节奏剪辑。',
    price: 59,
    stock: 80,
    specifications: [{ name: '格式', value: 'Premiere Pro' }],
    netdiskUrl: 'https://pan.example.com/s/efgh5678',
    ...timestamps,
  },
  {
    id: 3,
    materialTitle: '字幕样式模板',
    materialPhoto: 'https://cdn.example.com/materials/subtitle-pack.jpg',
    materialIntro: '适合打造统一视觉风格的片头字幕与重点标注。',
    price: 29,
    stock: 200,
    specifications: [{ name: '版本', value: '通用版' }],
    netdiskUrl: 'https://pan.example.com/s/ijkl9012',
    ...timestamps,
  },
]

export const matrixAccounts: MatrixAccount[] = [
  {
    id: 1,
    platformName: '抖音',
    platformLogo: 'https://cdn.example.com/logos/douyin.png',
    accountUrl: 'https://www.douyin.com/user/example',
    intro: '主阵地账号，更新电影解说和剪辑技巧内容。',
    ...timestamps,
  },
  {
    id: 2,
    platformName: 'B站',
    platformLogo: 'https://cdn.example.com/logos/bilibili.png',
    accountUrl: 'https://space.bilibili.com/example',
    intro: '偏长内容与系列化专题，适合深度解析。',
    ...timestamps,
  },
  {
    id: 3,
    platformName: '小红书',
    platformLogo: 'https://cdn.example.com/logos/xiaohongshu.png',
    accountUrl: 'https://www.xiaohongshu.com/user/profile/example',
    intro: '偏图文和短视频种草，展示幕后和素材整理。',
    ...timestamps,
  },
]

export const courses: Course[] = [
  {
    id: 1,
    courseName: '电影解说入门课',
    courseTag: '剪辑 / 解说 / 表达',
    courseIntro: '从选题、脚本到剪辑节奏，完整覆盖入门流程。',
    coursePrice: 199,
    isOnline: true,
    ...timestamps,
  },
  {
    id: 2,
    courseName: '短视频剪辑实战课',
    courseTag: '转场 / 节奏 / 音效',
    courseIntro: '围绕短视频制作效率和画面张力，给出实操方法。',
    coursePrice: 299,
    isOnline: true,
    ...timestamps,
  },
  {
    id: 3,
    courseName: '账号内容增长课',
    courseTag: '选题 / 复盘 / 增长',
    courseIntro: '帮助创作者建立稳定更新和数据复盘机制。',
    coursePrice: 399,
    isOnline: false,
    ...timestamps,
  },
]

export const users: User[] = [
  {
    id: 1,
    nickname: '管理员',
    account: 'admin',
    password: '123456',
    email: 'admin@example.com',
    avatar: 'https://cdn.example.com/avatars/admin.jpg',
    role: '管理员',
    ...timestamps,
  },
  {
    id: 2,
    nickname: 'movie_fan',
    account: 'movie_fan',
    password: '123456',
    email: 'moviefan@example.com',
    avatar: 'https://cdn.example.com/avatars/user-1.jpg',
    role: '用户',
    ...timestamps,
  },
  {
    id: 3,
    nickname: 'editor_life',
    account: 'editor_life',
    password: '123456',
    email: 'editorlife@example.com',
    avatar: 'https://cdn.example.com/avatars/user-2.jpg',
    role: '用户',
    ...timestamps,
  },
]
