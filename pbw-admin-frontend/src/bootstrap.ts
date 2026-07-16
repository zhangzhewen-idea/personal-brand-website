import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

export { router }
export const pinia = createPinia()

export function bootstrap(root: string | Element = '#app') {
  const app = createApp(App)

  app.use(router)
  app.use(pinia)
  app.use(ElementPlus)
  app.mount(root)

  return app
}
