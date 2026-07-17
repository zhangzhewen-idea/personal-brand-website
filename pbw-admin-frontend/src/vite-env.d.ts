/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_ENV: 'dev' | 'prod'
  readonly VITE_BACKEND_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
