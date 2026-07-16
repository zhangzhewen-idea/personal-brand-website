import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { basicInfoService } from '@/services/basic-info.service'
import BasicInfoView from '@/views/content/BasicInfoView.vue'

afterEach(() => vi.restoreAllMocks())

describe('BasicInfoView', () => {
  it('展示基本信息完整业务字段且不提供删除入口', async () => {
    const wrapper = mount(BasicInfoView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    for (const label of [
      '全网播放量', '全网点赞数', '全网粉丝数', '作者身份标签', 'slogan', '创作态度',
      '联系邮箱', '联系方式', '联系二维码', '年度十佳影片', '影响我的三位导演',
      '首页封面视频', '作者照片', '剪辑台工作照', '素材库截图', '观影日常照片',
      'ID', '状态', '创建时间', '更新时间',
    ]) {
      expect(wrapper.text()).toContain(label)
    }
    expect(wrapper.text()).toContain('用镜头拆解故事')
    expect(wrapper.text()).toContain('《奥本海默》')
    expect(wrapper.text()).not.toContain('删除')
  })

  it('加载失败时显示错误和可见的重试入口，重试成功后恢复内容', async () => {
    vi.spyOn(basicInfoService, 'get')
      .mockRejectedValueOnce(new Error('基本信息暂不可用'))
      .mockResolvedValueOnce({
        id: 1,
        createTime: '2026-01-01T00:00:00.000Z',
        updateTime: '2026-01-02T00:00:00.000Z',
        isDeleted: false,
        homeCoverVideo: null,
        contactEmail: 'retry@example.com',
        contactQrCode: null,
        totalPlayCount: 1,
        totalLikeCount: 2,
        totalFollowerCount: 3,
        authorIdentityTag: '重试成功',
        slogan: null,
        creationAttitude: null,
        authorPhoto: null,
        editingDeskWorkPhoto: null,
        assetLibraryScreenshot: null,
        dailyMovieWatchingPhoto: null,
        annualTop10Films: [],
        influentialThreeDirectors: [],
        contactInfo: null,
      })

    const wrapper = mount(BasicInfoView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('基本信息暂不可用')
    const retry = wrapper.findAll('button').find((button) => button.text().includes('重试'))
    expect(retry).toBeDefined()

    await retry!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('重试成功')
    expect(basicInfoService.get).toHaveBeenCalledTimes(2)
  })

  it('异步加载时显示可见加载状态', async () => {
    let resolveInfo!: Awaited<ReturnType<typeof basicInfoService.get>> extends infer T ? (info: T) => void : never
    vi.spyOn(basicInfoService, 'get').mockReturnValue(new Promise((resolve) => { resolveInfo = resolve }))
    const wrapper = mount(BasicInfoView, { global: { plugins: [createPinia()] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.el-skeleton').exists()).toBe(true)

    resolveInfo({
      id: 1,
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-02T00:00:00.000Z',
      isDeleted: false,
      homeCoverVideo: null,
      contactEmail: null,
      contactQrCode: null,
      totalPlayCount: 0,
      totalLikeCount: 0,
      totalFollowerCount: 0,
      authorIdentityTag: null,
      slogan: null,
      creationAttitude: null,
      authorPhoto: null,
      editingDeskWorkPhoto: null,
      assetLibraryScreenshot: null,
      dailyMovieWatchingPhoto: null,
      annualTop10Films: [],
      influentialThreeDirectors: [],
      contactInfo: null,
    })
    await flushPromises()

    expect(wrapper.find('.el-skeleton').exists()).toBe(false)
  })
})
