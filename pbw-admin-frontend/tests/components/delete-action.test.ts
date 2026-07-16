import { mount } from '@vue/test-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DeleteAction from '@/components/common/DeleteAction.vue'

describe('DeleteAction', () => {
  afterEach(() => vi.restoreAllMocks())

  it('确认后只调用一次删除回调并提示成功', async () => {
    vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue('confirm' as never)
    vi.spyOn(ElMessage, 'success')
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(DeleteAction, { props: { onDelete } })

    await wrapper.get('button').trigger('click')
    await vi.waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1))

    expect(onDelete).toHaveBeenCalledOnce()
    expect(ElMessage.success).toHaveBeenCalledWith('删除成功')
  })

  it('取消确认不调用删除回调', async () => {
    vi.spyOn(ElMessageBox, 'confirm').mockRejectedValue('cancel')
    const onDelete = vi.fn()
    const wrapper = mount(DeleteAction, { props: { onDelete } })

    await wrapper.get('button').trigger('click')
    await Promise.resolve()

    expect(onDelete).not.toHaveBeenCalled()
  })

  it('删除失败时提示错误且不提示成功', async () => {
    vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue('confirm' as never)
    vi.spyOn(ElMessage, 'error')
    vi.spyOn(ElMessage, 'success')
    const onDelete = vi.fn().mockRejectedValue(new Error('network failed'))
    const wrapper = mount(DeleteAction, { props: { onDelete } })

    await wrapper.get('button').trigger('click')
    await vi.waitFor(() => expect(ElMessage.error).toHaveBeenCalled())

    expect(ElMessage.error).toHaveBeenCalledWith('network failed')
    expect(ElMessage.success).not.toHaveBeenCalled()
  })

  it('确认提示包含测试会话说明', async () => {
    const confirm = vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue('confirm' as never)
    const wrapper = mount(DeleteAction, { props: { onDelete: vi.fn() } })

    await wrapper.get('button').trigger('click')

    expect(confirm).toHaveBeenCalledWith(
      expect.stringContaining('当前测试会话删除、刷新恢复'),
      expect.any(String),
      expect.any(Object),
    )
  })
})
