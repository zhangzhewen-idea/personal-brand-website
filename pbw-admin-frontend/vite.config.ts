import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { getEnvironmentConfig } from './environment.config'

export default defineConfig(({ mode }) => {
  const environment = getEnvironmentConfig(mode)

  return {
    plugins: [vue()],
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(environment.apiBaseUrl),
      'import.meta.env.VITE_APP_ENV': JSON.stringify(mode),
      'import.meta.env.VITE_BACKEND_PORT': JSON.stringify(String(environment.backendPort)),
    },
    server: {
      proxy: {
        '/uploads': { target: environment.backendTarget, changeOrigin: true },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
