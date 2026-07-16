import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCourseStore, useMaterialStore, useMatrixAccountStore, useVideoStore } from '@/stores/entities'
import CourseListView from '@/views/CourseListView.vue'
import MaterialListView from '@/views/MaterialListView.vue'
import MatrixAccountListView from '@/views/MatrixAccountListView.vue'
import VideoListView from '@/views/VideoListView.vue'
import { createAppRouter } from '@/router'

afterEach(() => vi.restoreAllMocks())

const deleteActionStub = {
  props: ['onDelete', 'loading', 'title', 'buttonText'],
  template: '<button data-testid="delete-action" :data-title="title" :disabled="loading" @click="onDelete">{{ buttonText }}</button>',
}

const mountOptions = (pinia: ReturnType<typeof createPinia>) => ({
  global: { plugins: [pinia], stubs: { DeleteAction: deleteActionStub } },
})

describe('内容管理页面', () => {
  it('视频页面展示视频字段、封面和审计字段', async () => {
    const wrapper = mount(VideoListView, mountOptions(createPinia()))
    await flushPromises()

    for (const field of ['视频标题', '简介', '视频 URL', '封面', 'ID', '状态', '创建时间', '更新时间']) {
      expect(wrapper.text()).toContain(field)
    }
    expect(wrapper.text()).toContain('为什么这部电影能封神')
    expect(wrapper.text()).toContain('https://cdn.example.com/videos/video-1.mp4')
    expect(wrapper.find('img[src="https://cdn.example.com/covers/video-cover-1.jpg"]').exists()).toBe(true)
  })

  it('素材页面展示素材字段并将价格格式化为两位小数', async () => {
    const wrapper = mount(MaterialListView, mountOptions(createPinia()))
    await flushPromises()

    for (const field of ['素材标题', '简介', '图片', '价格', '网盘 URL', 'ID', '状态', '创建时间', '更新时间']) {
      expect(wrapper.text()).toContain(field)
    }
    expect(wrapper.text()).toContain('¥39.90')
    expect(wrapper.text()).toContain('https://pan.example.com/s/abcd1234')
  })

  it('矩阵账号页面展示平台、logo、账号链接和审计字段', async () => {
    const wrapper = mount(MatrixAccountListView, mountOptions(createPinia()))
    await flushPromises()

    for (const field of ['平台名称', 'Logo', '账号链接', '简介', 'ID', '状态', '创建时间', '更新时间']) {
      expect(wrapper.text()).toContain(field)
    }
    expect(wrapper.text()).toContain('抖音')
    expect(wrapper.text()).toContain('https://www.douyin.com/user/example')
    expect(wrapper.find('img[src="https://cdn.example.com/logos/douyin.png"]').exists()).toBe(true)
  })

  it('课程页面展示课程字段、价格和上线状态', async () => {
    const wrapper = mount(CourseListView, mountOptions(createPinia()))
    await flushPromises()

    for (const field of ['课程名称', '标签', '简介', '课程价格', '是否上架', '在线状态', 'ID', '状态', '创建时间', '更新时间']) {
      expect(wrapper.text()).toContain(field)
    }
    expect(wrapper.text()).toContain('¥199.00')
    expect(wrapper.text()).toContain('电影解说入门课')
    expect(wrapper.text()).toContain('已上线')
    expect(wrapper.text()).toContain('未上线')
    expect(wrapper.text()).not.toContain('已上架')
    expect(wrapper.text()).not.toContain('未上架')
  })

  it.each([
    ['视频', VideoListView, useVideoStore, '1 · 为什么这部电影能封神'],
    ['素材', MaterialListView, useMaterialStore, '1 · 电影海报素材包'],
    ['矩阵账号', MatrixAccountListView, useMatrixAccountStore, '1 · 抖音'],
    ['课程', CourseListView, useCourseStore, '1 · 电影解说入门课'],
  ] as const)('%s页面删除按钮调用对应 store.remove', async (_label, View, useStore, title) => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useStore()
    const remove = vi.spyOn(store, 'remove').mockResolvedValue(undefined)
    const wrapper = mount(View, mountOptions(pinia))
    await flushPromises()

    const button = wrapper.get('[data-testid="delete-action"]')
    expect(button.attributes('data-title')).toBe(title)
    expect(button.text()).toBe('删除')
    await button.trigger('click')
    await flushPromises()

    expect(remove).toHaveBeenCalledWith(1)
  })

  it('四个内容管理路由均可用', () => {
    const paths = createAppRouter(createPinia()).getRoutes().map((route) => route.path)

    expect(paths).toEqual(expect.arrayContaining([
      '/content/videos', '/content/materials', '/content/matrix-accounts', '/content/courses',
    ]))
  })
})
