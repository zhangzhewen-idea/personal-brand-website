import type { BasicInfo, Course, MaterialItem, MatrixAccount, VideoItem } from '@/types/models'

const audit = { createTime: '2026-07-17 00:00:00', updateTime: '2026-07-17 00:00:00', isDeleted: false }

export const basicInfo: BasicInfo = {
  id: 1, ...audit,
  homeCoverVideo: '/videos/home-cover-1.mp4',
  contactEmail: 'contact@example.com',
  contactQrCode: '/qrcode/contact-qr-1.png',
  totalPlayCount: 12_800_000,
  totalLikeCount: 860_000,
  totalFollowerCount: 240_000,
  authorIdentityTag: '电影解说创作者 / 剪辑师',
  slogan: '用镜头拆解故事',
  creationAttitude: '先理解，再表达；先克制，再准确。',
  authorPhoto: '/images/author-photo-1.jpg',
  editingDeskWorkPhoto: '/images/editing-desk-1.jpg',
  assetLibraryScreenshot: '/images/asset-library-1.jpg',
  dailyMovieWatchingPhoto: '/images/daily-movie-1.jpg',
  annualTop10Films: ['《奥本海默》', '《爱乐之城》', '《燃烧女子的肖像》', '《敦刻尔克》', '《寄生虫》'],
  influentialThreeDirectors: ['希区柯克', '诺兰', '是枝裕和'],
  contactInfo: '微信：brandstudio01',
}

export const videos: VideoItem[] = [
  { id: 1, ...audit, videoTitle: '为什么这部电影能封神', videoIntro: '从叙事结构、镜头语言和人物动机三个角度拆解。', videoUrl: '/videos/video-1.mp4', videoCover: '/covers/video-cover-1.jpg', platformName: '抖音', playCountText: '180万' },
  { id: 2, ...audit, videoTitle: '三分钟看懂角色弧光', videoIntro: '用一个完整案例讲清角色变化如何服务主题表达。', videoUrl: '/videos/video-2.mp4', videoCover: '/covers/video-cover-2.jpg', platformName: 'B站', playCountText: '95万' },
  { id: 3, ...audit, videoTitle: '我最常用的剪辑节奏模板', videoIntro: '分享节奏控制、转场和音效搭配的常用方法。', videoUrl: '/videos/video-3.mp4', videoCover: '/covers/video-cover-3.jpg', platformName: '小红书', playCountText: '62万' },
  { id: 4, ...audit, videoTitle: '城市脉搏：延时摄影混剪', videoIntro: '捕捉城市的昼夜更替，感受时间的流动之美。', videoUrl: '/videos/video-4.mp4', videoCover: '/covers/video-cover-4.jpg', platformName: '抖音', playCountText: '210万' },
]

export const materials: MaterialItem[] = [
  { id: 1, ...audit, materialTitle: '电影海报素材包', materialPhoto: '/materials/poster-pack.jpg', materialIntro: '适合电影解说封面、分镜展示和宣传页使用。', price: 39.9, netdiskUrl: 'https://pan.example.com/s/abcd1234', itemCount: 150, isFree: false, colorClass: 'bg-blue-500', iconName: 'Scissors' },
  { id: 2, ...audit, materialTitle: '转场动效合集', materialPhoto: '/materials/transition-pack.jpg', materialIntro: '包含 100+ 常用转场，适合短视频快节奏剪辑。', price: 59, netdiskUrl: 'https://pan.example.com/s/efgh5678', itemCount: 300, isFree: false, colorClass: 'bg-purple-500', iconName: 'Volume2' },
  { id: 3, ...audit, materialTitle: '字幕样式模板', materialPhoto: '/materials/subtitle-pack.jpg', materialIntro: '适合打造统一视觉风格的片头字幕与重点标注。', price: 29, netdiskUrl: 'https://pan.example.com/s/ijkl9012', itemCount: 20, isFree: false, colorClass: 'bg-green-500', iconName: 'Video' },
  { id: 4, ...audit, materialTitle: '粉丝福利', materialPhoto: null, materialIntro: '免费素材整合包，持续更新。', price: 0, netdiskUrl: 'https://pan.example.com/s/fans', itemCount: 100, isFree: true, colorClass: 'bg-orange-500', iconName: 'Gift' },
]

export const matrixAccounts: MatrixAccount[] = [
  { id: 1, ...audit, platformName: '抖音', platformLogo: '/logos/douyin.png', accountUrl: 'https://www.douyin.com/user/example', intro: '主阵地账号，更新电影解说和剪辑技巧内容。', followerCountText: '15万', colorClass: 'bg-black' },
  { id: 2, ...audit, platformName: 'B站', platformLogo: '/logos/bilibili.png', accountUrl: 'https://space.bilibili.com/example', intro: '偏长内容与系列化专题，适合深度解析。', followerCountText: '8万', colorClass: 'bg-pink-500' },
  { id: 3, ...audit, platformName: '小红书', platformLogo: '/logos/xiaohongshu.png', accountUrl: 'https://www.xiaohongshu.com/user/profile/example', intro: '偏图文和短视频种草，展示幕后和素材整理。', followerCountText: '5万', colorClass: 'bg-red-500' },
  { id: 4, ...audit, platformName: '视频号', platformLogo: '/logos/wechat-video.png', accountUrl: 'https://weixin.qq.com', intro: '同步发布精选内容。', followerCountText: '3万', colorClass: 'bg-green-500' },
]

export const courses: Course[] = [
  { id: 1, ...audit, courseName: '电影解说入门课', courseTag: '剪辑 / 解说 / 表达', courseIntro: '从选题、脚本到剪辑节奏，完整覆盖入门流程。', coursePrice: 199, isOnline: true, duration: '8周', lessonCount: 32, colorClass: 'bg-blue-500', iconName: 'Video', features: ['Pr/Ae/Final Cut Pro 软件操作', '素材管理与整理逻辑', '基础转场与字幕设计', '音效与配乐选择技巧', '实战项目练习'] },
  { id: 2, ...audit, courseName: '短视频剪辑实战课', courseTag: '转场 / 节奏 / 音效', courseIntro: '围绕短视频制作效率和画面张力，给出实操方法。', coursePrice: 299, isOnline: true, duration: '10周', lessonCount: 40, colorClass: 'bg-purple-500', iconName: 'GraduationCap', features: ['蒙太奇思维与应用', '音效与画面的情绪配合', '影视混剪的故事重构法', '节奏控制与张力营造', '经典作品分析解构'] },
  { id: 3, ...audit, courseName: '账号内容增长课', courseTag: '选题 / 复盘 / 增长', courseIntro: '帮助创作者建立稳定更新和数据复盘机制。', coursePrice: 399, isOnline: false, duration: '6周', lessonCount: 24, colorClass: 'bg-pink-500', iconName: 'Palette', features: ['色彩理论与情绪表达', '数据复盘流程', '内容风格定位', '账号视觉统一', '不同场景实战'] },
  { id: 4, ...audit, courseName: '短视频策划课', courseTag: '实战级', courseIntro: '学习短视频策划与运营，打造爆款内容。', coursePrice: 999, isOnline: false, duration: '8周', lessonCount: 32, colorClass: 'bg-green-500', iconName: 'TrendingUp', features: ['短视频内容策划方法论', '爆款视频底层逻辑', '平台算法与推荐机制', '数据分析与优化迭代', '账号定位与IP打造'] },
]
