import type { CardColor } from '@/models'

export interface ConsultingService {
  id: number
  title: string
  description: string
  icon: 'video' | 'sparkles' | 'camera' | 'award'
  features: string[]
  price: string
  duration: string
  color: CardColor
}

export const consultingServices: ConsultingService[] = [
  { id: 1, title: '宣传片剪辑', description: '企业形象片、品牌宣传片专业剪辑制作，提升品牌形象', icon: 'video', features: ['专业剪辑团队', '快速交付', '不限修改次数', '提供源文件'], price: '¥2000起', duration: '3-5个工作日', color: 'blue' },
  { id: 2, title: '产品短视频', description: '电商产品展示视频、种草视频，提升转化率', icon: 'sparkles', features: ['创意策划', '精美包装', '适配多平台', '提升转化'], price: '¥800起', duration: '2-3个工作日', color: 'purple' },
  { id: 3, title: '活动记录快剪', description: '会议、活动现场快速剪辑，当天交付精彩瞬间', icon: 'camera', features: ['快速响应', '当天交付', '多机位剪辑', '精彩集锦'], price: '¥1500起', duration: '1-2个工作日', color: 'green' },
  { id: 4, title: '年会视频制作', description: '年会开场视频、年度回顾视频，打造震撼效果', icon: 'award', features: ['创意策划', '特效制作', '配音配乐', '现场播放支持'], price: '¥3000起', duration: '5-7个工作日', color: 'orange' },
]

export const cooperationWorkflow = [
  { step: 1, title: '联系咨询', description: '扫码添加微信，说明需求' },
  { step: 2, title: '需求沟通', description: '详细了解项目需求与预算' },
  { step: 3, title: '方案确认', description: '提供方案与报价，确认合作' },
  { step: 4, title: '制作交付', description: '按时交付成品，支持修改' },
]

export const caseStudies = [1, 2, 3].map((id) => ({
  id,
  title: `客户案例 ${id}`,
  description: '为知名品牌提供专业视频制作服务，获得客户高度认可',
}))
