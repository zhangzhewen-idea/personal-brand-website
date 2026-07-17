import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VideoPlayerModal from './VideoPlayerModal.vue'

describe('VideoPlayerModal', () => {
  it('在浮层中播放指定视频并允许关闭', async () => {
    const wrapper = mount(VideoPlayerModal, {
      props: { open: true, title: '测试视频', videoUrl: '/test.mp4' },
      global: { stubs: { Teleport: true } },
    })

    const video = wrapper.get('video')
    expect(video.attributes('src')).toBe('/test.mp4')
    expect(video.attributes()).toHaveProperty('controls')
    expect(video.attributes()).toHaveProperty('autoplay')

    await wrapper.get('[aria-label="关闭"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('关闭时卸载播放器', () => {
    const wrapper = mount(VideoPlayerModal, {
      props: { open: false, title: '测试视频', videoUrl: '/test.mp4' },
      global: { stubs: { Teleport: true } },
    })

    expect(wrapper.find('video').exists()).toBe(false)
  })
})
