import { describe, expect, it } from 'vitest'
import { milestones } from '@/configs/about.config'
import { coursePresentation } from '@/configs/course.config'
import { consultingServices, cooperationWorkflow } from '@/configs/consulting.config'
import {
  homeHeroPoster,
  materialPresentation,
  matrixPresentation,
  videoPresentation,
} from '@/configs/home.config'

describe('presentation configs', () => {
  it('首页配置覆盖四条内容数据', () => {
    expect(homeHeroPoster).toMatch(/^https:\/\//)
    expect(Object.keys(videoPresentation)).toHaveLength(4)
    expect(Object.keys(materialPresentation)).toHaveLength(4)
    expect(Object.keys(matrixPresentation)).toHaveLength(4)
  })

  it('课程和商业咨询配置完整', () => {
    expect(Object.keys(coursePresentation)).toHaveLength(4)
    expect(consultingServices).toHaveLength(4)
    expect(cooperationWorkflow.map((item) => item.step)).toEqual([1, 2, 3, 4])
  })

  it('关于页包含四个成长里程碑', () => {
    expect(milestones).toHaveLength(4)
  })
})
