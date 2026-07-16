# pbw-web-frontend 用户端前端实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在 `pbw-web-frontend/` 中创建 Vue 3 用户端工程，使用 mock 数据一比一复刻 `ui-figma/` 的五类页面，并保留未来切换真实 API 的稳定分层边界。

**架构：** 页面和区块组件只消费 Pinia Store；Store 调用异步 Service；Service 当前读取驼峰 mock，未来可改为调用独立 `api/` 目录中的 axios 模块。数据库实体、展示配置和页面 ViewModel 分离，组件本地交互状态不进入 Pinia。

**技术栈：** Vue 3、TypeScript、Vue Router、Pinia、Tailwind CSS 4、axios、Vite、lucide-vue-next、Vitest、Vue Test Utils、vue-tsc。

**设计规格：** `docs/superpowers/specs/2026-07-16-pbw-web-frontend-design.md`

---

## 文件结构与职责

### 工程与测试基础

- 修改：`.gitignore`——追加前端依赖、构建、测试和 Vite 缓存忽略规则，保留现有 Java 规则。
- 创建：`pbw-web-frontend/package.json`——依赖与 npm 脚本。
- 创建：`pbw-web-frontend/index.html`——Vite 入口页面。
- 创建：`pbw-web-frontend/vite.config.ts`——Vue、Tailwind、路径别名和 Vitest 配置。
- 创建：`pbw-web-frontend/tsconfig.json`——TypeScript 项目引用。
- 创建：`pbw-web-frontend/tsconfig.app.json`——应用代码类型配置。
- 创建：`pbw-web-frontend/tsconfig.node.json`——Vite 配置类型配置。
- 创建：`pbw-web-frontend/src/env.d.ts`——Vite 类型声明。
- 创建：`pbw-web-frontend/src/main.ts`——应用启动、Router、Pinia 和全局样式。
- 创建：`pbw-web-frontend/src/App.vue`——顶层路由出口。
- 创建：`pbw-web-frontend/src/styles/index.css`——Tailwind 和全局基础样式。

### 数据、配置与状态

- 创建：`pbw-web-frontend/src/models/entities.ts`——五类内容实体与 `UserProfile`。
- 创建：`pbw-web-frontend/src/models/auth.ts`——登录、注册输入模型。
- 创建：`pbw-web-frontend/src/models/view-models.ts`——页面组合模型。
- 创建：`pbw-web-frontend/src/models/index.ts`——统一导出。
- 创建：`pbw-web-frontend/src/shared/formatters.ts`——统计数字和价格格式化。
- 创建：`pbw-web-frontend/src/mocks/content.mock.ts`——基本信息、视频、素材、矩阵账号、课程、用户资料 mock。
- 创建：`pbw-web-frontend/src/configs/home.config.ts`——首页海报、视频与素材展示配置。
- 创建：`pbw-web-frontend/src/configs/course.config.ts`——课程时长、课时、特色和配色。
- 创建：`pbw-web-frontend/src/configs/consulting.config.ts`——商业服务、合作流程和案例。
- 创建：`pbw-web-frontend/src/configs/about.config.ts`——成长里程碑。
- 创建：`pbw-web-frontend/src/services/site.service.ts`——站点内容异步查询和 ViewModel 组合。
- 创建：`pbw-web-frontend/src/services/course.service.ts`——课程异步查询和 ViewModel 组合。
- 创建：`pbw-web-frontend/src/stores/site.store.ts`——站点共享内容状态。
- 创建：`pbw-web-frontend/src/stores/course.store.ts`——课程状态。

### API 边界

- 创建：`pbw-web-frontend/src/api/http.ts`——axios 实例和错误标准化。
- 创建：`pbw-web-frontend/src/api/endpoints.ts`——接口路径常量。
- 创建：`pbw-web-frontend/src/api/modules/*.api.ts`——基本信息、视频、素材、矩阵账号、课程和用户请求模块。
- 创建：`pbw-web-frontend/src/api/mappers/content.mapper.ts`——API DTO 到页面模型的标准化入口。

### 公共组件、路由与页面

- 创建：`pbw-web-frontend/src/components/base/`——按钮、弹窗、页签和输入框。
- 创建：`pbw-web-frontend/src/components/shared/`——响应式图片、区块标题和统计项。
- 创建：`pbw-web-frontend/src/components/layout/`——公共导航、页脚和布局。
- 创建：`pbw-web-frontend/src/components/sections/home/`——首页四个区块。
- 创建：`pbw-web-frontend/src/components/sections/services/`——课程区块与卡片。
- 创建：`pbw-web-frontend/src/components/sections/consulting/`——商业服务、流程和案例。
- 创建：`pbw-web-frontend/src/components/sections/about/`——作者、数据、里程碑、幕后和联系区。
- 创建：`pbw-web-frontend/src/components/sections/auth/`——品牌面板和认证表单。
- 创建：`pbw-web-frontend/src/views/`——五个路由页面。
- 创建：`pbw-web-frontend/src/router/index.ts`——Vue Router 配置。

### 测试

- 创建：`pbw-web-frontend/tests/` 下对应模型、mock、Service、Store、基础组件、路由和页面测试。

---

### 任务 1：初始化 Vue、Tailwind 和测试工程

**文件：**
- 修改：`.gitignore`
- 创建：`pbw-web-frontend/package.json`
- 创建：`pbw-web-frontend/index.html`
- 创建：`pbw-web-frontend/vite.config.ts`
- 创建：`pbw-web-frontend/tsconfig.json`
- 创建：`pbw-web-frontend/tsconfig.app.json`
- 创建：`pbw-web-frontend/tsconfig.node.json`
- 创建：`pbw-web-frontend/src/env.d.ts`
- 创建：`pbw-web-frontend/src/main.ts`
- 创建：`pbw-web-frontend/src/App.vue`
- 创建：`pbw-web-frontend/src/styles/index.css`
- 测试：`pbw-web-frontend/tests/app-shell.test.ts`

- [ ] **步骤 1：追加前端忽略规则**

在根目录 `.gitignore` 末尾追加：

```gitignore

### Vue / Vite ###
**/node_modules/
**/dist/
**/.vite/
**/coverage/
*.log
.env
```

保留文件中已有的 Maven、IDE 和 Java 构建规则，不重写原内容。

- [ ] **步骤 2：创建 package.json 并安装依赖**

创建 `pbw-web-frontend/package.json`：

```json
{
  "name": "pbw-web-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "type-check": "vue-tsc -b",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

运行：

```bash
cd pbw-web-frontend
npm install vue@3 vue-router@4 pinia axios lucide-vue-next
npm install -D vite @vitejs/plugin-vue typescript vue-tsc @types/node tailwindcss@4 @tailwindcss/vite vitest @vue/test-utils jsdom
```

预期：生成 `package-lock.json`，命令退出码为 0；不要删除现有 `.vite/`，它会被新增忽略规则排除。

- [ ] **步骤 3：创建 Vite、TypeScript 和 HTML 配置**

创建 `pbw-web-frontend/index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="影像创作者个人品牌网站" />
    <title>影像创作者</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

创建 `pbw-web-frontend/vite.config.ts`：

```ts
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
})
```

创建 `pbw-web-frontend/tsconfig.json`：

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

创建 `pbw-web-frontend/tsconfig.app.json`：

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "tests/**/*.ts"]
}
```

创建 `pbw-web-frontend/tsconfig.node.json`：

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "types": ["node"],
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["vite.config.ts"]
}
```

创建 `pbw-web-frontend/src/env.d.ts`：

```ts
/// <reference types="vite/client" />
```

- [ ] **步骤 4：先编写失败的应用外壳测试**

创建 `pbw-web-frontend/tests/app-shell.test.ts`：

```ts
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  it('提供应用路由出口', () => {
    const wrapper = mount(App, {
      global: {
        stubs: { RouterView: { template: '<main data-testid="router-view" />' } },
      },
    })

    expect(wrapper.get('[data-testid="app-shell"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="router-view"]').exists()).toBe(true)
  })
})
```

- [ ] **步骤 5：运行测试确认失败**

运行：

```bash
npm test -- tests/app-shell.test.ts
```

预期：FAIL，提示无法解析 `@/App.vue` 或找不到 `data-testid="app-shell"`。

- [ ] **步骤 6：创建最小应用外壳与全局样式**

创建 `pbw-web-frontend/src/App.vue`：

```vue
<template>
  <div data-testid="app-shell">
    <RouterView />
  </div>
</template>
```

创建 `pbw-web-frontend/src/main.ts`：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/index.css'

createApp(App).use(createPinia()).use(router).mount('#app')
```

先创建 `pbw-web-frontend/src/router/index.ts` 的最小版本，后续任务再替换为完整路由：

```ts
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [],
})
```

创建 `pbw-web-frontend/src/styles/index.css`：

```css
@import "tailwindcss";

:root {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #111827;
  background: #ffffff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

html {
  min-width: 320px;
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

button,
a,
input {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}
```

- [ ] **步骤 7：运行基础验证**

运行：

```bash
npm test -- tests/app-shell.test.ts
npm run type-check
npm run build
```

预期：1 个测试通过；类型检查退出码 0；Vite 输出 `dist/` 且构建退出码 0。

- [ ] **步骤 8：提交工程基础**

```bash
git add .gitignore pbw-web-frontend
git diff --cached --check
git commit -m "chore: 初始化 Vue 用户端工程"
```

---

### 任务 2：定义数据库实体、认证输入与格式化规则

**文件：**
- 创建：`pbw-web-frontend/src/models/entities.ts`
- 创建：`pbw-web-frontend/src/models/auth.ts`
- 创建：`pbw-web-frontend/src/models/view-models.ts`
- 创建：`pbw-web-frontend/src/models/index.ts`
- 创建：`pbw-web-frontend/src/shared/formatters.ts`
- 测试：`pbw-web-frontend/tests/models/formatters.test.ts`

- [ ] **步骤 1：编写失败的格式化测试**

创建 `pbw-web-frontend/tests/models/formatters.test.ts`：

```ts
import { formatCount, formatPrice } from '@/shared/formatters'

describe('formatters', () => {
  it.each([
    [10_000_000, '1000万+'],
    [500_000, '50万+'],
    [20_000, '2万+'],
    [9_999, '9,999'],
  ])('将统计值 %s 格式化为 %s', (value, expected) => {
    expect(formatCount(value)).toBe(expected)
  })

  it.each([
    [0, '免费'],
    [49, '¥49'],
    [39.9, '¥39.90'],
  ])('将价格 %s 格式化为 %s', (value, expected) => {
    expect(formatPrice(value)).toBe(expected)
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：

```bash
npm test -- tests/models/formatters.test.ts
```

预期：FAIL，提示无法解析 `@/shared/formatters`。

- [ ] **步骤 3：实现实体与认证输入类型**

创建 `pbw-web-frontend/src/models/entities.ts`：

```ts
export type UserRole = '用户' | '管理员'

export interface AuditedEntity {
  id: number
  createTime: string
  updateTime: string
  isDeleted: boolean
}

export interface BasicInfo extends AuditedEntity {
  homeCoverVideo: string | null
  contactEmail: string | null
  contactQrCode: string | null
  totalPlayCount: number
  totalLikeCount: number
  totalFollowerCount: number
  authorIdentityTag: string | null
  slogan: string | null
  creationAttitude: string | null
  authorPhoto: string | null
  editingDeskWorkPhoto: string | null
  assetLibraryScreenshot: string | null
  dailyMovieWatchingPhoto: string | null
  annualTop10Films: string[]
  influentialThreeDirectors: string[]
  contactInfo: string | null
}

export interface Video extends AuditedEntity {
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
}

export interface MaterialLibraryItem extends AuditedEntity {
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  netdiskUrl: string | null
}

export interface MatrixAccount extends AuditedEntity {
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
}

export interface Course extends AuditedEntity {
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
}

export interface UserProfile extends AuditedEntity {
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: UserRole
}
```

创建 `pbw-web-frontend/src/models/auth.ts`：

```ts
export interface LoginPayload {
  account: string
  password: string
}

export interface RegisterPayload {
  nickname: string
  account: string
  email: string
  password: string
}

export interface RegisterForm extends RegisterPayload {
  confirmPassword: string
}
```

- [ ] **步骤 4：定义页面 ViewModel**

创建 `pbw-web-frontend/src/models/view-models.ts`：

```ts
import type { BasicInfo, Course, MaterialLibraryItem, MatrixAccount, Video } from './entities'

export type CardColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'black' | 'red'

export interface VideoCardViewModel extends Video {
  platform: string
  views: string
}

export interface MaterialCardViewModel extends MaterialLibraryItem {
  itemCount: number
  icon: 'scissors' | 'volume' | 'video' | 'gift'
  color: CardColor
}

export interface MatrixAccountViewModel extends MatrixAccount {
  displayName: string
  followers: string
  color: CardColor
}

export interface CourseCardViewModel extends Course {
  duration: string
  lessons: number
  features: string[]
  icon: 'video' | 'graduation' | 'palette' | 'trending'
  color: CardColor
}

export interface HomeContent {
  basicInfo: BasicInfo
  videos: VideoCardViewModel[]
  materials: MaterialCardViewModel[]
  matrixAccounts: MatrixAccountViewModel[]
}
```

创建 `pbw-web-frontend/src/models/index.ts`：

```ts
export * from './auth'
export * from './entities'
export * from './view-models'
```

- [ ] **步骤 5：实现格式化函数**

创建 `pbw-web-frontend/src/shared/formatters.ts`：

```ts
export function formatCount(value: number): string {
  if (value >= 10_000) {
    return `${Math.floor(value / 10_000)}万+`
  }
  return value.toLocaleString('zh-CN')
}

export function formatPrice(value: number): string {
  if (value === 0) return '免费'
  return Number.isInteger(value) ? `¥${value}` : `¥${value.toFixed(2)}`
}
```

- [ ] **步骤 6：运行测试和类型检查**

运行：

```bash
npm test -- tests/models/formatters.test.ts
npm run type-check
```

预期：格式化测试全部通过，类型检查退出码为 0。

- [ ] **步骤 7：提交数据模型**

```bash
git add pbw-web-frontend/src/models pbw-web-frontend/src/shared pbw-web-frontend/tests/models
git diff --cached --check
git commit -m "feat: 定义用户端数据模型"
```

---

### 任务 3：创建驼峰 mock 数据并验证密码安全边界

**文件：**
- 创建：`pbw-web-frontend/src/mocks/content.mock.ts`
- 测试：`pbw-web-frontend/tests/mocks/content.mock.test.ts`

- [ ] **步骤 1：编写失败的 mock 契约测试**

创建 `pbw-web-frontend/tests/mocks/content.mock.test.ts`：

```ts
import { basicInfoMock, courseMocks, materialMocks, matrixAccountMocks, userProfileMocks, videoMocks } from '@/mocks/content.mock'

function collectKeys(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectKeys)
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => [key, ...collectKeys(child)])
  }
  return []
}

describe('content mocks', () => {
  it('所有对象字段均为驼峰命名', () => {
    const keys = collectKeys({ basicInfoMock, videoMocks, materialMocks, matrixAccountMocks, courseMocks, userProfileMocks })
    expect(keys.filter((key) => key.includes('_'))).toEqual([])
  })

  it('用户资料不包含密码字段', () => {
    expect(userProfileMocks.every((user) => !Object.hasOwn(user, 'password'))).toBe(true)
  })

  it('数组和布尔字段已转换为前端类型', () => {
    expect(Array.isArray(basicInfoMock.annualTop10Films)).toBe(true)
    expect(Array.isArray(basicInfoMock.influentialThreeDirectors)).toBe(true)
    expect(courseMocks.every((course) => typeof course.isOnline === 'boolean')).toBe(true)
    expect(videoMocks.every((video) => typeof video.isDeleted === 'boolean')).toBe(true)
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：

```bash
npm test -- tests/mocks/content.mock.test.ts
```

预期：FAIL，提示无法解析 `@/mocks/content.mock`。

- [ ] **步骤 3：创建基本信息、视频和素材 mock**

创建 `pbw-web-frontend/src/mocks/content.mock.ts`，先写入完整导入与公共审计字段：

```ts
import type { BasicInfo, Course, MaterialLibraryItem, MatrixAccount, UserProfile, Video } from '@/models'

const createTime = '2026-07-16T12:00:00+08:00'
const updateTime = '2026-07-16T12:00:00+08:00'

export const basicInfoMock: BasicInfo = {
  id: 1,
  homeCoverVideo: 'https://cdn.example.com/videos/home-cover-1.mp4',
  contactEmail: 'business@example.com',
  contactQrCode: 'https://cdn.example.com/qrcode/contact-qr-1.png',
  totalPlayCount: 10_000_000,
  totalLikeCount: 500_000,
  totalFollowerCount: 200_000,
  authorIdentityTag: '剪辑创作者 · 抖音精选作者',
  slogan: '用剪辑重构影像记忆，让每帧都有情绪力量',
  creationAttitude: '对叙事节奏的极致追求，对经典作品的敬畏与创新，用心打磨每一个作品，传递影像的力量。',
  authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  editingDeskWorkPhoto: 'https://images.unsplash.com/photo-1575320854760-bfffc3550640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  assetLibraryScreenshot: 'https://images.unsplash.com/photo-1709316131422-35a5fb1e9eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  dailyMovieWatchingPhoto: 'https://images.unsplash.com/photo-1723396612574-961649793bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  annualTop10Films: [
    '《肖申克的救赎》- 叙事的力量',
    '《盗梦空间》- 时间与剪辑',
    '《布达佩斯大饭店》- 对称美学',
    '《寄生虫》- 社会隐喻',
    '《爆裂鼓手》- 节奏张力',
    '《鸟人》- 长镜头魅力',
  ],
  influentialThreeDirectors: [
    '克里斯托弗·诺兰 - 时间叙事大师',
    '韦斯·安德森 - 视觉风格化',
    '大卫·芬奇 - 精准控制节奏',
  ],
  contactInfo: '微信：brandstudio01',
  createTime,
  updateTime,
  isDeleted: false,
}

export const videoMocks: Video[] = [
  {
    id: 1,
    videoTitle: '《时光碎片》- 影视混剪',
    videoIntro: '用经典电影片段重构时间的记忆，探索蒙太奇的叙事魅力',
    videoUrl: 'https://cdn.example.com/videos/video-1.mp4',
    videoCover: 'https://images.unsplash.com/photo-1709316131422-35a5fb1e9eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    createTime,
    updateTime,
    isDeleted: false,
  },
  {
    id: 2,
    videoTitle: '《节奏大师》- 音乐混剪',
    videoIntro: '将音乐节奏与画面完美融合，打造视听双重冲击',
    videoUrl: 'https://cdn.example.com/videos/video-2.mp4',
    videoCover: 'https://images.unsplash.com/photo-1723396612574-961649793bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    createTime,
    updateTime,
    isDeleted: false,
  },
  {
    id: 3,
    videoTitle: '《情绪流转》- 情感叙事',
    videoIntro: '通过色彩与节奏的变化，讲述情感的起伏变化',
    videoUrl: 'https://cdn.example.com/videos/video-3.mp4',
    videoCover: 'https://images.unsplash.com/photo-1695408246958-5e557ba72ab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    createTime,
    updateTime,
    isDeleted: false,
  },
  {
    id: 4,
    videoTitle: '《城市脉搏》- 延时摄影混剪',
    videoIntro: '捕捉城市的昼夜更替，感受时间的流动之美',
    videoUrl: 'https://cdn.example.com/videos/video-4.mp4',
    videoCover: 'https://images.unsplash.com/photo-1693159682618-074078ed271e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    createTime,
    updateTime,
    isDeleted: false,
  },
]

export const materialMocks: MaterialLibraryItem[] = [
  { id: 1, materialTitle: '转场素材', materialPhoto: null, materialIntro: '150+ 精选转场效果，涵盖各种风格', price: 49, netdiskUrl: 'https://pan.example.com/s/transition', createTime, updateTime, isDeleted: false },
  { id: 2, materialTitle: '音效素材', materialPhoto: null, materialIntro: '300+ 高质量音效，提升作品质感', price: 39, netdiskUrl: 'https://pan.example.com/s/audio', createTime, updateTime, isDeleted: false },
  { id: 3, materialTitle: '视频练习', materialPhoto: null, materialIntro: '20+ 实战项目素材，边学边练', price: 99, netdiskUrl: 'https://pan.example.com/s/practice', createTime, updateTime, isDeleted: false },
  { id: 4, materialTitle: '粉丝福利', materialPhoto: null, materialIntro: '免费素材整合包，持续更新', price: 0, netdiskUrl: 'https://pan.example.com/s/free', createTime, updateTime, isDeleted: false },
]
```

- [ ] **步骤 4：补全矩阵账号、课程和用户资料 mock**

在同一文件末尾追加：

```ts
export const matrixAccountMocks: MatrixAccount[] = [
  { id: 1, platformName: '抖音', platformLogo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=100&fit=crop', accountUrl: 'https://douyin.com', intro: '主阵地账号，更新电影解说和剪辑技巧内容。', createTime, updateTime, isDeleted: false },
  { id: 2, platformName: 'B站', platformLogo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop', accountUrl: 'https://bilibili.com', intro: '偏长内容与系列化专题，适合深度解析。', createTime, updateTime, isDeleted: false },
  { id: 3, platformName: '小红书', platformLogo: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100&h=100&fit=crop', accountUrl: 'https://xiaohongshu.com', intro: '偏图文和短视频种草，展示幕后和素材整理。', createTime, updateTime, isDeleted: false },
  { id: 4, platformName: '视频号', platformLogo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop', accountUrl: 'https://weixin.qq.com', intro: '同步发布短视频作品。', createTime, updateTime, isDeleted: false },
]

export const courseMocks: Course[] = [
  { id: 1, courseName: '剪辑入门实战营', courseTag: '入门级', courseIntro: '从零开始，系统学习视频剪辑的核心技能', coursePrice: 699, isOnline: true, createTime, updateTime, isDeleted: false },
  { id: 2, courseName: '叙事节奏进阶课', courseTag: '进阶级', courseIntro: '深入学习影视叙事语言，掌握高级剪辑技巧', coursePrice: 1299, isOnline: true, createTime, updateTime, isDeleted: false },
  { id: 3, courseName: '调色进阶课', courseTag: '进阶级', courseIntro: '掌握专业调色技巧，打造电影级画面质感', coursePrice: 899, isOnline: false, createTime, updateTime, isDeleted: false },
  { id: 4, courseName: '短视频策划课', courseTag: '实战级', courseIntro: '学习短视频策划与运营，打造爆款内容', coursePrice: 999, isOnline: false, createTime, updateTime, isDeleted: false },
]

export const userProfileMocks: UserProfile[] = [
  { id: 1, nickname: '管理员', account: 'admin', email: 'admin@example.com', avatar: 'https://cdn.example.com/avatars/admin.jpg', role: '管理员', createTime, updateTime, isDeleted: false },
  { id: 2, nickname: 'movie_fan', account: 'movie_fan', email: 'moviefan@example.com', avatar: 'https://cdn.example.com/avatars/user-1.jpg', role: '用户', createTime, updateTime, isDeleted: false },
]
```

- [ ] **步骤 5：运行 mock 契约测试和类型检查**

运行：

```bash
npm test -- tests/mocks/content.mock.test.ts
npm run type-check
```

预期：3 个测试通过；类型检查退出码为 0。

- [ ] **步骤 6：提交 mock 数据**

```bash
git add pbw-web-frontend/src/mocks pbw-web-frontend/tests/mocks
git diff --cached --check
git commit -m "feat: 添加用户端驼峰 mock 数据"
```

---

### 任务 4：创建展示配置与页面组合规则

**文件：**
- 创建：`pbw-web-frontend/src/configs/home.config.ts`
- 创建：`pbw-web-frontend/src/configs/course.config.ts`
- 创建：`pbw-web-frontend/src/configs/consulting.config.ts`
- 创建：`pbw-web-frontend/src/configs/about.config.ts`
- 测试：`pbw-web-frontend/tests/configs/presentation-config.test.ts`

- [ ] **步骤 1：编写失败的配置完整性测试**

创建 `pbw-web-frontend/tests/configs/presentation-config.test.ts`：

```ts
import { milestones } from '@/configs/about.config'
import { coursePresentation } from '@/configs/course.config'
import { consultingServices, cooperationWorkflow } from '@/configs/consulting.config'
import { homeHeroPoster, materialPresentation, matrixPresentation, videoPresentation } from '@/configs/home.config'

describe('presentation configs', () => {
  it('首页配置覆盖四条内容数据', () => {
    expect(homeHeroPoster).toMatch(/^https:\/\//)
    expect(Object.keys(videoPresentation)).toHaveLength(4)
    expect(Object.keys(materialPresentation)).toHaveLength(4)
    expect(Object.keys(matrixPresentation)).toHaveLength(4)
  })

  it('课程和商业咨询配置完整', () => {
    expect(Object.keys(coursePresentation)).toHaveLength(4)
    expect(consultingServices).toHaveLength(4)
    expect(cooperationWorkflow.map((item) => item.step)).toEqual([1, 2, 3, 4])
  })

  it('关于页包含四个成长里程碑', () => {
    expect(milestones).toHaveLength(4)
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

运行：

```bash
npm test -- tests/configs/presentation-config.test.ts
```

预期：FAIL，提示无法解析配置模块。

- [ ] **步骤 3：创建首页和课程展示配置**

创建 `pbw-web-frontend/src/configs/home.config.ts`：

```ts
import type { CardColor } from '@/models'

export const homeHeroPoster = 'https://images.unsplash.com/photo-1575320854760-bfffc3550640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080'

export const videoPresentation: Record<number, { platform: string; views: string }> = {
  1: { platform: '抖音', views: '180万' },
  2: { platform: 'B站', views: '95万' },
  3: { platform: '小红书', views: '62万' },
  4: { platform: '抖音', views: '210万' },
}

export const materialPresentation: Record<number, { itemCount: number; icon: 'scissors' | 'volume' | 'video' | 'gift'; color: CardColor }> = {
  1: { itemCount: 150, icon: 'scissors', color: 'blue' },
  2: { itemCount: 300, icon: 'volume', color: 'purple' },
  3: { itemCount: 20, icon: 'video', color: 'green' },
  4: { itemCount: 100, icon: 'gift', color: 'orange' },
}

export const matrixPresentation: Record<number, { displayName: string; followers: string; color: CardColor }> = {
  1: { displayName: '影像创作者', followers: '15万', color: 'black' },
  2: { displayName: '影像创作者', followers: '8万', color: 'pink' },
  3: { displayName: '影像创作者', followers: '5万', color: 'red' },
  4: { displayName: '影像创作者', followers: '3万', color: 'green' },
}
```

创建 `pbw-web-frontend/src/configs/course.config.ts`：

```ts
import type { CardColor } from '@/models'

export const coursePresentation: Record<number, { duration: string; lessons: number; features: string[]; icon: 'video' | 'graduation' | 'palette' | 'trending'; color: CardColor }> = {
  1: { duration: '8周', lessons: 32, icon: 'video', color: 'blue', features: ['Pr/Ae/Final Cut Pro 软件操作', '素材管理与整理逻辑', '基础转场与字幕设计', '音效与配乐选择技巧', '实战项目练习'] },
  2: { duration: '10周', lessons: 40, icon: 'graduation', color: 'purple', features: ['蒙太奇思维与应用', '音效与画面的情绪配合', '影视混剪的「故事重构法」', '节奏控制与张力营造', '经典作品分析解构'] },
  3: { duration: '6周', lessons: 24, icon: 'palette', color: 'pink', features: ['色彩理论与情绪表达', 'DaVinci Resolve 调色流程', 'LUT 应用与风格化调色', '肤色校正与环境氛围', '不同场景调色实战'] },
  4: { duration: '8周', lessons: 32, icon: 'trending', color: 'green', features: ['短视频内容策划方法论', '爆款视频底层逻辑', '平台算法与推荐机制', '数据分析与优化迭代', '账号定位与IP打造'] },
}
```

- [ ] **步骤 4：创建商业咨询和关于页配置**

创建 `pbw-web-frontend/src/configs/consulting.config.ts`：

```ts
import type { CardColor } from '@/models'

export interface ConsultingService {
  id: number
  title: string
  description: string
  icon: 'video' | 'sparkles' | 'camera' | 'award'
  features: string[]
  price: string
  duration: string
  color: CardColor
}

export const consultingServices: ConsultingService[] = [
  { id: 1, title: '宣传片剪辑', description: '企业形象片、品牌宣传片专业剪辑制作，提升品牌形象', icon: 'video', features: ['专业剪辑团队', '快速交付', '不限修改次数', '提供源文件'], price: '¥2000起', duration: '3-5个工作日', color: 'blue' },
  { id: 2, title: '产品短视频', description: '电商产品展示视频、种草视频，提升转化率', icon: 'sparkles', features: ['创意策划', '精美包装', '适配多平台', '提升转化'], price: '¥800起', duration: '2-3个工作日', color: 'purple' },
  { id: 3, title: '活动记录快剪', description: '会议、活动现场快速剪辑，当天交付精彩瞬间', icon: 'camera', features: ['快速响应', '当天交付', '多机位剪辑', '精彩集锦'], price: '¥1500起', duration: '1-2个工作日', color: 'green' },
  { id: 4, title: '年会视频制作', description: '年会开场视频、年度回顾视频，打造震撼效果', icon: 'award', features: ['创意策划', '特效制作', '配音配乐', '现场播放支持'], price: '¥3000起', duration: '5-7个工作日', color: 'orange' },
]

export const cooperationWorkflow = [
  { step: 1, title: '联系咨询', description: '扫码添加微信，说明需求' },
  { step: 2, title: '需求沟通', description: '详细了解项目需求与预算' },
  { step: 3, title: '方案确认', description: '提供方案与报价，确认合作' },
  { step: 4, title: '制作交付', description: '按时交付成品，支持修改' },
]

export const caseStudies = [1, 2, 3].map((id) => ({
  id,
  title: `客户案例 ${id}`,
  description: '为知名品牌提供专业视频制作服务，获得客户高度认可',
}))
```

创建 `pbw-web-frontend/src/configs/about.config.ts`：

```ts
export const milestones = [
  { year: 2020, title: '开始剪辑创作', description: '第一条爆款视频播放破100万，正式踏上创作之路' },
  { year: 2022, title: '粉丝突破10万', description: '成为抖音独家创作者，获得平台流量扶持' },
  { year: 2024, title: '入选精选计划', description: '入选抖音精选创作者计划，单条作品播放破500万' },
  { year: 2026, title: '全网20万粉丝', description: '全网粉丝突破20万，开启商业化运营新阶段' },
]
```

- [ ] **步骤 5：运行配置测试和类型检查**

```bash
npm test -- tests/configs/presentation-config.test.ts
npm run type-check
```

预期：3 个测试通过；类型检查退出码为 0。

- [ ] **步骤 6：提交展示配置**

```bash
git add pbw-web-frontend/src/configs pbw-web-frontend/tests/configs
git diff --cached --check
git commit -m "feat: 添加页面展示配置"
```

---


### 任务 5：实现异步 Service 与 ViewModel 组合

**文件：**
- 创建：`pbw-web-frontend/src/services/site.service.ts`
- 创建：`pbw-web-frontend/src/services/course.service.ts`
- 测试：`pbw-web-frontend/tests/services/content-services.test.ts`

- [ ] **步骤 1：编写失败的 Service 测试**

创建 `pbw-web-frontend/tests/services/content-services.test.ts`：

```ts
import { courseService } from '@/services/course.service'
import { siteService } from '@/services/site.service'

describe('content services', () => {
  it('异步组合首页实体与展示配置', async () => {
    const content = await siteService.getHomeContent()

    expect(content.basicInfo.slogan).toContain('用剪辑重构影像记忆')
    expect(content.videos).toHaveLength(4)
    expect(content.videos[0]).toMatchObject({ platform: '抖音', views: '180万' })
    expect(content.materials[3]).toMatchObject({ price: 0, itemCount: 100 })
    expect(content.matrixAccounts[1]).toMatchObject({ platformName: 'B站', followers: '8万' })
  })

  it('异步组合课程实体与展示配置', async () => {
    const courses = await courseService.getCourses()

    expect(courses).toHaveLength(4)
    expect(courses[0]).toMatchObject({ duration: '8周', lessons: 32, isOnline: true })
    expect(courses[2].isOnline).toBe(false)
  })

  it('每次返回独立数据副本', async () => {
    const first = await siteService.getHomeContent()
    const second = await siteService.getHomeContent()
    first.videos[0].videoTitle = '被修改'

    expect(second.videos[0].videoTitle).toBe('《时光碎片》- 影视混剪')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/services/content-services.test.ts
```

预期：FAIL，提示无法解析 Service 模块。

- [ ] **步骤 3：实现站点内容 Service**

创建 `pbw-web-frontend/src/services/site.service.ts`：

```ts
import { materialPresentation, matrixPresentation, videoPresentation } from '@/configs/home.config'
import { basicInfoMock, materialMocks, matrixAccountMocks, videoMocks } from '@/mocks/content.mock'
import type { HomeContent, MaterialCardViewModel, MatrixAccountViewModel, VideoCardViewModel } from '@/models'

function requireConfig<T>(record: Record<number, T>, id: number, label: string): T {
  const config = record[id]
  if (!config) throw new Error(`${label} ${id} 缺少展示配置`)
  return config
}

function buildVideos(): VideoCardViewModel[] {
  return videoMocks
    .filter((video) => !video.isDeleted)
    .map((video) => ({ ...video, ...requireConfig(videoPresentation, video.id, '视频') }))
}

function buildMaterials(): MaterialCardViewModel[] {
  return materialMocks
    .filter((material) => !material.isDeleted)
    .map((material) => ({ ...material, ...requireConfig(materialPresentation, material.id, '素材') }))
}

function buildMatrixAccounts(): MatrixAccountViewModel[] {
  return matrixAccountMocks
    .filter((account) => !account.isDeleted)
    .map((account) => ({ ...account, ...requireConfig(matrixPresentation, account.id, '矩阵账号') }))
}

export const siteService = {
  async getHomeContent(): Promise<HomeContent> {
    return structuredClone({
      basicInfo: basicInfoMock,
      videos: buildVideos(),
      materials: buildMaterials(),
      matrixAccounts: buildMatrixAccounts(),
    })
  },
}
```

- [ ] **步骤 4：实现课程 Service**

创建 `pbw-web-frontend/src/services/course.service.ts`：

```ts
import { coursePresentation } from '@/configs/course.config'
import { courseMocks } from '@/mocks/content.mock'
import type { CourseCardViewModel } from '@/models'

export const courseService = {
  async getCourses(): Promise<CourseCardViewModel[]> {
    const courses = courseMocks
      .filter((course) => !course.isDeleted)
      .map((course) => {
        const presentation = coursePresentation[course.id]
        if (!presentation) throw new Error(`课程 ${course.id} 缺少展示配置`)
        return { ...course, ...presentation }
      })

    return structuredClone(courses)
  },
}
```

- [ ] **步骤 5：运行 Service 测试和类型检查**

```bash
npm test -- tests/services/content-services.test.ts
npm run type-check
```

预期：3 个测试通过；类型检查退出码为 0。

- [ ] **步骤 6：提交 Service**

```bash
git add pbw-web-frontend/src/services pbw-web-frontend/tests/services
git diff --cached --check
git commit -m "feat: 实现用户端内容服务"
```

---

### 任务 6：实现 Pinia 共享状态与加载状态机

**文件：**
- 创建：`pbw-web-frontend/src/stores/site.store.ts`
- 创建：`pbw-web-frontend/src/stores/course.store.ts`
- 测试：`pbw-web-frontend/tests/stores/content-stores.test.ts`

- [ ] **步骤 1：编写失败的 Store 测试**

创建 `pbw-web-frontend/tests/stores/content-stores.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { vi } from 'vitest'
import { courseService } from '@/services/course.service'
import { siteService } from '@/services/site.service'
import { useCourseStore } from '@/stores/course.store'
import { useSiteStore } from '@/stores/site.store'

describe('content stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('加载站点内容并进入 success', async () => {
    const store = useSiteStore()
    const request = store.load()
    expect(store.status).toBe('loading')
    await request

    expect(store.status).toBe('success')
    expect(store.basicInfo?.totalPlayCount).toBe(10_000_000)
    expect(store.videos).toHaveLength(4)
  })

  it('站点内容失败时保存可读错误', async () => {
    vi.spyOn(siteService, 'getHomeContent').mockRejectedValueOnce(new Error('内容加载失败'))
    const store = useSiteStore()
    await store.load()

    expect(store.status).toBe('error')
    expect(store.errorMessage).toBe('内容加载失败')
  })

  it('成功后重复调用不会再次读取站点内容', async () => {
    const getter = vi.spyOn(siteService, 'getHomeContent')
    const store = useSiteStore()
    await store.load()
    await store.load()

    expect(getter).toHaveBeenCalledTimes(1)
  })

  it('加载课程并过滤逻辑删除数据', async () => {
    const store = useCourseStore()
    await store.load()

    expect(store.status).toBe('success')
    expect(store.courses).toHaveLength(4)
    expect(courseService.getCourses).toBeTypeOf('function')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/stores/content-stores.test.ts
```

预期：FAIL，提示无法解析 Store 模块。

- [ ] **步骤 3：实现 siteStore**

创建 `pbw-web-frontend/src/stores/site.store.ts`：

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BasicInfo, MaterialCardViewModel, MatrixAccountViewModel, VideoCardViewModel } from '@/models'
import { siteService } from '@/services/site.service'

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export const useSiteStore = defineStore('site', () => {
  const basicInfo = ref<BasicInfo | null>(null)
  const videos = ref<VideoCardViewModel[]>([])
  const materials = ref<MaterialCardViewModel[]>([])
  const matrixAccounts = ref<MatrixAccountViewModel[]>([])
  const status = ref<LoadStatus>('idle')
  const errorMessage = ref('')

  async function load(): Promise<void> {
    if (status.value === 'loading' || status.value === 'success') return
    status.value = 'loading'
    errorMessage.value = ''
    try {
      const content = await siteService.getHomeContent()
      basicInfo.value = content.basicInfo
      videos.value = content.videos
      materials.value = content.materials
      matrixAccounts.value = content.matrixAccounts
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : '站点内容加载失败'
    }
  }

  return { basicInfo, videos, materials, matrixAccounts, status, errorMessage, load }
})
```

- [ ] **步骤 4：实现 courseStore**

创建 `pbw-web-frontend/src/stores/course.store.ts`：

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CourseCardViewModel } from '@/models'
import { courseService } from '@/services/course.service'
import type { LoadStatus } from './site.store'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<CourseCardViewModel[]>([])
  const status = ref<LoadStatus>('idle')
  const errorMessage = ref('')

  async function load(): Promise<void> {
    if (status.value === 'loading' || status.value === 'success') return
    status.value = 'loading'
    errorMessage.value = ''
    try {
      courses.value = await courseService.getCourses()
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : '课程加载失败'
    }
  }

  return { courses, status, errorMessage, load }
})
```

- [ ] **步骤 5：运行 Store 测试和全量测试**

```bash
npm test -- tests/stores/content-stores.test.ts
npm test
npm run type-check
```

预期：Store 测试 4 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 6：提交 Store**

```bash
git add pbw-web-frontend/src/stores pbw-web-frontend/tests/stores
git diff --cached --check
git commit -m "feat: 添加用户端 Pinia 状态"
```

---

### 任务 7：建立独立 axios API 层

**文件：**
- 创建：`pbw-web-frontend/src/api/http.ts`
- 创建：`pbw-web-frontend/src/api/endpoints.ts`
- 创建：`pbw-web-frontend/src/api/mappers/content.mapper.ts`
- 创建：`pbw-web-frontend/src/api/modules/basic-info.api.ts`
- 创建：`pbw-web-frontend/src/api/modules/video.api.ts`
- 创建：`pbw-web-frontend/src/api/modules/material-library.api.ts`
- 创建：`pbw-web-frontend/src/api/modules/matrix-account.api.ts`
- 创建：`pbw-web-frontend/src/api/modules/course.api.ts`
- 创建：`pbw-web-frontend/src/api/modules/user.api.ts`
- 测试：`pbw-web-frontend/tests/api/api-contract.test.ts`

- [ ] **步骤 1：编写失败的 API 边界测试**

创建 `pbw-web-frontend/tests/api/api-contract.test.ts`：

```ts
import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import { mapBasicInfoDto } from '@/api/mappers/content.mapper'
import { basicInfoMock } from '@/mocks/content.mock'

describe('api boundary', () => {
  it('axios 实例使用统一前缀和超时', () => {
    expect(http.defaults.baseURL).toBe('/api')
    expect(http.defaults.timeout).toBe(10_000)
  })

  it('接口路径按业务域集中定义', () => {
    expect(endpoints).toEqual({
      basicInfo: '/basic-info',
      videos: '/videos',
      materials: '/materials',
      matrixAccounts: '/matrix-accounts',
      courses: '/courses',
      currentUser: '/users/me',
      login: '/auth/login',
      register: '/auth/register',
    })
  })

  it('mapper 返回数组字段的独立副本', () => {
    const mapped = mapBasicInfoDto(basicInfoMock)
    expect(mapped).not.toBe(basicInfoMock)
    expect(mapped.annualTop10Films).not.toBe(basicInfoMock.annualTop10Films)
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/api/api-contract.test.ts
```

预期：FAIL，提示无法解析 `@/api` 下的模块。

- [ ] **步骤 3：实现 axios 实例、错误和接口常量**

创建 `pbw-web-frontend/src/api/endpoints.ts`：

```ts
export const endpoints = {
  basicInfo: '/basic-info',
  videos: '/videos',
  materials: '/materials',
  matrixAccounts: '/matrix-accounts',
  courses: '/courses',
  currentUser: '/users/me',
  login: '/auth/login',
  register: '/auth/register',
} as const
```

创建 `pbw-web-frontend/src/api/http.ts`：

```ts
import axios, { AxiosError } from 'axios'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const http = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message ?? '请求失败'
    return Promise.reject(new ApiError(message, error.response?.status ?? null))
  },
)

export default http
```

- [ ] **步骤 4：实现 mapper 与内容请求模块**

创建 `pbw-web-frontend/src/api/mappers/content.mapper.ts`：

```ts
import type { BasicInfo } from '@/models'

export function mapBasicInfoDto(dto: BasicInfo): BasicInfo {
  return {
    ...dto,
    annualTop10Films: [...dto.annualTop10Films],
    influentialThreeDirectors: [...dto.influentialThreeDirectors],
  }
}
```

创建以下请求模块：

```ts
// src/api/modules/basic-info.api.ts
import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import { mapBasicInfoDto } from '@/api/mappers/content.mapper'
import type { BasicInfo } from '@/models'

export async function getBasicInfo(): Promise<BasicInfo> {
  const { data } = await http.get<BasicInfo>(endpoints.basicInfo)
  return mapBasicInfoDto(data)
}
```

```ts
// src/api/modules/video.api.ts
import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { Video } from '@/models'

export async function getVideos(): Promise<Video[]> {
  const { data } = await http.get<Video[]>(endpoints.videos)
  return data
}
```

```ts
// src/api/modules/material-library.api.ts
import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { MaterialLibraryItem } from '@/models'

export async function getMaterials(): Promise<MaterialLibraryItem[]> {
  const { data } = await http.get<MaterialLibraryItem[]>(endpoints.materials)
  return data
}
```

```ts
// src/api/modules/matrix-account.api.ts
import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { MatrixAccount } from '@/models'

export async function getMatrixAccounts(): Promise<MatrixAccount[]> {
  const { data } = await http.get<MatrixAccount[]>(endpoints.matrixAccounts)
  return data
}
```

```ts
// src/api/modules/course.api.ts
import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { Course } from '@/models'

export async function getCourses(): Promise<Course[]> {
  const { data } = await http.get<Course[]>(endpoints.courses)
  return data
}
```

- [ ] **步骤 5：实现用户与认证请求模块**

创建 `pbw-web-frontend/src/api/modules/user.api.ts`：

```ts
import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { LoginPayload, RegisterPayload, UserProfile } from '@/models'

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await http.get<UserProfile>(endpoints.currentUser)
  return data
}

export async function login(payload: LoginPayload): Promise<UserProfile> {
  const { data } = await http.post<UserProfile>(endpoints.login, payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<UserProfile> {
  const { data } = await http.post<UserProfile>(endpoints.register, payload)
  return data
}
```

这些函数本阶段不由 Store 或组件调用，不会发出真实请求。

- [ ] **步骤 6：运行 API 测试和类型检查**

```bash
npm test -- tests/api/api-contract.test.ts
npm run type-check
```

预期：3 个测试通过；类型检查退出码为 0。

- [ ] **步骤 7：提交 API 层**

```bash
git add pbw-web-frontend/src/api pbw-web-frontend/tests/api
git diff --cached --check
git commit -m "feat: 建立独立前端 API 层"
```

---

### 任务 8：实现基础 UI 与共享展示组件

**文件：**
- 创建：`pbw-web-frontend/src/components/base/BaseButton.vue`
- 创建：`pbw-web-frontend/src/components/base/BaseDialog.vue`
- 创建：`pbw-web-frontend/src/components/base/BaseTabs.vue`
- 创建：`pbw-web-frontend/src/components/base/BaseInput.vue`
- 创建：`pbw-web-frontend/src/components/shared/ResponsiveImage.vue`
- 创建：`pbw-web-frontend/src/components/shared/SectionHeading.vue`
- 创建：`pbw-web-frontend/src/components/shared/StatItem.vue`
- 测试：`pbw-web-frontend/tests/components/base-components.test.ts`

- [ ] **步骤 1：编写失败的基础组件测试**

创建 `pbw-web-frontend/tests/components/base-components.test.ts`：

```ts
import { mount } from '@vue/test-utils'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseTabs from '@/components/base/BaseTabs.vue'

describe('base components', () => {
  it('弹窗按 modelValue 展示并发出关闭事件', async () => {
    const wrapper = mount(BaseDialog, {
      props: { modelValue: true, title: '测试弹窗' },
      slots: { default: '弹窗正文' },
      attachTo: document.body,
      global: { stubs: { Teleport: true } },
    })

    expect(document.body.textContent).toContain('测试弹窗')
    await wrapper.get('[data-testid="dialog-close"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
  })

  it('页签点击后发出新的值', async () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'login',
        tabs: [
          { value: 'login', label: '登录' },
          { value: 'register', label: '注册' },
        ],
      },
    })

    await wrapper.get('[data-tab="register"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['register']])
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/components/base-components.test.ts
```

预期：FAIL，提示无法解析基础组件。

- [ ] **步骤 3：实现按钮、弹窗和页签**

创建 `pbw-web-frontend/src/components/base/BaseButton.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
}>(), { variant: 'primary', size: 'md', type: 'button', disabled: false })

const classes = computed(() => ({
  primary: 'bg-[#030213] text-white hover:bg-[#17152c]',
  secondary: 'bg-white text-gray-900 hover:bg-gray-100',
  outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  ghost: 'bg-transparent text-current hover:bg-black/5',
}[props.variant]))

const sizes = computed(() => ({
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
}[props.size]))
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50"
    :class="[classes, sizes]"
  >
    <slot />
  </button>
</template>
```

创建 `pbw-web-frontend/src/components/base/BaseDialog.vue`：

```vue
<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{ modelValue: boolean; title: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close(): void {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent): void {
  if (props.modelValue && event.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" :aria-label="title">
      <button class="absolute inset-0 bg-black/60" aria-label="关闭弹窗" @click="close" />
      <div class="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-2xl">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h2 class="text-xl font-semibold">{{ title }}</h2>
          <button data-testid="dialog-close" class="rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="关闭" @click="close">
            <X class="h-5 w-5" />
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
```

创建 `pbw-web-frontend/src/components/base/BaseTabs.vue`：

```vue
<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: Array<{ value: string; label: string }>
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div>
    <div class="grid rounded-lg bg-gray-200/70 p-1" :style="{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :data-tab="tab.value"
        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
        :class="modelValue === tab.value ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-700'"
        @click="$emit('update:modelValue', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <slot :active="modelValue" />
  </div>
</template>
```

- [ ] **步骤 4：实现输入框和共享展示组件**

创建 `pbw-web-frontend/src/components/base/BaseInput.vue`：

```vue
<script setup lang="ts">
defineProps<{
  id: string
  modelValue: string
  label: string
  type?: string
  placeholder?: string
  autocomplete?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label :for="id" class="block text-sm font-medium text-gray-900">
    {{ label }}
    <span class="relative mt-1 block">
      <span v-if="$slots.leading" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><slot name="leading" /></span>
      <input
        :id="id"
        :value="modelValue"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="h-10 w-full rounded-md border border-transparent bg-gray-100 px-3 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
        :class="{ 'pl-10': $slots.leading, 'pr-10': $slots.trailing }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="$slots.trailing" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><slot name="trailing" /></span>
    </span>
  </label>
</template>
```

创建 `pbw-web-frontend/src/components/shared/ResponsiveImage.vue`：

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ src: string | null; alt: string; class?: string }>()
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>

<template>
  <img v-if="src && !failed" :src="src" :alt="alt" :class="$props.class" @error="failed = true" />
  <div v-else :class="['flex items-center justify-center bg-gray-200 text-center text-xs text-gray-500', $props.class]" role="img" :aria-label="`${alt}加载失败`">
    图片暂不可用
  </div>
</template>
```

创建 `pbw-web-frontend/src/components/shared/SectionHeading.vue`：

```vue
<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>

<template>
  <div class="mb-12 text-center">
    <h2 class="mb-4 text-4xl font-bold">{{ title }}</h2>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>
```

创建 `pbw-web-frontend/src/components/shared/StatItem.vue`：

```vue
<script setup lang="ts">
defineProps<{ value: string; label: string; dark?: boolean }>()
</script>

<template>
  <div class="text-center">
    <div class="text-3xl font-bold md:text-4xl">{{ value }}</div>
    <div class="mt-1 text-sm" :class="dark ? 'text-gray-400' : 'text-gray-600'">{{ label }}</div>
  </div>
</template>
```

- [ ] **步骤 5：运行组件测试、全量测试和类型检查**

```bash
npm test -- tests/components/base-components.test.ts
npm test
npm run type-check
```

预期：基础组件测试 2 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 6：提交基础组件**

```bash
git add pbw-web-frontend/src/components/base pbw-web-frontend/src/components/shared pbw-web-frontend/tests/components
git diff --cached --check
git commit -m "feat: 添加用户端基础组件"
```

---

### 任务 9：实现公共布局与五个路由外壳

**文件：**
- 创建：`pbw-web-frontend/src/components/layout/Navigation.vue`
- 创建：`pbw-web-frontend/src/components/layout/Footer.vue`
- 创建：`pbw-web-frontend/src/components/layout/SiteLayout.vue`
- 创建：`pbw-web-frontend/src/components/layout/AuthLayout.vue`
- 修改：`pbw-web-frontend/src/router/index.ts`
- 创建：`pbw-web-frontend/src/views/HomeView.vue`
- 创建：`pbw-web-frontend/src/views/ServicesView.vue`
- 创建：`pbw-web-frontend/src/views/ConsultingView.vue`
- 创建：`pbw-web-frontend/src/views/AboutView.vue`
- 创建：`pbw-web-frontend/src/views/AuthView.vue`
- 测试：`pbw-web-frontend/tests/router/routes.test.ts`

- [ ] **步骤 1：编写失败的路由与移动菜单测试**

创建 `pbw-web-frontend/tests/router/routes.test.ts`：

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import Navigation from '@/components/layout/Navigation.vue'
import { createAppRouter } from '@/router'

describe('router and layout', () => {
  it.each([
    ['/', 'home-view'],
    ['/services', 'services-view'],
    ['/consulting', 'consulting-view'],
    ['/about', 'about-view'],
    ['/login', 'auth-view'],
  ])('路由 %s 渲染 %s', async (path, testId) => {
    const router = createAppRouter(createMemoryHistory())
    await router.push(path)
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [createPinia(), router] } })

    expect(wrapper.get(`[data-testid="${testId}"]`).exists()).toBe(true)
  })

  it('移动菜单可以展开并收起', async () => {
    const router = createAppRouter(createMemoryHistory())
    const wrapper = mount(Navigation, { global: { plugins: [router] } })
    const toggle = wrapper.get('[data-testid="mobile-menu-toggle"]')

    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(false)
    await toggle.trigger('click')
    expect(wrapper.get('[data-testid="mobile-menu"]').text()).toContain('商业咨询')
    await wrapper.get('[data-testid="mobile-menu-link-/about"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="mobile-menu"]').exists()).toBe(false)
  })

  it('只高亮与当前路径完全一致的导航项', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/services')
    await router.isReady()
    const wrapper = mount(Navigation, { global: { plugins: [router] } })

    expect(wrapper.get('[data-testid="desktop-nav-/services"]').classes()).toContain('text-blue-600')
    expect(wrapper.get('[data-testid="desktop-nav-/"]').classes()).not.toContain('text-blue-600')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/router/routes.test.ts
```

预期：FAIL，提示布局、页面或 `createAppRouter` 不存在。

- [ ] **步骤 3：实现公共导航与页脚**

创建 `pbw-web-frontend/src/components/layout/Navigation.vue`：

```vue
<script setup lang="ts">
import { Menu, Video, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'

const isMenuOpen = ref(false)
const route = useRoute()
const navLinks = [
  { path: '/', label: '作品展示' },
  { path: '/services', label: '服务' },
  { path: '/consulting', label: '商业咨询' },
  { path: '/about', label: '关于我' },
]
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Video class="h-8 w-8 text-blue-600" />
          <span class="text-xl font-semibold">影像创作者</span>
        </RouterLink>
        <div class="hidden items-center gap-8 md:flex">
          <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" :data-testid="`desktop-nav-${link.path}`" class="text-sm transition-colors" :class="route.path === link.path ? 'font-medium text-blue-600' : 'text-gray-700 hover:text-blue-600'">
            {{ link.label }}
          </RouterLink>
        </div>
        <RouterLink to="/login" class="hidden md:block"><BaseButton variant="outline" size="sm">登录</BaseButton></RouterLink>
        <button data-testid="mobile-menu-toggle" class="p-2 md:hidden" aria-label="切换导航菜单" @click="isMenuOpen = !isMenuOpen">
          <X v-if="isMenuOpen" class="h-6 w-6" />
          <Menu v-else class="h-6 w-6" />
        </button>
      </div>
    </div>
    <div v-if="isMenuOpen" data-testid="mobile-menu" class="border-t border-gray-200 bg-white md:hidden">
      <div class="space-y-3 px-4 py-4">
        <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" :data-testid="`mobile-menu-link-${link.path}`" class="block py-2 text-sm" :class="route.path === link.path ? 'font-medium text-blue-600' : 'text-gray-700'" @click="isMenuOpen = false">
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/login" @click="isMenuOpen = false"><BaseButton variant="outline" size="sm" class="w-full">登录</BaseButton></RouterLink>
      </div>
    </div>
  </nav>
</template>
```

创建 `pbw-web-frontend/src/components/layout/Footer.vue`：

```vue
<script setup lang="ts">
import { Video } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/site.store'

const { basicInfo } = storeToRefs(useSiteStore())
</script>

<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div class="md:col-span-2">
          <div class="mb-4 flex items-center gap-2"><Video class="h-6 w-6 text-blue-500" /><span class="text-lg font-semibold text-white">影像创作者</span></div>
          <p class="max-w-md text-sm text-gray-400">用剪辑重构影像记忆，让每帧都有情绪力量</p>
        </div>
        <div>
          <h3 class="mb-4 font-medium text-white">快速链接</h3>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/" class="hover:text-white">作品展示</RouterLink></li>
            <li><RouterLink to="/services" class="hover:text-white">服务</RouterLink></li>
            <li><RouterLink to="/consulting" class="hover:text-white">商业咨询</RouterLink></li>
            <li><RouterLink to="/about" class="hover:text-white">关于我</RouterLink></li>
          </ul>
        </div>
        <div><h3 class="mb-4 font-medium text-white">联系方式</h3><p class="text-sm">商务合作</p><p class="text-sm text-blue-400">{{ basicInfo?.contactEmail ?? 'business@example.com' }}</p></div>
      </div>
      <div class="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">© 2026 影像创作者. All rights reserved.</div>
    </div>
  </footer>
</template>
```

- [ ] **步骤 4：实现布局与页面外壳**

创建 `pbw-web-frontend/src/components/layout/SiteLayout.vue`：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import Footer from './Footer.vue'
import Navigation from './Navigation.vue'
import { useSiteStore } from '@/stores/site.store'

const siteStore = useSiteStore()
onMounted(() => { void siteStore.load() })
</script>

<template><div class="flex min-h-screen flex-col"><Navigation /><main class="flex-1"><RouterView /></main><Footer /></div></template>
```

创建 `pbw-web-frontend/src/components/layout/AuthLayout.vue`：

```vue
<template><main class="min-h-screen"><RouterView /></main></template>
```

创建五个临时页面外壳；后续页面任务直接替换各文件内容：

```vue
<!-- src/views/HomeView.vue -->
<template><div data-testid="home-view">首页</div></template>
```

```vue
<!-- src/views/ServicesView.vue -->
<template><div data-testid="services-view">服务</div></template>
```

```vue
<!-- src/views/ConsultingView.vue -->
<template><div data-testid="consulting-view">商业咨询</div></template>
```

```vue
<!-- src/views/AboutView.vue -->
<template><div data-testid="about-view">关于我</div></template>
```

```vue
<!-- src/views/AuthView.vue -->
<template><div data-testid="auth-view">登录注册</div></template>
```

- [ ] **步骤 5：实现完整路由**

替换 `pbw-web-frontend/src/router/index.ts`：

```ts
import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import AboutView from '@/views/AboutView.vue'
import AuthView from '@/views/AuthView.vue'
import ConsultingView from '@/views/ConsultingView.vue'
import HomeView from '@/views/HomeView.vue'
import ServicesView from '@/views/ServicesView.vue'

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  return createRouter({
    history,
    scrollBehavior: () => ({ top: 0 }),
    routes: [
      {
        path: '/',
        component: SiteLayout,
        children: [
          { path: '', name: 'home', component: HomeView },
          { path: 'services', name: 'services', component: ServicesView },
          { path: 'consulting', name: 'consulting', component: ConsultingView },
          { path: 'about', name: 'about', component: AboutView },
        ],
      },
      {
        path: '/login',
        component: AuthLayout,
        children: [{ path: '', name: 'auth', component: AuthView }],
      },
    ],
  })
}

export default createAppRouter()
```

- [ ] **步骤 6：运行路由测试和全量验证**

```bash
npm test -- tests/router/routes.test.ts
npm test
npm run type-check
```

预期：路由测试 7 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 7：提交布局和路由**

```bash
git add pbw-web-frontend/src/components/layout pbw-web-frontend/src/router pbw-web-frontend/src/views pbw-web-frontend/tests/router
git diff --cached --check
git commit -m "feat: 添加用户端布局与路由"
```

---

### 任务 10：实现首页四个区块

**文件：**
- 创建：`pbw-web-frontend/src/components/sections/home/VideoHero.vue`
- 创建：`pbw-web-frontend/src/components/sections/home/VideoGallery.vue`
- 创建：`pbw-web-frontend/src/components/sections/home/MaterialLibrary.vue`
- 创建：`pbw-web-frontend/src/components/sections/home/MatrixAccounts.vue`
- 修改：`pbw-web-frontend/src/views/HomeView.vue`
- 测试：`pbw-web-frontend/tests/views/home-view.test.ts`

- [ ] **步骤 1：编写失败的首页测试**

创建 `pbw-web-frontend/tests/views/home-view.test.ts`：

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import HomeView from '@/views/HomeView.vue'

describe('HomeView', () => {
  it('渲染首页 Hero、视频、素材和矩阵账号', async () => {
    const wrapper = mount(HomeView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('用剪辑重构影像记忆')
    expect(wrapper.text()).toContain('猜你喜欢')
    expect(wrapper.text()).toContain('素材库')
    expect(wrapper.text()).toContain('关注我的更多平台')
    expect(wrapper.findAll('[data-testid="video-card"]')).toHaveLength(4)
    expect(wrapper.findAll('[data-testid="material-card"]')).toHaveLength(4)
    expect(wrapper.findAll('[data-testid="matrix-card"]')).toHaveLength(4)
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/views/home-view.test.ts
```

预期：FAIL，首页仍是临时外壳，不包含目标区块。

- [ ] **步骤 3：实现首页 Hero 和视频区**

创建 `pbw-web-frontend/src/components/sections/home/VideoHero.vue`：

```vue
<script setup lang="ts">
import { ChevronDown, Play } from 'lucide-vue-next'
import { homeHeroPoster } from '@/configs/home.config'
import type { BasicInfo } from '@/models'
import { formatCount } from '@/shared/formatters'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import StatItem from '@/components/shared/StatItem.vue'

defineProps<{ basicInfo: BasicInfo }>()
function scrollToContent(): void { window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }) }
</script>

<template>
  <section class="relative h-screen w-full overflow-hidden bg-black">
    <div class="absolute inset-0">
      <ResponsiveImage :src="homeHeroPoster" alt="Video Editing Workspace" class="h-full w-full object-cover opacity-60" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
    </div>
    <div class="relative flex h-full flex-col items-center justify-center px-4 text-white">
      <div class="max-w-4xl space-y-6 text-center">
        <h1 class="mb-4 text-5xl font-bold md:text-7xl">用剪辑重构影像记忆</h1>
        <p class="text-xl text-gray-300 md:text-2xl">让每一帧都充满情绪力量</p>
        <button class="mt-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-8 py-4 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/30">
          <Play class="h-6 w-6 fill-current" /><span class="text-lg">观看作品集</span>
        </button>
        <div class="mt-12 grid grid-cols-3 gap-4 border-t border-white/20 pt-12 md:gap-8">
          <StatItem :value="formatCount(basicInfo.totalPlayCount)" label="全网播放量" dark />
          <StatItem :value="formatCount(basicInfo.totalLikeCount)" label="全网点赞数" dark />
          <StatItem :value="formatCount(basicInfo.totalFollowerCount)" label="全网粉丝数" dark />
        </div>
      </div>
      <button class="absolute bottom-8 animate-bounce" aria-label="向下滚动" @click="scrollToContent"><ChevronDown class="h-8 w-8" /></button>
    </div>
  </section>
</template>
```

创建 `pbw-web-frontend/src/components/sections/home/VideoGallery.vue`：

```vue
<script setup lang="ts">
import { ExternalLink, Play } from 'lucide-vue-next'
import type { VideoCardViewModel } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ videos: VideoCardViewModel[] }>()
</script>

<template>
  <section class="bg-gray-50 px-4 py-20">
    <div class="mx-auto max-w-7xl">
      <SectionHeading title="猜你喜欢" description="精选作品，感受剪辑的魅力" />
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <article v-for="video in videos" :key="video.id" data-testid="video-card" class="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div class="relative aspect-video overflow-hidden bg-gray-900">
            <ResponsiveImage :src="video.videoCover" :alt="video.videoTitle" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/60">
              <button class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110" aria-label="播放视频"><Play class="h-8 w-8 fill-current text-white" /></button>
            </div>
            <span class="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-sm text-white">{{ video.platform }}</span>
          </div>
          <div class="p-6">
            <h3 class="mb-2 text-xl font-semibold">{{ video.videoTitle }}</h3>
            <p class="mb-4 line-clamp-2 text-gray-600">{{ video.videoIntro }}</p>
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-gray-500">{{ video.views }} 播放</span>
              <button class="flex items-center gap-1 text-blue-600 hover:text-blue-700"><span class="text-sm">观看完整视频</span><ExternalLink class="h-4 w-4" /></button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
```

- [ ] **步骤 4：实现素材库区**

创建 `pbw-web-frontend/src/components/sections/home/MaterialLibrary.vue`：

```vue
<script setup lang="ts">
import { Download, Gift, Scissors, ShoppingCart, Video, Volume2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import type { MaterialCardViewModel } from '@/models'
import { formatPrice } from '@/shared/formatters'

defineProps<{ materials: MaterialCardViewModel[] }>()
const iconMap = { scissors: Scissors, volume: Volume2, video: Video, gift: Gift }
const colorMap = { blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500', green: 'bg-green-500', orange: 'bg-orange-500', black: 'bg-black', red: 'bg-red-500' }
const selected = ref<MaterialCardViewModel | null>(null)
const dialogOpen = ref(false)
const dialogTitle = computed(() => selected.value?.price === 0 ? '获取免费素材' : `购买 ${selected.value?.materialTitle ?? ''}`)
function openDialog(material: MaterialCardViewModel): void { selected.value = material; dialogOpen.value = true }
</script>

<template>
  <section class="bg-white px-4 py-20">
    <div class="mx-auto max-w-7xl">
      <SectionHeading title="素材库" description="优质素材资源，助力你的创作" />
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="material in materials" :key="material.id" data-testid="material-card" class="rounded-xl bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" :class="colorMap[material.color]"><component :is="iconMap[material.icon]" class="h-6 w-6 text-white" /></div>
          <h3 class="mb-2 text-xl font-semibold">{{ material.materialTitle }}</h3>
          <p class="mb-4 text-sm text-gray-600">{{ material.materialIntro }}</p>
          <div class="mb-4 flex items-center justify-between"><span class="text-2xl font-bold text-blue-600">{{ formatPrice(material.price) }}</span><span class="text-sm text-gray-500">{{ material.itemCount }}+ 素材</span></div>
          <BaseButton :variant="material.price === 0 ? 'primary' : 'outline'" class="w-full" @click="openDialog(material)">
            <Download v-if="material.price === 0" class="h-4 w-4" /><ShoppingCart v-else class="h-4 w-4" />{{ material.price === 0 ? '免费下载' : '立即购买' }}
          </BaseButton>
        </article>
      </div>
    </div>
    <BaseDialog v-model="dialogOpen" :title="dialogTitle">
      <div v-if="selected" class="space-y-4">
        <div class="rounded-lg bg-gray-50 p-4"><div class="flex justify-between gap-4"><strong>{{ selected.materialTitle }}</strong><strong class="text-blue-600">{{ formatPrice(selected.price) }}</strong></div><p class="mt-2 text-sm text-gray-600">{{ selected.materialIntro }}</p></div>
        <p v-if="selected.price > 0" class="text-sm text-red-600">⚠️ 重要声明：素材仅供个人学习使用，请勿用于商业或其他用途</p>
        <p class="text-center text-gray-600">{{ selected.price === 0 ? '扫描下方二维码，关注公众号获取网盘链接' : '扫描下方二维码完成支付' }}</p>
        <div class="mx-auto flex h-48 w-48 items-center justify-center rounded-lg bg-gray-200 text-center text-sm text-gray-500">二维码占位</div>
      </div>
    </BaseDialog>
  </section>
</template>
```

- [ ] **步骤 5：实现矩阵账号区与首页组装**

创建 `pbw-web-frontend/src/components/sections/home/MatrixAccounts.vue`：

```vue
<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import type { MatrixAccountViewModel } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ accounts: MatrixAccountViewModel[] }>()
const colorMap = { blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500', green: 'bg-green-500', orange: 'bg-orange-500', black: 'bg-black', red: 'bg-red-500' }
</script>

<template>
  <section class="bg-gradient-to-b from-gray-50 to-white px-4 py-20">
    <div class="mx-auto max-w-7xl">
      <SectionHeading title="关注我的更多平台" description="全网同名，持续更新优质内容" />
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <a v-for="account in accounts" :key="account.id" data-testid="matrix-card" :href="account.accountUrl ?? '#'" target="_blank" rel="noopener noreferrer" class="group rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div class="flex flex-col items-center text-center">
            <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl transition-transform group-hover:scale-110" :class="colorMap[account.color]"><ResponsiveImage :src="account.platformLogo" :alt="account.platformName" class="h-12 w-12 rounded-lg object-cover" /></div>
            <h3 class="mb-1 text-xl font-semibold">{{ account.platformName }}</h3><p class="mb-3 text-sm text-gray-600">{{ account.displayName }}</p>
            <div class="mb-4"><span class="text-2xl font-bold text-blue-600">{{ account.followers }}</span><span class="ml-1 text-sm text-gray-500">粉丝</span></div>
            <span class="flex items-center gap-1 text-sm text-blue-600">访问主页<ExternalLink class="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
```

替换 `pbw-web-frontend/src/views/HomeView.vue`：

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import MaterialLibrary from '@/components/sections/home/MaterialLibrary.vue'
import MatrixAccounts from '@/components/sections/home/MatrixAccounts.vue'
import VideoGallery from '@/components/sections/home/VideoGallery.vue'
import VideoHero from '@/components/sections/home/VideoHero.vue'
import { useSiteStore } from '@/stores/site.store'

const store = useSiteStore()
const { basicInfo, videos, materials, matrixAccounts, status, errorMessage } = storeToRefs(store)
onMounted(() => { void store.load() })
</script>

<template>
  <div data-testid="home-view" class="w-full">
    <p v-if="status === 'error'" class="p-8 text-center text-red-600">{{ errorMessage }}</p>
    <template v-else-if="basicInfo">
      <VideoHero :basic-info="basicInfo" />
      <VideoGallery :videos="videos" />
      <MaterialLibrary :materials="materials" />
      <MatrixAccounts :accounts="matrixAccounts" />
    </template>
  </div>
</template>
```

- [ ] **步骤 6：运行首页测试和全量验证**

```bash
npm test -- tests/views/home-view.test.ts
npm test
npm run type-check
```

预期：首页测试 1 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 7：提交首页**

```bash
git add pbw-web-frontend/src/components/sections/home pbw-web-frontend/src/views/HomeView.vue pbw-web-frontend/tests/views/home-view.test.ts
git diff --cached --check
git commit -m "feat: 复刻用户端首页"
```

---

### 任务 11：实现课程服务页面

**文件：**
- 创建：`pbw-web-frontend/src/components/sections/services/CourseCard.vue`
- 修改：`pbw-web-frontend/src/views/ServicesView.vue`
- 测试：`pbw-web-frontend/tests/views/services-view.test.ts`

- [ ] **步骤 1：编写失败的课程页面测试**

创建 `pbw-web-frontend/tests/views/services-view.test.ts`：

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ServicesView from '@/views/ServicesView.vue'

describe('ServicesView', () => {
  it('渲染四门课程及上下线状态', async () => {
    const wrapper = mount(ServicesView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('课程体系')
    expect(wrapper.findAll('[data-testid="course-card"]')).toHaveLength(4)
    expect(wrapper.text()).toContain('剪辑入门实战营')
    expect(wrapper.text()).toContain('即将上线')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/views/services-view.test.ts
```

预期：FAIL，服务页面仍是临时外壳。

- [ ] **步骤 3：实现课程卡片和报名弹窗**

创建 `pbw-web-frontend/src/components/sections/services/CourseCard.vue`：

```vue
<script setup lang="ts">
import { Clock, GraduationCap, Palette, TrendingUp, Video } from 'lucide-vue-next'
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import type { CourseCardViewModel } from '@/models'
import { formatPrice } from '@/shared/formatters'

const props = defineProps<{ course: CourseCardViewModel }>()
const dialogOpen = ref(false)
const iconMap = { video: Video, graduation: GraduationCap, palette: Palette, trending: TrendingUp }
const colorMap = { blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500', green: 'bg-green-500', orange: 'bg-orange-500', black: 'bg-black', red: 'bg-red-500' }
</script>

<template>
  <article data-testid="course-card" class="overflow-hidden rounded-2xl bg-white shadow-lg" :class="{ 'opacity-75': !course.isOnline }">
    <div class="p-6 text-white" :class="colorMap[course.color]">
      <div class="mb-4 flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md"><component :is="iconMap[course.icon]" class="h-6 w-6" /></div>
          <div><h3 class="text-2xl font-bold">{{ course.courseName }}</h3><span class="mt-1 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">{{ course.courseTag }}</span></div>
        </div>
        <span v-if="!course.isOnline" class="rounded-full bg-yellow-500 px-3 py-1 text-xs">即将上线</span>
      </div>
      <p class="text-white/90">{{ course.courseIntro }}</p>
    </div>
    <div class="p-6">
      <div class="mb-6 flex items-center gap-6 text-sm text-gray-600"><span class="flex items-center gap-2"><Clock class="h-4 w-4" />{{ course.duration }}</span><span class="flex items-center gap-2"><Video class="h-4 w-4" />{{ course.lessons }} 节课</span></div>
      <h4 class="mb-3 font-semibold">课程内容</h4>
      <ul class="mb-6 space-y-2"><li v-for="feature in course.features" :key="feature" class="flex gap-2 text-sm text-gray-600"><span class="text-green-500">✓</span>{{ feature }}</li></ul>
      <div class="flex items-center justify-between gap-4 border-t pt-6"><div><span class="text-3xl font-bold text-blue-600">{{ formatPrice(course.coursePrice) }}</span><span class="ml-2 text-gray-500">/ 整套课程</span></div><BaseButton size="lg" :disabled="!course.isOnline" @click="dialogOpen = true">{{ course.isOnline ? '立即报名' : '敬请期待' }}</BaseButton></div>
    </div>
    <BaseDialog v-model="dialogOpen" :title="`报名 ${props.course.courseName}`">
      <div class="space-y-4"><div class="rounded-lg bg-gray-50 p-4"><strong>{{ course.courseName }}</strong><div class="mt-3 grid grid-cols-2 gap-4 text-sm"><span>课程时长：{{ course.duration }}</span><span>课程数量：{{ course.lessons }} 节</span></div><div class="mt-3 flex justify-between border-t pt-3"><span>课程价格</span><strong class="text-blue-600">{{ formatPrice(course.coursePrice) }}</strong></div></div><p class="text-center text-gray-600">扫描下方二维码，添加课程顾问咨询报名</p><div class="mx-auto flex h-64 w-64 items-center justify-center rounded-lg bg-gray-200 text-center text-sm text-gray-500">课程顾问二维码</div></div>
    </BaseDialog>
  </article>
</template>
```

- [ ] **步骤 4：实现课程页面**

替换 `pbw-web-frontend/src/views/ServicesView.vue`：

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import CourseCard from '@/components/sections/services/CourseCard.vue'
import { useCourseStore } from '@/stores/course.store'

const store = useCourseStore()
const { courses, status, errorMessage } = storeToRefs(store)
onMounted(() => { void store.load() })
</script>

<template>
  <div data-testid="services-view" class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-20 text-white"><div class="mx-auto max-w-7xl text-center"><h1 class="mb-6 text-5xl font-bold">课程体系</h1><p class="mx-auto max-w-2xl text-xl text-blue-100">系统化的剪辑课程，从入门到精通，助你成为优秀的视频创作者</p></div></section>
    <section class="px-4 py-20"><div class="mx-auto max-w-7xl"><p v-if="status === 'error'" class="text-center text-red-600">{{ errorMessage }}</p><div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2"><CourseCard v-for="course in courses" :key="course.id" :course="course" /></div></div></section>
    <section class="bg-gray-50 px-4 py-20"><div class="mx-auto max-w-4xl text-center"><h2 class="mb-4 text-3xl font-bold">还在犹豫？</h2><p class="mb-8 text-gray-600">扫描下方二维码，添加课程顾问，获取试听课程和详细课程大纲</p><div class="mx-auto flex h-64 w-64 items-center justify-center rounded-2xl bg-white text-sm text-gray-500 shadow-lg">课程顾问二维码</div></div></section>
  </div>
</template>
```

- [ ] **步骤 5：运行课程页面测试和全量验证**

```bash
npm test -- tests/views/services-view.test.ts
npm test
npm run type-check
```

预期：课程页面测试 1 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 6：提交课程页面**

```bash
git add pbw-web-frontend/src/components/sections/services pbw-web-frontend/src/views/ServicesView.vue pbw-web-frontend/tests/views/services-view.test.ts
git diff --cached --check
git commit -m "feat: 复刻用户端课程页面"
```

---

### 任务 12：实现商业咨询页面

**文件：**
- 创建：`pbw-web-frontend/src/components/sections/consulting/ConsultingServiceCard.vue`
- 修改：`pbw-web-frontend/src/views/ConsultingView.vue`
- 测试：`pbw-web-frontend/tests/views/consulting-view.test.ts`

- [ ] **步骤 1：编写失败的商业咨询页面测试**

创建 `pbw-web-frontend/tests/views/consulting-view.test.ts`：

```ts
import { mount } from '@vue/test-utils'
import ConsultingView from '@/views/ConsultingView.vue'

describe('ConsultingView', () => {
  it('渲染服务项目、合作流程和案例', () => {
    const wrapper = mount(ConsultingView)

    expect(wrapper.text()).toContain('商业剪辑服务')
    expect(wrapper.findAll('[data-testid="consulting-service-card"]')).toHaveLength(4)
    expect(wrapper.findAll('[data-testid="workflow-step"]')).toHaveLength(4)
    expect(wrapper.findAll('[data-testid="case-study"]')).toHaveLength(3)
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/views/consulting-view.test.ts
```

预期：FAIL，商业咨询页面仍是临时外壳。

- [ ] **步骤 3：实现商业服务卡片与咨询弹窗**

创建 `pbw-web-frontend/src/components/sections/consulting/ConsultingServiceCard.vue`：

```vue
<script setup lang="ts">
import { Award, Camera, Sparkles, Video } from 'lucide-vue-next'
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import type { ConsultingService } from '@/configs/consulting.config'

defineProps<{ service: ConsultingService }>()
const dialogOpen = ref(false)
const iconMap = { video: Video, sparkles: Sparkles, camera: Camera, award: Award }
const colorMap = { blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500', green: 'bg-green-500', orange: 'bg-orange-500', black: 'bg-black', red: 'bg-red-500' }
</script>

<template>
  <article data-testid="consulting-service-card" class="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
    <div class="p-6 text-white" :class="colorMap[service.color]"><div class="mb-3 flex items-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md"><component :is="iconMap[service.icon]" class="h-6 w-6" /></div><h3 class="text-2xl font-bold">{{ service.title }}</h3></div><p class="text-white/90">{{ service.description }}</p></div>
    <div class="p-6"><h4 class="mb-3 font-semibold">服务特色</h4><div class="mb-6 grid grid-cols-2 gap-2"><span v-for="feature in service.features" :key="feature" class="flex gap-2 text-sm text-gray-600"><span class="text-green-500">✓</span>{{ feature }}</span></div><div class="flex items-center justify-between border-t pt-4"><div><strong class="block text-2xl text-blue-600">{{ service.price }}</strong><span class="text-sm text-gray-500">{{ service.duration }}</span></div><BaseButton @click="dialogOpen = true">咨询服务</BaseButton></div></div>
    <BaseDialog v-model="dialogOpen" :title="`咨询 ${service.title}`"><div class="space-y-4"><div class="rounded-lg bg-gray-50 p-4"><strong>{{ service.title }}</strong><p class="my-2 text-sm text-gray-600">{{ service.description }}</p><div class="flex justify-between text-sm"><span>起步价格</span><strong class="text-blue-600">{{ service.price }}</strong></div></div><p class="text-gray-600">扫描下方二维码，添加管理员微信</p><div class="mx-auto flex h-64 w-64 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">管理员微信二维码</div></div></BaseDialog>
  </article>
</template>
```

- [ ] **步骤 4：实现商业咨询页面**

替换 `pbw-web-frontend/src/views/ConsultingView.vue`：

```vue
<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import ConsultingServiceCard from '@/components/sections/consulting/ConsultingServiceCard.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import { caseStudies, consultingServices, cooperationWorkflow } from '@/configs/consulting.config'

const contactOpen = ref(false)
</script>

<template>
  <div data-testid="consulting-view" class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-20 text-white"><div class="mx-auto max-w-7xl text-center"><h1 class="mb-6 text-5xl font-bold">商业剪辑服务</h1><p class="mx-auto mb-8 max-w-2xl text-xl text-purple-100">专业的剪辑团队，为您的品牌和活动提供高质量视频制作服务</p><BaseButton size="lg" variant="secondary" class="text-lg" @click="contactOpen = true"><MessageCircle class="h-5 w-5" />立即咨询</BaseButton></div></section>
    <section class="px-4 py-20"><div class="mx-auto max-w-7xl"><SectionHeading title="服务项目" description="多样化的视频制作服务，满足您的不同需求" /><div class="grid grid-cols-1 gap-8 md:grid-cols-2"><ConsultingServiceCard v-for="service in consultingServices" :key="service.id" :service="service" /></div></div></section>
    <section class="bg-gray-50 px-4 py-20"><div class="mx-auto max-w-5xl"><SectionHeading title="合作流程" description="简单四步，开启合作之旅" /><div class="grid grid-cols-1 gap-6 md:grid-cols-4"><div v-for="(item, index) in cooperationWorkflow" :key="item.step" data-testid="workflow-step" class="relative"><div class="rounded-xl bg-white p-6 text-center shadow-md"><div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">{{ item.step }}</div><h3 class="mb-2 font-semibold">{{ item.title }}</h3><p class="text-sm text-gray-600">{{ item.description }}</p></div><div v-if="index < cooperationWorkflow.length - 1" class="absolute right-0 top-1/2 hidden h-0.5 w-6 translate-x-1/2 bg-blue-300 md:block" /></div></div></div></section>
    <section class="px-4 py-20"><div class="mx-auto max-w-7xl"><SectionHeading title="成功案例" description="已为100+客户提供专业视频制作服务" /><div class="grid grid-cols-1 gap-8 md:grid-cols-3"><article v-for="item in caseStudies" :key="item.id" data-testid="case-study" class="overflow-hidden rounded-xl bg-white shadow-lg"><div class="aspect-video bg-gray-200" /><div class="p-6"><h3 class="mb-2 font-semibold">{{ item.title }}</h3><p class="text-sm text-gray-600">{{ item.description }}</p></div></article></div></div></section>
    <BaseDialog v-model="contactOpen" title="联系商务合作"><div class="space-y-4"><p class="text-gray-600">扫描下方二维码，添加管理员微信咨询服务</p><div class="mx-auto flex h-64 w-64 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">管理员微信二维码</div><p class="text-center text-sm text-gray-500">工作时间：周一至周五 9:00-18:00<br />24小时内回复咨询</p></div></BaseDialog>
  </div>
</template>
```

- [ ] **步骤 5：运行商业咨询测试和全量验证**

```bash
npm test -- tests/views/consulting-view.test.ts
npm test
npm run type-check
```

预期：商业咨询测试 1 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 6：提交商业咨询页面**

```bash
git add pbw-web-frontend/src/components/sections/consulting pbw-web-frontend/src/views/ConsultingView.vue pbw-web-frontend/tests/views/consulting-view.test.ts
git diff --cached --check
git commit -m "feat: 复刻商业咨询页面"
```

---

### 任务 13：实现关于我页面

**文件：**
- 创建：`pbw-web-frontend/src/components/sections/about/AboutHero.vue`
- 创建：`pbw-web-frontend/src/components/sections/about/CreatorStats.vue`
- 创建：`pbw-web-frontend/src/components/sections/about/Milestones.vue`
- 创建：`pbw-web-frontend/src/components/sections/about/BehindTheScenes.vue`
- 创建：`pbw-web-frontend/src/components/sections/about/ContactSection.vue`
- 修改：`pbw-web-frontend/src/views/AboutView.vue`
- 测试：`pbw-web-frontend/tests/views/about-view.test.ts`

- [ ] **步骤 1：编写失败的关于我页面测试**

创建 `pbw-web-frontend/tests/views/about-view.test.ts`：

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import AboutView from '@/views/AboutView.vue'

describe('AboutView', () => {
  it('渲染作者资料、数据、里程碑、幕后故事和联系方式', async () => {
    const wrapper = mount(AboutView, { global: { plugins: [createPinia()] } })
    await flushPromises()

    expect(wrapper.text()).toContain('关于我')
    expect(wrapper.text()).toContain('成长里程碑')
    expect(wrapper.findAll('[data-testid="milestone"]')).toHaveLength(4)
    expect(wrapper.text()).toContain('我的年度十佳影片')
    expect(wrapper.text()).toContain('影响我的三位导演')
    expect(wrapper.text()).toContain('business@example.com')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/views/about-view.test.ts
```

预期：FAIL，关于我页面仍是临时外壳。

- [ ] **步骤 3：实现作者 Hero 与统计区**

创建 `pbw-web-frontend/src/components/sections/about/AboutHero.vue`：

```vue
<script setup lang="ts">
import type { BasicInfo, MatrixAccountViewModel } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'

defineProps<{ basicInfo: BasicInfo; accounts: MatrixAccountViewModel[] }>()
const colorMap = { blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500', green: 'bg-green-500', orange: 'bg-orange-500', black: 'bg-black', red: 'bg-red-500' }
</script>

<template>
  <section class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-20 text-white">
    <div class="mx-auto max-w-7xl"><div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div><h1 class="mb-4 text-5xl font-bold">关于我</h1><div class="space-y-4 text-lg text-blue-100"><p class="text-2xl font-medium text-white">{{ basicInfo.authorIdentityTag }}</p><p class="border-l-4 border-white/50 pl-4 text-xl italic">“{{ basicInfo.slogan }}”</p><p>{{ basicInfo.creationAttitude }}</p></div><div class="mt-8 flex flex-wrap gap-3"><a v-for="account in accounts" :key="account.id" :href="account.accountUrl ?? '#'" class="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-transform hover:scale-105" :class="colorMap[account.color]"><span>{{ account.platformName }}</span><span class="text-xs opacity-80">{{ account.followers }}</span></a></div></div>
      <div class="flex justify-center"><div class="relative"><div class="h-80 w-80 overflow-hidden rounded-2xl shadow-2xl"><ResponsiveImage :src="basicInfo.authorPhoto" alt="Creator Profile" class="h-full w-full object-cover" /></div><div class="absolute -bottom-4 -right-4 rounded-xl bg-white px-6 py-3 text-gray-900 shadow-lg"><div class="text-sm text-gray-600">抖音精选作者</div><div class="text-lg font-bold">@影像创作者</div></div></div></div>
    </div></div>
  </section>
</template>
```

创建 `pbw-web-frontend/src/components/sections/about/CreatorStats.vue`：

```vue
<script setup lang="ts">
import { Award, Heart, TrendingUp } from 'lucide-vue-next'
import type { BasicInfo } from '@/models'
import { formatCount } from '@/shared/formatters'

defineProps<{ basicInfo: BasicInfo }>()
</script>

<template>
  <section class="bg-white px-4 py-12"><div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
    <div class="text-center"><TrendingUp class="mx-auto mb-3 h-8 w-8 text-blue-600" /><strong class="block text-4xl">{{ formatCount(basicInfo.totalPlayCount) }}</strong><span class="text-gray-600">全网播放量</span></div>
    <div class="text-center"><Heart class="mx-auto mb-3 h-8 w-8 text-blue-600" /><strong class="block text-4xl">{{ formatCount(basicInfo.totalLikeCount) }}</strong><span class="text-gray-600">全网点赞数</span></div>
    <div class="text-center"><Award class="mx-auto mb-3 h-8 w-8 text-blue-600" /><strong class="block text-4xl">{{ formatCount(basicInfo.totalFollowerCount) }}</strong><span class="text-gray-600">全网粉丝数</span></div>
  </div></section>
</template>
```

- [ ] **步骤 4：实现里程碑与幕后故事区**

创建 `pbw-web-frontend/src/components/sections/about/Milestones.vue`：

```vue
<script setup lang="ts">
import { milestones } from '@/configs/about.config'
import SectionHeading from '@/components/shared/SectionHeading.vue'
</script>

<template>
  <section class="bg-gray-50 px-4 py-20"><div class="mx-auto max-w-5xl"><SectionHeading title="成长里程碑" description="记录每一个重要时刻" /><div class="relative"><div class="absolute left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-blue-200 md:block" /><div class="space-y-12"><div v-for="(item, index) in milestones" :key="item.year" data-testid="milestone" class="relative flex items-center" :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"><div class="w-full md:w-5/12" :class="index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'"><div class="rounded-xl bg-white p-6 shadow-lg"><strong class="mb-2 block text-2xl text-blue-600">{{ item.year }}</strong><h3 class="mb-2 text-xl font-semibold">{{ item.title }}</h3><p class="text-gray-600">{{ item.description }}</p></div></div><div class="absolute left-1/2 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-blue-600 shadow-lg md:block" /></div></div></div></div></section>
</template>
```

创建 `pbw-web-frontend/src/components/sections/about/BehindTheScenes.vue`：

```vue
<script setup lang="ts">
import type { BasicInfo } from '@/models'
import ResponsiveImage from '@/components/shared/ResponsiveImage.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'

defineProps<{ basicInfo: BasicInfo }>()
</script>

<template>
  <section class="bg-white px-4 py-20"><div class="mx-auto max-w-7xl"><SectionHeading title="幕后故事" description="记录创作的每一个瞬间" /><div class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
    <article class="overflow-hidden rounded-xl shadow-lg"><ResponsiveImage :src="basicInfo.editingDeskWorkPhoto" alt="Workspace" class="h-64 w-full object-cover" /><p class="bg-gray-50 p-4 text-sm text-gray-600">剪辑台工作日常</p></article>
    <article class="overflow-hidden rounded-xl shadow-lg"><ResponsiveImage :src="basicInfo.assetLibraryScreenshot" alt="Production" class="h-64 w-full object-cover" /><p class="bg-gray-50 p-4 text-sm text-gray-600">拍摄现场记录</p></article>
    <article class="overflow-hidden rounded-xl shadow-lg"><ResponsiveImage :src="basicInfo.dailyMovieWatchingPhoto" alt="Cinema" class="h-64 w-full object-cover" /><p class="bg-gray-50 p-4 text-sm text-gray-600">观影学习时刻</p></article>
  </div><div class="grid grid-cols-1 gap-8 md:grid-cols-2"><div class="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-8"><h3 class="mb-4 text-2xl font-bold">我的年度十佳影片</h3><p class="mb-4 text-sm text-gray-600">这些电影深刻影响了我的剪辑理念</p><ol class="space-y-2"><li v-for="(film, index) in basicInfo.annualTop10Films" :key="film" class="flex gap-2"><strong class="text-blue-600">{{ index + 1 }}.</strong><span>{{ film }}</span></li></ol></div><div class="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8"><h3 class="mb-4 text-2xl font-bold">影响我的三位导演</h3><p class="mb-4 text-sm text-gray-600">向大师学习，不断精进</p><div class="space-y-4"><div v-for="(director, index) in basicInfo.influentialThreeDirectors" :key="director" class="flex items-start gap-3 rounded-lg bg-white p-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">{{ index + 1 }}</span><span class="font-medium">{{ director }}</span></div></div></div></div></div></section>
</template>
```

- [ ] **步骤 5：实现联系方式与页面组装**

创建 `pbw-web-frontend/src/components/sections/about/ContactSection.vue`：

```vue
<script setup lang="ts">
import { ExternalLink, Mail, MessageCircle } from 'lucide-vue-next'
import type { BasicInfo } from '@/models'

defineProps<{ basicInfo: BasicInfo }>()
</script>

<template>
  <section class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-20 text-white"><div class="mx-auto max-w-4xl text-center"><h2 class="mb-4 text-4xl font-bold">联系方式</h2><p class="mb-12 text-xl text-blue-100">期待与您的合作</p><div class="grid grid-cols-1 gap-8 md:grid-cols-2"><div class="rounded-2xl bg-white/10 p-8 backdrop-blur-md"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20"><Mail class="h-8 w-8" /></div><h3 class="mb-2 text-xl font-semibold">商务合作邮箱</h3><p class="mb-4 text-blue-100">{{ basicInfo.contactEmail }}</p><a :href="`mailto:${basicInfo.contactEmail}`" class="inline-flex items-center gap-2 text-sm hover:underline">发送邮件<ExternalLink class="h-4 w-4" /></a></div><div class="rounded-2xl bg-white/10 p-8 backdrop-blur-md"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20"><MessageCircle class="h-8 w-8" /></div><h3 class="mb-2 text-xl font-semibold">合作微信</h3><p class="mb-4 text-blue-100">扫码添加（注明“商务合作”）</p><div class="inline-block rounded-lg bg-white p-4"><div class="flex h-32 w-32 items-center justify-center bg-gray-200 text-xs text-gray-500">二维码占位</div></div></div></div></div></section>
</template>
```

替换 `pbw-web-frontend/src/views/AboutView.vue`：

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import AboutHero from '@/components/sections/about/AboutHero.vue'
import BehindTheScenes from '@/components/sections/about/BehindTheScenes.vue'
import ContactSection from '@/components/sections/about/ContactSection.vue'
import CreatorStats from '@/components/sections/about/CreatorStats.vue'
import Milestones from '@/components/sections/about/Milestones.vue'
import { useSiteStore } from '@/stores/site.store'

const store = useSiteStore()
const { basicInfo, matrixAccounts, status, errorMessage } = storeToRefs(store)
onMounted(() => { void store.load() })
</script>

<template>
  <div data-testid="about-view" class="min-h-screen bg-gradient-to-b from-gray-50 to-white"><p v-if="status === 'error'" class="p-8 text-center text-red-600">{{ errorMessage }}</p><template v-else-if="basicInfo"><AboutHero :basic-info="basicInfo" :accounts="matrixAccounts" /><CreatorStats :basic-info="basicInfo" /><Milestones /><BehindTheScenes :basic-info="basicInfo" /><ContactSection :basic-info="basicInfo" /></template></div>
</template>
```

- [ ] **步骤 6：运行关于我测试和全量验证**

```bash
npm test -- tests/views/about-view.test.ts
npm test
npm run type-check
```

预期：关于我测试 1 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 7：提交关于我页面**

```bash
git add pbw-web-frontend/src/components/sections/about pbw-web-frontend/src/views/AboutView.vue pbw-web-frontend/tests/views/about-view.test.ts
git diff --cached --check
git commit -m "feat: 复刻关于我页面"
```

---

### 任务 14：实现登录与注册展示页面

**文件：**
- 创建：`pbw-web-frontend/src/components/sections/auth/BrandPanel.vue`
- 创建：`pbw-web-frontend/src/components/sections/auth/LoginForm.vue`
- 创建：`pbw-web-frontend/src/components/sections/auth/RegisterForm.vue`
- 修改：`pbw-web-frontend/src/views/AuthView.vue`
- 测试：`pbw-web-frontend/tests/views/auth-view.test.ts`

- [ ] **步骤 1：编写失败的认证页面交互测试**

创建 `pbw-web-frontend/tests/views/auth-view.test.ts`：

```ts
import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import AuthView from '@/views/AuthView.vue'

describe('AuthView', () => {
  it('默认展示登录字段并可切换注册页签', async () => {
    const router = createAppRouter(createMemoryHistory())
    const wrapper = mount(AuthView, { global: { plugins: [router] } })

    expect(wrapper.get('#login-account').exists()).toBe(true)
    expect(wrapper.get('#login-password').attributes('type')).toBe('password')
    await wrapper.get('[data-tab="register"]').trigger('click')
    expect(wrapper.get('#register-nickname').exists()).toBe(true)
    expect(wrapper.get('#register-account').exists()).toBe(true)
    expect(wrapper.get('#register-email').exists()).toBe(true)
    expect(wrapper.get('#register-confirm-password').exists()).toBe(true)
  })

  it('登录密码可以切换显示状态', async () => {
    const router = createAppRouter(createMemoryHistory())
    const wrapper = mount(AuthView, { global: { plugins: [router] } })
    await wrapper.get('[data-testid="login-password-toggle"]').trigger('click')
    expect(wrapper.get('#login-password').attributes('type')).toBe('text')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- tests/views/auth-view.test.ts
```

预期：FAIL，认证页面仍是临时外壳。

- [ ] **步骤 3：实现左侧品牌面板**

创建 `pbw-web-frontend/src/components/sections/auth/BrandPanel.vue`：

```vue
<script setup lang="ts">
import { Video } from 'lucide-vue-next'
</script>

<template>
  <aside class="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-white lg:flex">
    <RouterLink to="/" class="flex items-center gap-2"><Video class="h-8 w-8" /><span class="text-2xl font-bold">影像创作者</span></RouterLink>
    <div class="space-y-6"><h1 class="text-5xl font-bold leading-tight">用剪辑重构<br />影像记忆</h1><p class="text-xl text-blue-100">加入我们，开启你的创作之旅</p><div class="grid grid-cols-3 gap-6 pt-8"><div><strong class="block text-3xl">1000万+</strong><span class="text-sm text-blue-200">全网播放</span></div><div><strong class="block text-3xl">50万+</strong><span class="text-sm text-blue-200">点赞收藏</span></div><div><strong class="block text-3xl">20万+</strong><span class="text-sm text-blue-200">忠实粉丝</span></div></div></div>
    <p class="text-sm text-blue-200">© 2026 影像创作者. All rights reserved.</p>
  </aside>
</template>
```

- [ ] **步骤 4：实现登录表单**

创建 `pbw-web-frontend/src/components/sections/auth/LoginForm.vue`：

```vue
<script setup lang="ts">
import { Eye, EyeOff, Lock, User } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { LoginPayload } from '@/models'

const showPassword = ref(false)
const form = reactive<LoginPayload>({ account: '', password: '' })
</script>

<template>
  <div class="rounded-2xl bg-white p-8 shadow-xl"><div class="mb-6"><h2 class="mb-2 text-2xl font-bold">欢迎回来</h2><p class="text-gray-600">登录你的账号继续创作</p></div><form class="space-y-4" @submit.prevent>
    <BaseInput id="login-account" v-model="form.account" label="账号" placeholder="请输入账号" autocomplete="username"><template #leading><User class="h-5 w-5" /></template></BaseInput>
    <BaseInput id="login-password" v-model="form.password" label="密码" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password"><template #leading><Lock class="h-5 w-5" /></template><template #trailing><button type="button" data-testid="login-password-toggle" aria-label="显示或隐藏密码" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" class="h-5 w-5" /><Eye v-else class="h-5 w-5" /></button></template></BaseInput>
    <div class="flex items-center justify-between text-sm"><label class="flex items-center gap-2"><input type="checkbox" class="rounded" /><span class="text-gray-600">记住我</span></label><button type="button" class="text-blue-600 hover:text-blue-700">忘记密码?</button></div>
    <BaseButton type="submit" size="lg" class="w-full">登录</BaseButton>
  </form></div>
</template>
```

- [ ] **步骤 5：实现注册表单**

创建 `pbw-web-frontend/src/components/sections/auth/RegisterForm.vue`：

```vue
<script setup lang="ts">
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { RegisterForm as RegisterFormModel } from '@/models'

const showPassword = ref(false)
const form = reactive<RegisterFormModel>({ nickname: '', account: '', email: '', password: '', confirmPassword: '' })
</script>

<template>
  <div class="rounded-2xl bg-white p-8 shadow-xl"><div class="mb-6"><h2 class="mb-2 text-2xl font-bold">创建账号</h2><p class="text-gray-600">加入我们，开启创作之旅</p></div><form class="space-y-4" @submit.prevent>
    <BaseInput id="register-nickname" v-model="form.nickname" label="昵称" placeholder="你的昵称"><template #leading><User class="h-5 w-5" /></template></BaseInput>
    <BaseInput id="register-account" v-model="form.account" label="账号" placeholder="登录账号" autocomplete="username"><template #leading><User class="h-5 w-5" /></template></BaseInput>
    <BaseInput id="register-email" v-model="form.email" label="邮箱" type="email" placeholder="your@email.com" autocomplete="email"><template #leading><Mail class="h-5 w-5" /></template></BaseInput>
    <BaseInput id="register-password" v-model="form.password" label="密码" :type="showPassword ? 'text' : 'password'" placeholder="至少8位字符" autocomplete="new-password"><template #leading><Lock class="h-5 w-5" /></template><template #trailing><button type="button" aria-label="显示或隐藏密码" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" class="h-5 w-5" /><Eye v-else class="h-5 w-5" /></button></template></BaseInput>
    <BaseInput id="register-confirm-password" v-model="form.confirmPassword" label="确认密码" :type="showPassword ? 'text' : 'password'" placeholder="再次输入密码" autocomplete="new-password"><template #leading><Lock class="h-5 w-5" /></template></BaseInput>
    <label class="flex items-start gap-2 text-sm text-gray-600"><input type="checkbox" class="mt-1 rounded" /><span>我同意 <button type="button" class="text-blue-600">服务条款</button> 和 <button type="button" class="text-blue-600">隐私政策</button></span></label>
    <BaseButton type="submit" size="lg" class="w-full">注册</BaseButton>
  </form></div>
</template>
```

- [ ] **步骤 6：实现认证页面组装**

替换 `pbw-web-frontend/src/views/AuthView.vue`：

```vue
<script setup lang="ts">
import { Video } from 'lucide-vue-next'
import { ref } from 'vue'
import BaseTabs from '@/components/base/BaseTabs.vue'
import BrandPanel from '@/components/sections/auth/BrandPanel.vue'
import LoginForm from '@/components/sections/auth/LoginForm.vue'
import RegisterForm from '@/components/sections/auth/RegisterForm.vue'

const activeTab = ref('login')
const tabs = [{ value: 'login', label: '登录' }, { value: 'register', label: '注册' }]
</script>

<template>
  <div data-testid="auth-view" class="flex min-h-screen"><BrandPanel /><section class="flex flex-1 items-center justify-center bg-gray-50 p-8"><div class="w-full max-w-md"><div class="mb-8 flex items-center justify-center gap-2 lg:hidden"><Video class="h-8 w-8 text-blue-600" /><span class="text-2xl font-bold">影像创作者</span></div><BaseTabs v-model="activeTab" :tabs="tabs"><template #default="{ active: currentTab }"><div class="mt-8"><LoginForm v-if="currentTab === 'login'" /><RegisterForm v-else /></div></template></BaseTabs><div class="mt-8 text-center"><RouterLink to="/" class="text-sm text-gray-600 hover:text-gray-800">← 返回首页</RouterLink></div></div></section></div>
</template>
```

- [ ] **步骤 7：运行认证页面测试和全量验证**

```bash
npm test -- tests/views/auth-view.test.ts
npm test
npm run type-check
```

预期：认证页面测试 2 个通过；当前全部测试通过；类型检查退出码为 0。

- [ ] **步骤 8：提交认证页面**

```bash
git add pbw-web-frontend/src/components/sections/auth pbw-web-frontend/src/views/AuthView.vue pbw-web-frontend/tests/views/auth-view.test.ts
git diff --cached --check
git commit -m "feat: 复刻登录注册页面"
```

---

### 任务 15：完成集成验证与双端视觉验收

**文件：**
- 创建：`pbw-web-frontend/tests/integration/page-routes.test.ts`

- [ ] **步骤 1：编写五个完整路由的集成测试**

创建 `pbw-web-frontend/tests/integration/page-routes.test.ts`：

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { createAppRouter } from '@/router'

describe('完整页面路由', () => {
  it.each([
    ['/', '用剪辑重构影像记忆'],
    ['/services', '课程体系'],
    ['/consulting', '商业剪辑服务'],
    ['/about', '成长里程碑'],
    ['/login', '欢迎回来'],
  ])('%s 渲染核心内容', async (path, expectedText) => {
    const router = createAppRouter(createMemoryHistory())
    await router.push(path)
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [createPinia(), router] } })
    await flushPromises()

    expect(wrapper.text()).toContain(expectedText)
    wrapper.unmount()
  })
})
```

- [ ] **步骤 2：运行集成测试确认当前状态**

```bash
npm test -- tests/integration/page-routes.test.ts
```

预期：5 个测试通过。如果任何路由失败，先修复对应页面并重新运行该测试；不要跳过失败测试。

- [ ] **步骤 3：运行完整自动化验证**

显式调用 `verification-before-completion`，然后运行：

```bash
npm test
npm run type-check
npm run build
```

预期：

- Vitest 输出全部测试通过，0 个失败。
- `vue-tsc` 退出码为 0。
- Vite 构建退出码为 0，并生成 `pbw-web-frontend/dist/`。

- [ ] **步骤 4：启动 Vue 页面与 React 原型**

终端 A：

```bash
cd pbw-web-frontend
npm run dev -- --host 127.0.0.1
```

终端 B：

```bash
cd ui-figma
npm run dev -- --host 127.0.0.1
```

预期：两个 Vite 服务均启动成功。记录各自输出的实际本地端口，不假定端口固定。

- [ ] **步骤 5：执行桌面端视觉对比**

显式调用 `browser:control-in-app-browser`，在 `1440 × 900` 下逐页打开 Vue 页面和 React 原型，并按下表核对首屏与全页：

| 路由 | 必须一致的关键点 |
| --- | --- |
| `/` | 64px 导航、全屏 Hero、标题与统计三列、视频双栏、素材四栏、矩阵四栏、页脚 |
| `/services` | 蓝紫 Hero、课程双栏、上下线状态、课程 CTA |
| `/consulting` | 紫粉 Hero、四张服务卡、四步流程、三张案例 |
| `/about` | 作者双栏、三项统计、交错时间线、幕后三区、联系双栏 |
| `/login` | 左右分屏、品牌统计、登录/注册页签、表单卡片 |

预期：无区块缺失；容器宽度、间距、文字层级、渐变、圆角和阴影与原型一致。浏览器字体抗锯齿和亚像素舍入差异不判为失败。

- [ ] **步骤 6：执行移动端视觉对比**

在 `390 × 844` 下重复五个路由，逐项确认：

- 导航只显示 Logo 和菜单按钮，菜单展开后包含四个导航项及登录入口。
- 首页 Hero 文案不溢出，统计保持三列，后续卡片均为单列。
- 服务、咨询和关于页没有横向滚动条。
- 关于页作者图片和卡片保持在 390px 视口内。
- 登录页隐藏左侧品牌面板，表单卡片与原型对齐。
- 页签、弹窗、移动菜单和密码显隐均可展示。

预期：`document.documentElement.scrollWidth === window.innerWidth`；五个路由均无横向溢出。

- [ ] **步骤 7：若视觉对比失败，按页面执行最小修正**

每个差异必须记录为“路由 + 视口 + 元素 + 原型值 + 当前值”，例如：

```text
/about | 390×844 | 作者图片宽度 | 原型 320px | 当前 352px
```

只修改该元素所属组件，重新运行对应页面测试、`npm run type-check`，并重新截图。禁止用全局 CSS 覆盖掩盖单页问题。

- [ ] **步骤 8：运行最终验证并提交集成测试**

```bash
npm test
npm run type-check
npm run build
git add pbw-web-frontend
git diff --cached --check
git status --short
```

预期：测试、类型检查、构建和差异检查均退出码 0；暂存区只包含 `pbw-web-frontend/` 本任务文件，不包含 `ui-figma/`、`database.sql`、`.superpowers/` 或其他用户未跟踪内容。

提交前向用户展示暂存变更摘要，然后提交：

```bash
git commit -m "test: 完成用户端页面集成验收"
```

---

## 规格覆盖核对

| 规格要求 | 对应任务 |
| --- | --- |
| Vue 3、TypeScript、Vite、Tailwind CSS 4 | 任务 1 |
| 数据库实体与驼峰字段 | 任务 2、任务 3 |
| 原型额外字段进入展示配置 | 任务 4、任务 5 |
| Service、Pinia 和 mock 异步数据流 | 任务 5、任务 6 |
| 独立 `api/` 与 axios | 任务 7 |
| 公共基础组件 | 任务 8 |
| Vue Router、导航、页脚和布局 | 任务 9 |
| 首页一比一复刻 | 任务 10 |
| 服务页面一比一复刻 | 任务 11 |
| 商业咨询页面一比一复刻 | 任务 12 |
| 关于我页面一比一复刻 | 任务 13 |
| 登录/注册页面一比一复刻 | 任务 14 |
| 密码不进入用户资料和 mock | 任务 2、任务 3、任务 7 |
| 桌面端与移动端视觉验收 | 任务 15 |
| 自动化测试、类型检查和生产构建 | 每个任务的验证步骤、任务 15 |

## 执行规则

1. 开始执行前显式调用 `using-git-worktrees`，在隔离 worktree 中工作；原始工作区中的 `database.sql` 和 `ui-figma/` 仅作为只读参考。
2. 每次调用 skill 时，在对话中显示 skill 名称与调用用途。
3. 每个功能任务遵循 `test-driven-development`：先写失败测试，确认失败，再写最小实现并确认通过。
4. 每次提交前向用户展示将要提交的变更摘要，commit message 使用简洁中文。
5. 不执行删除文件、修改 `.env`、修改密钥、修改 CI/CD、`git push`、`git rebase`、`git reset --hard` 或生产发布。
6. 不修改 `ui-figma/` 和 `database.sql`；它们是只读输入。
7. 不把 `.superpowers/` 视觉伴侣文件纳入实现提交。
8. 每次声称任务完成前显式调用 `verification-before-completion` 并提供新鲜验证输出。
