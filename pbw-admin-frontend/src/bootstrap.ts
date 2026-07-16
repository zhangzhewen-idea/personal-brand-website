import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { pinia } from './stores'

export { router }
export { pinia }

export function bootstrap(root: string | Element = '#app') {
  const app = createApp(App)

  app.use(router)
  app.use(pinia)
  app.mount(root)

  return app
}
