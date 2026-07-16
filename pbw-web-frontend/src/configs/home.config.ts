import type { CardColor } from '@/models'

export const homeHeroPoster =
  'https://images.unsplash.com/photo-1575320854760-bfffc3550640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080'

export const videoPresentation: Record<number, { platform: string; views: string }> = {
  1: { platform: '抖音', views: '180万' },
  2: { platform: 'B站', views: '95万' },
  3: { platform: '小红书', views: '62万' },
  4: { platform: '抖音', views: '210万' },
}

export const materialPresentation: Record<
  number,
  { itemCount: number; icon: 'scissors' | 'volume' | 'video' | 'gift'; color: CardColor }
> = {
  1: { itemCount: 150, icon: 'scissors', color: 'blue' },
  2: { itemCount: 300, icon: 'volume', color: 'purple' },
  3: { itemCount: 20, icon: 'video', color: 'green' },
  4: { itemCount: 100, icon: 'gift', color: 'orange' },
}

export const matrixPresentation: Record<
  number,
  { displayName: string; followers: string; color: CardColor }
> = {
  1: { displayName: '影像创作者', followers: '15万', color: 'black' },
  2: { displayName: '影像创作者', followers: '8万', color: 'pink' },
  3: { displayName: '影像创作者', followers: '5万', color: 'red' },
  4: { displayName: '影像创作者', followers: '3万', color: 'green' },
}
