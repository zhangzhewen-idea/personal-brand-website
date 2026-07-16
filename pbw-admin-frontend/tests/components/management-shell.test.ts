import { enableAutoUnmount, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DataTableCard from '@/components/common/DataTableCard.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { afterEach } from 'vitest'

enableAutoUnmount(afterEach)

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

  it('查询和重置按钮发出带类型的事件', async () => {
    const wrapper = mount(ListToolbar)

    await wrapper.get('.list-toolbar__actions .el-button--primary').trigger('click')
    await wrapper.get('.list-toolbar__actions .el-button:not(.el-button--primary)').trigger('click')

    expect(wrapper.emitted('search')).toHaveLength(1)
    expect(wrapper.emitted('reset')).toHaveLength(1)
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

  it('同时展示 loading 和空状态', () => {
    const wrapper = mount(DataTableCard, { props: { loading: true, empty: true } })

    expect(wrapper.find('.data-table-card__empty').exists()).toBe(true)
    expect(wrapper.find('.el-loading-mask').exists()).toBe(true)
  })

  it('展示图片缩略图并在加载失败时回退首字', async () => {
    const wrapper = mount(MediaThumbnail, { props: { src: '/missing.jpg', alt: '张三' } })

    await wrapper.get('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('张')
  })
})
