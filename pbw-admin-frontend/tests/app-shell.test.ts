import { bootstrap, pinia, router } from '@/bootstrap'

describe('App', () => {
  it('真实 bootstrap 安装路由、状态和 Element Plus', () => {
    const root = document.createElement('div')
    document.body.append(root)
    const app = bootstrap(root)

    expect(app.config.globalProperties.$router).toBe(router)
    expect(app.config.globalProperties.$pinia).toBe(pinia)
    expect(app.component('ElButton')).toBeDefined()
    expect(root.querySelector('[data-testid="app-shell"]')).not.toBeNull()

    app.unmount()
    root.remove()
  })
})
