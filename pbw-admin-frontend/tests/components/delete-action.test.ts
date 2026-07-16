import { enableAutoUnmount, mount } from '@vue/test-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DeleteAction from '@/components/common/DeleteAction.vue'

enableAutoUnmount(afterEach)

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
    const title = '1 · 管理员（admin）'
    const wrapper = mount(DeleteAction, { props: { title, onDelete: vi.fn() } })

    await wrapper.get('button').trigger('click')

    expect(confirm).toHaveBeenCalledWith(expect.any(String), '确认删除', expect.any(Object))
    expect(confirm.mock.calls[0]?.[0]).toEqual(expect.stringContaining(title))
    expect(confirm.mock.calls[0]?.[0]).toEqual(expect.stringContaining('当前测试会话删除、刷新恢复'))
  })

  it('确认阶段连续点击只发起一次确认和删除', async () => {
    let resolveConfirm!: (value: 'confirm') => void
    const confirmPromise = new Promise<'confirm'>((resolve) => { resolveConfirm = resolve })
    vi.spyOn(ElMessageBox, 'confirm').mockReturnValue(confirmPromise as never)
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(DeleteAction, { props: { onDelete } })

    await Promise.all([wrapper.get('button').trigger('click'), wrapper.get('button').trigger('click')])
    expect(ElMessageBox.confirm).toHaveBeenCalledTimes(1)

    resolveConfirm('confirm')
    await vi.waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1))
  })

  it('外部 loading 时不发起确认', async () => {
    const confirm = vi.spyOn(ElMessageBox, 'confirm')
    const wrapper = mount(DeleteAction, { props: { loading: true, onDelete: vi.fn() } })

    await wrapper.get('button').trigger('click')

    expect(confirm).not.toHaveBeenCalled()
  })

  it('确认框发生非取消异常时提示确认失败', async () => {
    vi.spyOn(ElMessageBox, 'confirm').mockRejectedValue(new Error('dialog failed'))
    const error = vi.spyOn(ElMessage, 'error')
    const wrapper = mount(DeleteAction, { props: { onDelete: vi.fn() } })

    await wrapper.get('button').trigger('click')

    await vi.waitFor(() => expect(error).toHaveBeenCalledWith('删除确认失败，请稍后重试'))
  })
})
