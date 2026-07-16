import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import PageHeader from '@/components/common/PageHeader.vue'

describe('management shared components', () => {
  it('展示页面头部标题描述和操作区', () => {
    const wrapper = mount(PageHeader, {
      props: { title: '用户管理', description: '管理平台用户' },
      slots: { actions: '<button>新增用户</button>' },
    })

    expect(wrapper.text()).toContain('用户管理')
    expect(wrapper.text()).toContain('管理平台用户')
    expect(wrapper.text()).toContain('新增用户')
  })

  it('展示列表工具栏输入框和视觉操作按钮', () => {
    const wrapper = mount(ListToolbar, { props: { placeholder: '搜索用户' } })

    expect(wrapper.get('input').attributes('placeholder')).toBe('搜索用户')
    expect(wrapper.text()).toContain('状态')
    expect(wrapper.text()).toContain('查询')
    expect(wrapper.text()).toContain('重置')
  })

  it('展示表格内容、总数和分页视觉原型', () => {
    const wrapper = mount(DataTableCard, {
      props: { total: 12 },
      slots: { default: '<div data-testid="table-content">表格内容</div>' },
    })

    expect(wrapper.get('[data-testid="table-content"]').text()).toBe('表格内容')
    expect(wrapper.text()).toContain('共 12 条')
    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })

  it('展示图片缩略图并在加载失败时回退首字', async () => {
    const wrapper = mount(MediaThumbnail, { props: { src: '/missing.jpg', alt: '张三' } })

    await wrapper.get('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('张')
  })
})
