import type { CardColor } from '@/models'

export const coursePresentation: Record<
  number,
  {
    duration: string
    lessons: number
    features: string[]
    icon: 'video' | 'graduation' | 'palette' | 'trending'
    color: CardColor
  }
> = {
  1: {
    duration: '8周',
    lessons: 32,
    icon: 'video',
    color: 'blue',
    features: ['Pr/Ae/Final Cut Pro 软件操作', '素材管理与整理逻辑', '基础转场与字幕设计', '音效与配乐选择技巧', '实战项目练习'],
  },
  2: {
    duration: '10周',
    lessons: 40,
    icon: 'graduation',
    color: 'purple',
    features: ['蒙太奇思维与应用', '音效与画面的情绪配合', '影视混剪的「故事重构法」', '节奏控制与张力营造', '经典作品分析解构'],
  },
  3: {
    duration: '6周',
    lessons: 24,
    icon: 'palette',
    color: 'pink',
    features: ['色彩理论与情绪表达', 'DaVinci Resolve 调色流程', 'LUT 应用与风格化调色', '肤色校正与环境氛围', '不同场景调色实战'],
  },
  4: {
    duration: '8周',
    lessons: 32,
    icon: 'trending',
    color: 'green',
    features: ['短视频内容策划方法论', '爆款视频底层逻辑', '平台算法与推荐机制', '数据分析与优化迭代', '账号定位与IP打造'],
  },
}
