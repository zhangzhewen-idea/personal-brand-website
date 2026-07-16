# pbw-admin-frontend 后台管理前端实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在 `pbw-admin-frontend/` 中创建 Vue 3 后台管理工程，使用数据库对应的驼峰 mock 数据实现登录、工作台、六类管理页面，以及五类列表数据的本地删除。

**架构：** 页面和组件只消费 Pinia Store；Store 调用 Service；Service 通过 Repository 接口访问当前异步内存 mock，未来可替换为独立 `api/` 目录中的 axios 模块。登录会话、领域模型、DTO mapper、页面状态和数据源各自保持独立边界。

**技术栈：** Vue 3、TypeScript、Vue Router、Pinia、Element Plus、axios、Vite、Vitest、Vue Test Utils、vue-tsc。

**设计规格：** `docs/superpowers/specs/2026-07-16-pbw-admin-frontend-design.md`

---

## 实施约束

- 严格按 TDD 执行：每项行为先写测试并确认因功能缺失而失败，再编写最少实现。
- 工程配置和生成型入口文件不承载业务行为；业务函数、Store、Service、Repository 和组件交互必须测试先行。
- 不修改 `.env`、密钥、CI/CD 配置，不执行部署或发布。
- 不删除 `pbw-admin-frontend/.vite/`；通过 `.gitignore` 忽略现有缓存。
- 当前只实现删除数据修改；新增、编辑、详情提交、查询和分页只呈现原型控件。
- 用户模型和会话不得包含数据库明文 `password`。
- 所有 commit 只包含当前任务文件，commit message 使用简洁中文。

## 文件结构与职责

### 工程基础

- 修改：`.gitignore`——追加 Vue、Vite、测试和覆盖率忽略规则。
- 创建：`pbw-admin-frontend/package.json`——依赖与 npm 脚本。
- 创建：`pbw-admin-frontend/index.html`——Vite HTML 入口。
- 创建：`pbw-admin-frontend/vite.config.ts`——Vue、路径别名和 Vitest 配置。
- 创建：`pbw-admin-frontend/tsconfig.json`——TypeScript 项目引用。
- 创建：`pbw-admin-frontend/tsconfig.app.json`——应用类型配置。
- 创建：`pbw-admin-frontend/tsconfig.node.json`——Vite 配置类型。
- 创建：`pbw-admin-frontend/src/env.d.ts`——Vite 类型声明。
- 创建：`pbw-admin-frontend/src/main.ts`——Vue、Pinia、Router、Element Plus 和全局样式入口。
- 创建：`pbw-admin-frontend/src/App.vue`——顶层路由出口。
- 创建：`pbw-admin-frontend/src/styles/index.css`——全局视觉变量和基础样式。
- 创建：`pbw-admin-frontend/tests/setup.ts`——Element Plus 与浏览器 API 测试环境。

### 模型、DTO 与映射

- 创建：`pbw-admin-frontend/src/models/entities.ts`——六类数据库领域模型。
- 创建：`pbw-admin-frontend/src/models/auth.ts`——认证输入和安全会话模型。
- 创建：`pbw-admin-frontend/src/models/dashboard.ts`——工作台聚合模型。
- 创建：`pbw-admin-frontend/src/api/dto/entities.dto.ts`——下划线 DTO 类型。
- 创建：`pbw-admin-frontend/src/api/mappers/entities.mapper.ts`——DTO 到驼峰领域模型转换。
- 创建：`pbw-admin-frontend/src/utils/formatters.ts`——金额、日期和大数字格式化。

### Repository、Mock 与 API

- 创建：`pbw-admin-frontend/src/repositories/contracts.ts`——数据访问接口。
- 创建：`pbw-admin-frontend/src/mocks/data/database.mock.ts`——与 SQL 示例一致的驼峰数据。
- 创建：`pbw-admin-frontend/src/mocks/repositories/memory.repository.ts`——异步内存 Repository 工厂。
- 创建：`pbw-admin-frontend/src/mocks/repositories/index.ts`——六类 mock Repository 实例。
- 创建：`pbw-admin-frontend/src/api/http.ts`——axios 实例和错误标准化。
- 创建：`pbw-admin-frontend/src/api/endpoints.ts`——接口路径常量。
- 创建：`pbw-admin-frontend/src/api/modules/crud.api.ts`——通用 CRUD API 工厂。
- 创建：`pbw-admin-frontend/src/api/modules/index.ts`——六类 API 模块。

### Service 与状态

- 创建：`pbw-admin-frontend/src/services/app-error.ts`——统一应用错误。
- 创建：`pbw-admin-frontend/src/services/auth.service.ts`——测试登录和会话服务。
- 创建：`pbw-admin-frontend/src/services/entity.service.ts`——列表读取与删除服务。
- 创建：`pbw-admin-frontend/src/services/dashboard.service.ts`——工作台聚合。
- 创建：`pbw-admin-frontend/src/stores/auth.store.ts`——认证状态。
- 创建：`pbw-admin-frontend/src/stores/entity-list.store.ts`——列表 Store 工厂。
- 创建：`pbw-admin-frontend/src/stores/dashboard.store.ts`——工作台状态。
- 创建：`pbw-admin-frontend/src/stores/entities.ts`——用户、视频、素材、矩阵和课程 Store。

### 路由、布局与页面

- 创建：`pbw-admin-frontend/src/router/index.ts`——路由和认证守卫。
- 创建：`pbw-admin-frontend/src/components/layout/AdminLayout.vue`——后台整体布局。
- 创建：`pbw-admin-frontend/src/components/layout/AdminSidebar.vue`——菜单与移动端抽屉。
- 创建：`pbw-admin-frontend/src/components/layout/AdminHeader.vue`——顶栏和退出入口。
- 创建：`pbw-admin-frontend/src/components/common/PageHeader.vue`——页面标题和操作区。
- 创建：`pbw-admin-frontend/src/components/common/ListToolbar.vue`——查询控件原型。
- 创建：`pbw-admin-frontend/src/components/common/DataTableCard.vue`——表格、空状态和分页容器。
- 创建：`pbw-admin-frontend/src/components/common/DeleteAction.vue`——删除确认与提交状态。
- 创建：`pbw-admin-frontend/src/components/common/MediaThumbnail.vue`——媒体缩略图和失败占位。
- 创建：`pbw-admin-frontend/src/views/auth/LoginView.vue`——管理员登录。
- 创建：`pbw-admin-frontend/src/views/dashboard/DashboardView.vue`——首页工作台。
- 创建：`pbw-admin-frontend/src/views/users/UserListView.vue`——用户管理。
- 创建：`pbw-admin-frontend/src/views/content/BasicInfoView.vue`——基本信息。
- 创建：`pbw-admin-frontend/src/views/content/VideoListView.vue`——视频管理。
- 创建：`pbw-admin-frontend/src/views/content/MaterialListView.vue`——素材管理。
- 创建：`pbw-admin-frontend/src/views/content/MatrixAccountListView.vue`——矩阵账号。
- 创建：`pbw-admin-frontend/src/views/content/CourseListView.vue`——课程管理。

### 测试

- 创建：`pbw-admin-frontend/tests/` 下的应用外壳、mapper、Repository、Service、Store、路由、共享组件和页面测试。

---

### 任务 1：初始化 Vue、Element Plus 和测试工程

**文件：**
- 修改：`.gitignore`
- 创建：`pbw-admin-frontend/package.json`
- 创建：`pbw-admin-frontend/index.html`
- 创建：`pbw-admin-frontend/vite.config.ts`
- 创建：`pbw-admin-frontend/tsconfig.json`
- 创建：`pbw-admin-frontend/tsconfig.app.json`
- 创建：`pbw-admin-frontend/tsconfig.node.json`
- 创建：`pbw-admin-frontend/src/env.d.ts`
- 创建：`pbw-admin-frontend/src/App.vue`
- 创建：`pbw-admin-frontend/src/styles/index.css`
- 创建：`pbw-admin-frontend/tests/setup.ts`
- 测试：`pbw-admin-frontend/tests/app-shell.test.ts`

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

保留现有 Maven、IDE 和 Java 规则，不重写原内容。

- [ ] **步骤 2：创建 package.json 并安装依赖**

创建 `pbw-admin-frontend/package.json`：

```json
{
  "name": "pbw-admin-frontend",
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
cd pbw-admin-frontend
npm install vue@3 vue-router@4 pinia element-plus @element-plus/icons-vue axios
npm install -D vite @vitejs/plugin-vue typescript vue-tsc @types/node vitest @vue/test-utils jsdom
```

预期：生成 `package-lock.json`，两条安装命令退出码均为 0。

- [ ] **步骤 3：创建 Vite、TypeScript、HTML 和测试配置**

创建 `pbw-admin-frontend/index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="PBW 个人品牌网站后台管理系统" />
    <title>PBW Admin</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

创建 `pbw-admin-frontend/vite.config.ts`：

```ts
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
  },
})
```

创建 `pbw-admin-frontend/tsconfig.json`：

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

创建 `pbw-admin-frontend/tsconfig.app.json`：

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

创建 `pbw-admin-frontend/tsconfig.node.json`：

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

创建 `pbw-admin-frontend/src/env.d.ts`：

```ts
/// <reference types="vite/client" />
```

创建 `pbw-admin-frontend/tests/setup.ts`：

```ts
import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'

config.global.plugins = [ElementPlus]

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub as typeof ResizeObserver
```

- [ ] **步骤 4：先编写失败的应用外壳测试**

创建 `pbw-admin-frontend/tests/app-shell.test.ts`：

```ts
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  it('提供后台应用路由出口', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: { template: '<main data-testid="router-view" />' },
        },
      },
    })

    expect(wrapper.get('[data-testid="app-shell"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="router-view"]').exists()).toBe(true)
  })
})
```

- [ ] **步骤 5：运行测试验证失败**

运行：

```bash
npm test -- tests/app-shell.test.ts
```

预期：FAIL，提示无法解析 `@/App.vue` 或找不到 `data-testid="app-shell"`。

- [ ] **步骤 6：创建最小应用外壳与全局样式**

创建 `pbw-admin-frontend/src/App.vue`：

```vue
<template>
  <div data-testid="app-shell">
    <RouterView />
  </div>
</template>
```

创建 `pbw-admin-frontend/src/styles/index.css`：

```css
:root {
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #172033;
  background: #f4f6fa;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --pbw-primary: #5b73f2;
  --pbw-sidebar: #111827;
  --pbw-page: #f4f6fa;
  --pbw-card: #ffffff;
  --pbw-text: #172033;
  --pbw-muted: #7c8799;
  --pbw-border: #e7ebf1;
  --el-color-primary: #5b73f2;
  --el-border-radius-base: 8px;
}

* { box-sizing: border-box; }
html, body, #app { min-width: 320px; min-height: 100%; margin: 0; }
body { min-height: 100vh; background: var(--pbw-page); }
button, input, textarea, select { font: inherit; }
```

- [ ] **步骤 7：运行测试验证通过**

运行：

```bash
npm test -- tests/app-shell.test.ts
```

预期：PASS，1 个测试通过且无警告。

- [ ] **步骤 8：提交工程基础**

提交前展示 `.gitignore`、`pbw-admin-frontend/package*.json`、配置文件、应用外壳和测试摘要，运行 `git diff --cached --check`，然后提交：

```bash
git add .gitignore pbw-admin-frontend
git commit -m "chore: 初始化后台前端工程"
```

---

### 任务 2：建立数据库领域模型与字段 mapper

**文件：**
- 创建：`pbw-admin-frontend/src/models/entities.ts`
- 创建：`pbw-admin-frontend/src/api/dto/entities.dto.ts`
- 创建：`pbw-admin-frontend/src/api/mappers/entities.mapper.ts`
- 测试：`pbw-admin-frontend/tests/api/entities.mapper.test.ts`

- [ ] **步骤 1：先编写失败的 mapper 测试**

创建 `pbw-admin-frontend/tests/api/entities.mapper.test.ts`：

```ts
import {
  mapBasicInfoDto,
  mapCourseDto,
  mapMaterialDto,
  mapMatrixAccountDto,
  mapUserDto,
  mapVideoDto,
} from '@/api/mappers/entities.mapper'

describe('数据库 DTO mapper', () => {
  it('将基本信息 JSON 与布尔字段转换为驼峰领域模型', () => {
    const result = mapBasicInfoDto({
      id: 1,
      home_cover_video: null,
      contact_email: 'contact@example.com',
      contact_qr_code: null,
      total_play_count: 12800000,
      total_like_count: 860000,
      total_follower_count: 240000,
      author_identity_tag: '电影解说创作者 / 剪辑师',
      slogan: '用镜头拆解故事',
      creation_attitude: '先理解，再表达；先克制，再准确。',
      author_photo: null,
      editing_desk_work_photo: null,
      asset_library_screenshot: null,
      daily_movie_watching_photo: null,
      annual_top_10_films: '["《奥本海默》","《爱乐之城》"]',
      influential_three_directors: '["希区柯克","诺兰"]',
      contact_info: '微信：brandstudio01',
      create_time: '2026-07-16 10:00:00',
      update_time: '2026-07-16 10:00:00',
      is_deleted: 0,
    })

    expect(result.annualTop10Films).toEqual(['《奥本海默》', '《爱乐之城》'])
    expect(result.influentialThreeDirectors).toEqual(['希区柯克', '诺兰'])
    expect(result.isDeleted).toBe(false)
    expect(result.contactEmail).toBe('contact@example.com')
  })

  it('映射五类列表 DTO 且不把密码带入用户模型', () => {
    const user = mapUserDto({
      id: 1,
      nickname: '管理员',
      account: 'admin',
      password: '123456',
      email: 'admin@example.com',
      avatar: null,
      role: '管理员',
      create_time: '2026-07-16 10:00:00',
      update_time: '2026-07-16 10:00:00',
      is_deleted: 0,
    })

    expect(user).not.toHaveProperty('password')
    expect(mapVideoDto({ id: 1, video_title: '标题', video_intro: null, video_url: '/v.mp4', video_cover: null, create_time: 'c', update_time: 'u', is_deleted: 0 }).videoTitle).toBe('标题')
    expect(mapMaterialDto({ id: 1, material_title: '素材', material_photo: null, material_intro: null, price: '39.90', netdisk_url: null, create_time: 'c', update_time: 'u', is_deleted: 0 }).price).toBe(39.9)
    expect(mapMatrixAccountDto({ id: 1, platform_name: 'B站', platform_logo: null, account_url: null, intro: null, create_time: 'c', update_time: 'u', is_deleted: 0 }).platformName).toBe('B站')
    expect(mapCourseDto({ id: 1, course_name: '课程', course_tag: null, course_intro: null, course_price: '199.00', is_online: 1, create_time: 'c', update_time: 'u', is_deleted: 0 }).isOnline).toBe(true)
  })
})
```

- [ ] **步骤 2：运行测试验证失败**

运行：

```bash
npm test -- tests/api/entities.mapper.test.ts
```

预期：FAIL，提示找不到 `entities.mapper` 或导出的 mapper。

- [ ] **步骤 3：创建完整领域模型**

创建 `pbw-admin-frontend/src/models/entities.ts`：

```ts
export interface AuditFields {
  id: number
  createTime: string
  updateTime: string
  isDeleted: boolean
}

export interface BasicInfo extends AuditFields {
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

export interface Video extends AuditFields {
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
}

export interface MaterialLibraryItem extends AuditFields {
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  netdiskUrl: string | null
}

export interface MatrixAccount extends AuditFields {
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
}

export interface Course extends AuditFields {
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
}

export type UserRole = '用户' | '管理员'

export interface UserProfile extends AuditFields {
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: UserRole
}
```

创建 `pbw-admin-frontend/src/api/dto/entities.dto.ts`：

```ts
export interface AuditDto {
  id: number
  create_time: string
  update_time: string
  is_deleted: 0 | 1
}

export interface BasicInfoDto extends AuditDto {
  home_cover_video: string | null
  contact_email: string | null
  contact_qr_code: string | null
  total_play_count: number
  total_like_count: number
  total_follower_count: number
  author_identity_tag: string | null
  slogan: string | null
  creation_attitude: string | null
  author_photo: string | null
  editing_desk_work_photo: string | null
  asset_library_screenshot: string | null
  daily_movie_watching_photo: string | null
  annual_top_10_films: string | string[] | null
  influential_three_directors: string | string[] | null
  contact_info: string | null
}

export interface VideoDto extends AuditDto {
  video_title: string
  video_intro: string | null
  video_url: string
  video_cover: string | null
}

export interface MaterialDto extends AuditDto {
  material_title: string
  material_photo: string | null
  material_intro: string | null
  price: number | string
  netdisk_url: string | null
}

export interface MatrixAccountDto extends AuditDto {
  platform_name: string
  platform_logo: string | null
  account_url: string | null
  intro: string | null
}

export interface CourseDto extends AuditDto {
  course_name: string
  course_tag: string | null
  course_intro: string | null
  course_price: number | string
  is_online: 0 | 1
}

export interface UserDto extends AuditDto {
  nickname: string
  account: string
  password?: string
  email: string | null
  avatar: string | null
  role: '用户' | '管理员'
}
```

- [ ] **步骤 4：实现最少 mapper**

创建 `pbw-admin-frontend/src/api/mappers/entities.mapper.ts`：

```ts
import type {
  BasicInfoDto,
  CourseDto,
  MaterialDto,
  MatrixAccountDto,
  UserDto,
  VideoDto,
} from '@/api/dto/entities.dto'
import type {
  BasicInfo,
  Course,
  MaterialLibraryItem,
  MatrixAccount,
  UserProfile,
  Video,
} from '@/models/entities'

const audit = (dto: { id: number; create_time: string; update_time: string; is_deleted: 0 | 1 }) => ({
  id: dto.id,
  createTime: dto.create_time,
  updateTime: dto.update_time,
  isDeleted: dto.is_deleted === 1,
})

const stringArray = (value: string | string[] | null): string[] => {
  if (Array.isArray(value)) return value
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : []
  } catch {
    return []
  }
}

export const mapBasicInfoDto = (dto: BasicInfoDto): BasicInfo => ({
  ...audit(dto),
  homeCoverVideo: dto.home_cover_video,
  contactEmail: dto.contact_email,
  contactQrCode: dto.contact_qr_code,
  totalPlayCount: dto.total_play_count,
  totalLikeCount: dto.total_like_count,
  totalFollowerCount: dto.total_follower_count,
  authorIdentityTag: dto.author_identity_tag,
  slogan: dto.slogan,
  creationAttitude: dto.creation_attitude,
  authorPhoto: dto.author_photo,
  editingDeskWorkPhoto: dto.editing_desk_work_photo,
  assetLibraryScreenshot: dto.asset_library_screenshot,
  dailyMovieWatchingPhoto: dto.daily_movie_watching_photo,
  annualTop10Films: stringArray(dto.annual_top_10_films),
  influentialThreeDirectors: stringArray(dto.influential_three_directors),
  contactInfo: dto.contact_info,
})

export const mapVideoDto = (dto: VideoDto): Video => ({ ...audit(dto), videoTitle: dto.video_title, videoIntro: dto.video_intro, videoUrl: dto.video_url, videoCover: dto.video_cover })
export const mapMaterialDto = (dto: MaterialDto): MaterialLibraryItem => ({ ...audit(dto), materialTitle: dto.material_title, materialPhoto: dto.material_photo, materialIntro: dto.material_intro, price: Number(dto.price), netdiskUrl: dto.netdisk_url })
export const mapMatrixAccountDto = (dto: MatrixAccountDto): MatrixAccount => ({ ...audit(dto), platformName: dto.platform_name, platformLogo: dto.platform_logo, accountUrl: dto.account_url, intro: dto.intro })
export const mapCourseDto = (dto: CourseDto): Course => ({ ...audit(dto), courseName: dto.course_name, courseTag: dto.course_tag, courseIntro: dto.course_intro, coursePrice: Number(dto.course_price), isOnline: dto.is_online === 1 })
export const mapUserDto = (dto: UserDto): UserProfile => ({ ...audit(dto), nickname: dto.nickname, account: dto.account, email: dto.email, avatar: dto.avatar, role: dto.role })
```

- [ ] **步骤 5：运行 mapper 测试验证通过**

运行：

```bash
npm test -- tests/api/entities.mapper.test.ts
```

预期：PASS，2 个测试通过。

- [ ] **步骤 6：提交模型与映射**

```bash
git add pbw-admin-frontend/src/models pbw-admin-frontend/src/api/dto pbw-admin-frontend/src/api/mappers pbw-admin-frontend/tests/api
git commit -m "feat: 建立后台数据模型"
```

---

### 任务 3：建立 mock 数据与可删除内存 Repository

**文件：**
- 创建：`pbw-admin-frontend/src/repositories/contracts.ts`
- 创建：`pbw-admin-frontend/src/mocks/data/database.mock.ts`
- 创建：`pbw-admin-frontend/src/mocks/repositories/memory.repository.ts`
- 创建：`pbw-admin-frontend/src/mocks/repositories/index.ts`
- 测试：`pbw-admin-frontend/tests/mocks/memory.repository.test.ts`
- 测试：`pbw-admin-frontend/tests/mocks/database.mock.test.ts`

- [ ] **步骤 1：先编写失败的 Repository 测试**

创建 `pbw-admin-frontend/tests/mocks/memory.repository.test.ts`：

```ts
import { createMemoryRepository } from '@/mocks/repositories/memory.repository'

describe('MemoryRepository', () => {
  it('返回副本并支持按 id 删除', async () => {
    const repository = createMemoryRepository([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])

    expect(await repository.list()).toHaveLength(2)
    await repository.remove(1)
    expect(await repository.list()).toEqual([{ id: 2, name: 'B' }])
  })

  it('删除不存在记录时抛出明确错误，reset 后恢复初始数据', async () => {
    const repository = createMemoryRepository([{ id: 1, name: 'A' }])

    await expect(repository.remove(99)).rejects.toThrow('记录不存在')
    await repository.remove(1)
    repository.reset()
    expect(await repository.list()).toEqual([{ id: 1, name: 'A' }])
  })
})
```

创建 `pbw-admin-frontend/tests/mocks/database.mock.test.ts`：

```ts
import {
  basicInfoMock,
  coursesMock,
  materialsMock,
  matrixAccountsMock,
  usersMock,
  videosMock,
} from '@/mocks/data/database.mock'

describe('database mock', () => {
  it('保持 database.sql 的示例规模和安全用户结构', () => {
    expect(basicInfoMock.id).toBe(1)
    expect(videosMock).toHaveLength(3)
    expect(materialsMock).toHaveLength(3)
    expect(matrixAccountsMock).toHaveLength(3)
    expect(coursesMock).toHaveLength(3)
    expect(usersMock).toHaveLength(3)
    expect(usersMock[0]).not.toHaveProperty('password')
  })
})
```

- [ ] **步骤 2：运行测试验证失败**

运行：

```bash
npm test -- tests/mocks
```

预期：FAIL，提示找不到 mock 与 Repository 模块。

- [ ] **步骤 3：创建 Repository 契约与内存实现**

创建 `pbw-admin-frontend/src/repositories/contracts.ts`：

```ts
export interface ListRepository<T extends { id: number }> {
  list(): Promise<T[]>
  remove(id: number): Promise<void>
}

export interface SingletonRepository<T> {
  get(): Promise<T>
}

export interface ResettableRepository {
  reset(): void
}
```

创建 `pbw-admin-frontend/src/mocks/repositories/memory.repository.ts`：

```ts
import type { ListRepository, ResettableRepository } from '@/repositories/contracts'

const clone = <T>(value: T): T => structuredClone(value)

export const createMemoryRepository = <T extends { id: number }>(seed: T[]): ListRepository<T> & ResettableRepository => {
  let records = clone(seed)

  return {
    async list() {
      return clone(records)
    },
    async remove(id: number) {
      const exists = records.some((item) => item.id === id)
      if (!exists) throw new Error('记录不存在')
      records = records.filter((item) => item.id !== id)
    },
    reset() {
      records = clone(seed)
    },
  }
}
```

- [ ] **步骤 4：创建与 SQL 一致的驼峰 mock 数据**

创建 `pbw-admin-frontend/src/mocks/data/database.mock.ts`：

```ts
import type { BasicInfo, Course, MaterialLibraryItem, MatrixAccount, UserProfile, Video } from '@/models/entities'

const audit = { createTime: '2026-07-16 10:00:00', updateTime: '2026-07-16 10:00:00', isDeleted: false }

export const basicInfoMock: BasicInfo = {
  id: 1,
  homeCoverVideo: 'https://cdn.example.com/videos/home-cover-1.mp4',
  contactEmail: 'contact@example.com',
  contactQrCode: 'https://cdn.example.com/qrcode/contact-qr-1.png',
  totalPlayCount: 12800000,
  totalLikeCount: 860000,
  totalFollowerCount: 240000,
  authorIdentityTag: '电影解说创作者 / 剪辑师',
  slogan: '用镜头拆解故事',
  creationAttitude: '先理解，再表达；先克制，再准确。',
  authorPhoto: 'https://cdn.example.com/images/author-photo-1.jpg',
  editingDeskWorkPhoto: 'https://cdn.example.com/images/editing-desk-1.jpg',
  assetLibraryScreenshot: 'https://cdn.example.com/images/asset-library-1.jpg',
  dailyMovieWatchingPhoto: 'https://cdn.example.com/images/daily-movie-1.jpg',
  annualTop10Films: ['《奥本海默》', '《爱乐之城》', '《燃烧女子的肖像》', '《敦刻尔克》', '《寄生虫》'],
  influentialThreeDirectors: ['希区柯克', '诺兰', '是枝裕和'],
  contactInfo: '微信：brandstudio01',
  ...audit,
}

export const videosMock: Video[] = [
  { id: 1, videoTitle: '为什么这部电影能封神', videoIntro: '从叙事结构、镜头语言和人物动机三个角度拆解。', videoUrl: 'https://cdn.example.com/videos/video-1.mp4', videoCover: 'https://cdn.example.com/covers/video-cover-1.jpg', ...audit },
  { id: 2, videoTitle: '三分钟看懂角色弧光', videoIntro: '用一个完整案例讲清角色变化如何服务主题表达。', videoUrl: 'https://cdn.example.com/videos/video-2.mp4', videoCover: 'https://cdn.example.com/covers/video-cover-2.jpg', ...audit },
  { id: 3, videoTitle: '我最常用的剪辑节奏模板', videoIntro: '分享节奏控制、转场和音效搭配的常用方法。', videoUrl: 'https://cdn.example.com/videos/video-3.mp4', videoCover: 'https://cdn.example.com/covers/video-cover-3.jpg', ...audit },
]

export const materialsMock: MaterialLibraryItem[] = [
  { id: 1, materialTitle: '电影海报素材包', materialPhoto: 'https://cdn.example.com/materials/poster-pack.jpg', materialIntro: '适合电影解说封面、分镜展示和宣传页使用。', price: 39.9, netdiskUrl: 'https://pan.example.com/s/abcd1234', ...audit },
  { id: 2, materialTitle: '转场动效合集', materialPhoto: 'https://cdn.example.com/materials/transition-pack.jpg', materialIntro: '包含 100+ 常用转场，适合短视频快节奏剪辑。', price: 59, netdiskUrl: 'https://pan.example.com/s/efgh5678', ...audit },
  { id: 3, materialTitle: '字幕样式模板', materialPhoto: 'https://cdn.example.com/materials/subtitle-pack.jpg', materialIntro: '适合打造统一视觉风格的片头字幕与重点标注。', price: 29, netdiskUrl: 'https://pan.example.com/s/ijkl9012', ...audit },
]

export const matrixAccountsMock: MatrixAccount[] = [
  { id: 1, platformName: '抖音', platformLogo: 'https://cdn.example.com/logos/douyin.png', accountUrl: 'https://www.douyin.com/user/example', intro: '主阵地账号，更新电影解说和剪辑技巧内容。', ...audit },
  { id: 2, platformName: 'B站', platformLogo: 'https://cdn.example.com/logos/bilibili.png', accountUrl: 'https://space.bilibili.com/example', intro: '偏长内容与系列化专题，适合深度解析。', ...audit },
  { id: 3, platformName: '小红书', platformLogo: 'https://cdn.example.com/logos/xiaohongshu.png', accountUrl: 'https://www.xiaohongshu.com/user/profile/example', intro: '偏图文和短视频种草，展示幕后和素材整理。', ...audit },
]

export const coursesMock: Course[] = [
  { id: 1, courseName: '电影解说入门课', courseTag: '剪辑 / 解说 / 表达', courseIntro: '从选题、脚本到剪辑节奏，完整覆盖入门流程。', coursePrice: 199, isOnline: true, ...audit },
  { id: 2, courseName: '短视频剪辑实战课', courseTag: '转场 / 节奏 / 音效', courseIntro: '围绕短视频制作效率和画面张力，给出实操方法。', coursePrice: 299, isOnline: true, ...audit },
  { id: 3, courseName: '账号内容增长课', courseTag: '选题 / 复盘 / 增长', courseIntro: '帮助创作者建立稳定更新和数据复盘机制。', coursePrice: 399, isOnline: false, ...audit },
]

export const usersMock: UserProfile[] = [
  { id: 1, nickname: '管理员', account: 'admin', email: 'admin@example.com', avatar: 'https://cdn.example.com/avatars/admin.jpg', role: '管理员', ...audit },
  { id: 2, nickname: 'movie_fan', account: 'movie_fan', email: 'moviefan@example.com', avatar: 'https://cdn.example.com/avatars/user-1.jpg', role: '用户', ...audit },
  { id: 3, nickname: 'editor_life', account: 'editor_life', email: 'editorlife@example.com', avatar: 'https://cdn.example.com/avatars/user-2.jpg', role: '用户', ...audit },
]
```

- [ ] **步骤 5：创建六类 Repository 实例**

创建 `pbw-admin-frontend/src/mocks/repositories/index.ts`：

```ts
import { basicInfoMock, coursesMock, materialsMock, matrixAccountsMock, usersMock, videosMock } from '@/mocks/data/database.mock'
import { createMemoryRepository } from '@/mocks/repositories/memory.repository'
import type { SingletonRepository } from '@/repositories/contracts'

export const basicInfoRepository: SingletonRepository<typeof basicInfoMock> = {
  async get() {
    return structuredClone(basicInfoMock)
  },
}

export const userRepository = createMemoryRepository(usersMock)
export const videoRepository = createMemoryRepository(videosMock)
export const materialRepository = createMemoryRepository(materialsMock)
export const matrixAccountRepository = createMemoryRepository(matrixAccountsMock)
export const courseRepository = createMemoryRepository(coursesMock)
```

- [ ] **步骤 6：运行 mock 测试验证通过**

运行：

```bash
npm test -- tests/mocks
```

预期：PASS，3 个测试通过。

- [ ] **步骤 7：提交 mock 数据层**

```bash
git add pbw-admin-frontend/src/repositories pbw-admin-frontend/src/mocks pbw-admin-frontend/tests/mocks
git commit -m "feat: 建立后台模拟数据层"
```

---

### 任务 4：建立独立 axios API 边界

**文件：**
- 创建：`pbw-admin-frontend/src/api/http.ts`
- 创建：`pbw-admin-frontend/src/api/endpoints.ts`
- 创建：`pbw-admin-frontend/src/api/modules/crud.api.ts`
- 创建：`pbw-admin-frontend/src/api/modules/index.ts`
- 测试：`pbw-admin-frontend/tests/api/http.test.ts`

- [ ] **步骤 1：先编写失败的 HTTP 错误标准化测试**

创建 `pbw-admin-frontend/tests/api/http.test.ts`：

```ts
import { normalizeHttpError } from '@/api/http'

describe('HTTP error', () => {
  it('优先使用接口消息并保留状态码', () => {
    const error = normalizeHttpError({
      response: { status: 404, data: { message: '记录不存在' } },
      message: 'Request failed',
    })

    expect(error.message).toBe('记录不存在')
    expect(error.status).toBe(404)
  })

  it('未知错误使用稳定中文提示', () => {
    expect(normalizeHttpError(new Error('boom')).message).toBe('网络请求失败，请稍后重试')
  })
})
```

- [ ] **步骤 2：运行测试验证失败**

运行：

```bash
npm test -- tests/api/http.test.ts
```

预期：FAIL，提示找不到 `normalizeHttpError`。

- [ ] **步骤 3：实现 axios 实例与错误类型**

创建 `pbw-admin-frontend/src/api/http.ts`：

```ts
import axios from 'axios'

export interface HttpError extends Error {
  status?: number
}

export const normalizeHttpError = (value: unknown): HttpError => {
  const candidate = value as { response?: { status?: number; data?: { message?: string } } }
  const error = new Error(candidate.response?.data?.message || '网络请求失败，请稍后重试') as HttpError
  error.status = candidate.response?.status
  return error
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeHttpError(error)),
)
```

创建 `pbw-admin-frontend/src/api/endpoints.ts`：

```ts
export const endpoints = {
  auth: '/auth/login',
  basicInfo: '/basic-info',
  users: '/users',
  videos: '/videos',
  materials: '/materials',
  matrixAccounts: '/matrix-accounts',
  courses: '/courses',
} as const
```

创建 `pbw-admin-frontend/src/api/modules/crud.api.ts`：

```ts
import { http } from '@/api/http'

export const createCrudApi = <TDto>(endpoint: string) => ({
  async list(): Promise<TDto[]> {
    const response = await http.get<TDto[]>(endpoint)
    return response.data
  },
  async remove(id: number): Promise<void> {
    await http.delete(`${endpoint}/${id}`)
  },
})
```

创建 `pbw-admin-frontend/src/api/modules/index.ts`：

```ts
import { endpoints } from '@/api/endpoints'
import { createCrudApi } from '@/api/modules/crud.api'
import type { CourseDto, MaterialDto, MatrixAccountDto, UserDto, VideoDto } from '@/api/dto/entities.dto'

export const userApi = createCrudApi<UserDto>(endpoints.users)
export const videoApi = createCrudApi<VideoDto>(endpoints.videos)
export const materialApi = createCrudApi<MaterialDto>(endpoints.materials)
export const matrixAccountApi = createCrudApi<MatrixAccountDto>(endpoints.matrixAccounts)
export const courseApi = createCrudApi<CourseDto>(endpoints.courses)
```

- [ ] **步骤 4：运行 API 测试与类型检查**

运行：

```bash
npm test -- tests/api
npm run type-check
```

预期：全部 PASS；类型检查退出码为 0。

- [ ] **步骤 5：提交 API 边界**

```bash
git add pbw-admin-frontend/src/api pbw-admin-frontend/tests/api
git commit -m "feat: 建立后台接口边界"
```

---

### 任务 5：实现测试登录、会话与认证 Store

**文件：**
- 创建：`pbw-admin-frontend/src/models/auth.ts`
- 创建：`pbw-admin-frontend/src/services/app-error.ts`
- 创建：`pbw-admin-frontend/src/services/auth.service.ts`
- 创建：`pbw-admin-frontend/src/stores/auth.store.ts`
- 测试：`pbw-admin-frontend/tests/services/auth.service.test.ts`
- 测试：`pbw-admin-frontend/tests/stores/auth.store.test.ts`

- [ ] **步骤 1：先编写失败的认证 Service 测试**

创建 `pbw-admin-frontend/tests/services/auth.service.test.ts`：

```ts
import { createAuthService } from '@/services/auth.service'

describe('AuthService', () => {
  it('测试模式使用 SQL 示例管理员登录且结果不含密码', async () => {
    const storage = new Map<string, string>()
    const service = createAuthService({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    })

    const session = await service.login({ account: 'admin', password: '123456', testMode: true })

    expect(session.user.account).toBe('admin')
    expect(session.user).not.toHaveProperty('password')
    expect(service.restore()?.token).toBe(session.token)
  })

  it('错误凭据失败且 logout 清除会话', async () => {
    const storage = new Map<string, string>()
    const service = createAuthService({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    })

    await expect(service.login({ account: 'admin', password: 'wrong', testMode: true })).rejects.toThrow('账号或密码错误')
    await service.login({ account: 'admin', password: '123456', testMode: true })
    service.logout()
    expect(service.restore()).toBeNull()
  })
})
```

- [ ] **步骤 2：运行认证 Service 测试验证失败**

运行：

```bash
npm test -- tests/services/auth.service.test.ts
```

预期：FAIL，提示找不到认证模型或 Service。

- [ ] **步骤 3：实现认证模型、错误和 Service**

创建 `pbw-admin-frontend/src/models/auth.ts`：

```ts
import type { UserProfile } from '@/models/entities'

export interface LoginPayload {
  account: string
  password: string
  testMode: boolean
}

export interface AuthSession {
  token: string
  user: UserProfile
}

export interface SessionStoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): unknown
  removeItem(key: string): unknown
}
```

创建 `pbw-admin-frontend/src/services/app-error.ts`：

```ts
export class AppError extends Error {
  constructor(message: string, public readonly code = 'APP_ERROR') {
    super(message)
    this.name = 'AppError'
  }
}
```

创建 `pbw-admin-frontend/src/services/auth.service.ts`：

```ts
import { usersMock } from '@/mocks/data/database.mock'
import type { AuthSession, LoginPayload, SessionStoragePort } from '@/models/auth'
import { AppError } from '@/services/app-error'

const SESSION_KEY = 'pbw-admin-session'

export const createAuthService = (storage: SessionStoragePort) => ({
  async login(payload: LoginPayload): Promise<AuthSession> {
    if (!payload.testMode) throw new AppError('真实接口尚未接入，请启用临时测试模式', 'API_UNAVAILABLE')
    if (payload.account !== 'admin' || payload.password !== '123456') throw new AppError('账号或密码错误', 'INVALID_CREDENTIALS')

    const admin = usersMock.find((user) => user.account === 'admin')
    if (!admin) throw new AppError('测试管理员数据不存在', 'TEST_USER_MISSING')
    const session: AuthSession = { token: 'pbw-admin-test-token', user: structuredClone(admin) }
    storage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },
  restore(): AuthSession | null {
    const raw = storage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthSession
    } catch {
      storage.removeItem(SESSION_KEY)
      return null
    }
  },
  logout() {
    storage.removeItem(SESSION_KEY)
  },
})

export const authService = createAuthService(window.sessionStorage)
```

- [ ] **步骤 4：运行认证 Service 测试验证通过**

运行：

```bash
npm test -- tests/services/auth.service.test.ts
```

预期：PASS，2 个测试通过。

- [ ] **步骤 5：先编写失败的认证 Store 测试**

创建 `pbw-admin-frontend/tests/stores/auth.store.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

describe('AuthStore', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('登录和退出同步认证状态', async () => {
    const store = useAuthStore()

    await store.login({ account: 'admin', password: '123456', testMode: true })
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.nickname).toBe('管理员')

    store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
})
```

- [ ] **步骤 6：运行 Store 测试验证失败**

运行：

```bash
npm test -- tests/stores/auth.store.test.ts
```

预期：FAIL，提示找不到 `auth.store`。

- [ ] **步骤 7：实现认证 Store**

创建 `pbw-admin-frontend/src/stores/auth.store.ts`：

```ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LoginPayload } from '@/models/auth'
import type { UserProfile } from '@/models/entities'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const restored = authService.restore()
  const token = ref(restored?.token ?? null)
  const user = ref<UserProfile | null>(restored?.user ?? null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const login = async (payload: LoginPayload) => {
    loading.value = true
    error.value = null
    try {
      const session = await authService.login(payload)
      token.value = session.token
      user.value = session.user
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '登录失败'
      throw cause
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    token.value = null
    user.value = null
    error.value = null
  }

  return { token, user, loading, error, isAuthenticated, login, logout }
})
```

- [ ] **步骤 8：运行认证测试验证通过**

运行：

```bash
npm test -- tests/services/auth.service.test.ts tests/stores/auth.store.test.ts
```

预期：全部 PASS。

- [ ] **步骤 9：提交认证层**

```bash
git add pbw-admin-frontend/src/models/auth.ts pbw-admin-frontend/src/services pbw-admin-frontend/src/stores/auth.store.ts pbw-admin-frontend/tests/services pbw-admin-frontend/tests/stores/auth.store.test.ts
git commit -m "feat: 实现后台测试登录"
```

---

### 任务 6：实现路由守卫、登录页与响应式后台布局

**文件：**
- 创建：`pbw-admin-frontend/src/stores/index.ts`
- 创建：`pbw-admin-frontend/src/router/index.ts`
- 创建：`pbw-admin-frontend/src/main.ts`
- 创建：`pbw-admin-frontend/src/views/auth/LoginView.vue`
- 创建：`pbw-admin-frontend/src/views/dashboard/DashboardView.vue`
- 创建：`pbw-admin-frontend/src/components/layout/AdminLayout.vue`
- 创建：`pbw-admin-frontend/src/components/layout/AdminSidebar.vue`
- 创建：`pbw-admin-frontend/src/components/layout/AdminHeader.vue`
- 测试：`pbw-admin-frontend/tests/router/router.test.ts`
- 测试：`pbw-admin-frontend/tests/views/login-view.test.ts`
- 测试：`pbw-admin-frontend/tests/layout/admin-layout.test.ts`

- [ ] **步骤 1：先编写失败的路由守卫测试**

创建 `pbw-admin-frontend/tests/router/router.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import { useAuthStore } from '@/stores/auth.store'

describe('后台路由守卫', () => {
  beforeEach(() => sessionStorage.clear())

  it('未登录访问后台时跳转登录页', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createAppRouter(pinia, createMemoryHistory())

    await router.push('/dashboard')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('登录后访问登录页时跳转工作台', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore(pinia)
    await auth.login({ account: 'admin', password: '123456', testMode: true })
    const router = createAppRouter(pinia, createMemoryHistory())

    await router.push('/login')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})
```

- [ ] **步骤 2：运行路由测试验证失败**

运行：

```bash
npm test -- tests/router/router.test.ts
```

预期：FAIL，提示找不到 `createAppRouter`。

- [ ] **步骤 3：创建 Pinia 实例、路由与最小页面**

创建 `pbw-admin-frontend/src/stores/index.ts`：

```ts
import { createPinia } from 'pinia'

export const pinia = createPinia()
```

创建 `pbw-admin-frontend/src/router/index.ts`：

```ts
import type { Pinia } from 'pinia'
import {
  createRouter,
  createWebHistory,
  type RouterHistory,
  type RouteRecordRaw,
} from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import { useAuthStore } from '@/stores/auth.store'

export const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: DashboardView, meta: { title: '首页' } },
      { path: 'users', name: 'users', component: () => import('@/views/users/UserListView.vue'), meta: { title: '用户管理' } },
      { path: 'content/basic-info', name: 'basic-info', component: () => import('@/views/content/BasicInfoView.vue'), meta: { title: '基本信息' } },
      { path: 'content/videos', name: 'videos', component: () => import('@/views/content/VideoListView.vue'), meta: { title: '视频管理' } },
      { path: 'content/materials', name: 'materials', component: () => import('@/views/content/MaterialListView.vue'), meta: { title: '素材管理' } },
      { path: 'content/matrix-accounts', name: 'matrix-accounts', component: () => import('@/views/content/MatrixAccountListView.vue'), meta: { title: '矩阵账号' } },
      { path: 'content/courses', name: 'courses', component: () => import('@/views/content/CourseListView.vue'), meta: { title: '课程管理' } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

export const createAppRouter = (pinia: Pinia, history: RouterHistory = createWebHistory()) => {
  const router = createRouter({ history, routes })
  router.beforeEach((to) => {
    const auth = useAuthStore(pinia)
    if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
    if (to.meta.guestOnly && auth.isAuthenticated) return '/dashboard'
    return true
  })
  return router
}
```

先创建后续路由需要的最小占位文件，内容统一为可识别标题；后续任务必须用完整页面替换，不新增其他行为：

```vue
<!-- src/views/dashboard/DashboardView.vue -->
<template><section data-testid="dashboard-view"><h1>工作台</h1></section></template>
```

```vue
<!-- src/views/users/UserListView.vue -->
<template><section><h1>用户管理</h1></section></template>
```

```vue
<!-- src/views/content/BasicInfoView.vue -->
<template><section><h1>基本信息</h1></section></template>
```

```vue
<!-- src/views/content/VideoListView.vue -->
<template><section><h1>视频管理</h1></section></template>
```

```vue
<!-- src/views/content/MaterialListView.vue -->
<template><section><h1>素材管理</h1></section></template>
```

```vue
<!-- src/views/content/MatrixAccountListView.vue -->
<template><section><h1>矩阵账号</h1></section></template>
```

```vue
<!-- src/views/content/CourseListView.vue -->
<template><section><h1>课程管理</h1></section></template>
```

- [ ] **步骤 4：运行路由测试验证通过**

运行：

```bash
npm test -- tests/router/router.test.ts
```

预期：PASS，2 个测试通过。

- [ ] **步骤 5：先编写失败的登录页测试**

创建 `pbw-admin-frontend/tests/views/login-view.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'

describe('LoginView', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('展示测试凭据并可提交测试登录', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', component: LoginView },
        { path: '/dashboard', component: { template: '<div>工作台</div>' } },
      ],
    })
    await router.push('/login')
    await router.isReady()
    const wrapper = mount(LoginView, {
      global: { plugins: [pinia, router] },
    })

    expect(wrapper.text()).toContain('临时测试模式')
    expect(wrapper.text()).toContain('admin / 123456')
    await wrapper.get('[data-testid="account-input"] input').setValue('admin')
    await wrapper.get('[data-testid="password-input"] input').setValue('123456')
    await wrapper.get('[data-testid="login-submit"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})
```

- [ ] **步骤 6：运行登录页测试验证失败**

运行：

```bash
npm test -- tests/views/login-view.test.ts
```

预期：FAIL，提示登录页缺失测试凭据或表单元素。

- [ ] **步骤 7：实现 A「岩蓝专注」登录页**

创建 `pbw-admin-frontend/src/views/auth/LoginView.vue`：

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref<FormInstance>()
const form = reactive({ account: 'admin', password: '123456', testMode: true })
const rules: FormRules = {
  account: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const submit = async () => {
  if (!(await formRef.value?.validate().catch(() => false))) return
  try {
    await auth.login(form)
    ElMessage.success('登录成功')
    await router.push('/dashboard')
  } catch {
    ElMessage.error(auth.error || '登录失败')
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-brand-panel">
      <div class="brand-lockup"><span>PB</span><strong>PBW Admin</strong></div>
      <div><p class="eyebrow">PERSONAL BRAND WORKSPACE</p><h1>让内容管理<br />更清晰、更从容</h1><p>统一管理用户、视频、素材、矩阵账号与课程内容。</p></div>
      <small>PBW ADMINISTRATIVE CONSOLE</small>
    </section>
    <section class="login-form-panel">
      <el-card class="login-card" shadow="never">
        <h2>欢迎回来</h2><p>登录后台管理系统</p>
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
          <el-form-item label="管理员账号" prop="account"><el-input data-testid="account-input" v-model="form.account" :prefix-icon="User" /></el-form-item>
          <el-form-item label="密码" prop="password"><el-input data-testid="password-input" v-model="form.password" :prefix-icon="Lock" type="password" show-password @keyup.enter="submit" /></el-form-item>
          <el-alert class="test-mode-alert" title="临时测试模式" type="info" :closable="false" description="测试账号：admin / 123456；无需后端 API。" />
          <el-button data-testid="login-submit" class="login-submit" type="primary" :loading="auth.loading" @click="submit">登录系统</el-button>
        </el-form>
      </el-card>
    </section>
  </main>
</template>

<style scoped>
.login-page{min-height:100vh;display:grid;grid-template-columns:minmax(360px,.85fr) minmax(520px,1.15fr)}
.login-brand-panel{padding:48px;background:linear-gradient(155deg,#111827,#1b2740);color:#fff;display:flex;flex-direction:column;justify-content:space-between}.brand-lockup{display:flex;align-items:center;gap:12px}.brand-lockup span{width:42px;height:42px;border-radius:12px;background:#5b73f2;display:grid;place-items:center;font-weight:800}.brand-lockup strong{font-size:22px}.eyebrow{font-size:12px;letter-spacing:.16em;color:#8592a7}.login-brand-panel h1{font-size:44px;line-height:1.2;margin:12px 0}.login-brand-panel p{color:#a7b1c0;line-height:1.7}.login-brand-panel small{color:#68758a}.login-form-panel{display:grid;place-items:center;padding:40px;background:#f4f6fa}.login-card{width:min(430px,100%);border:0;border-radius:16px;padding:14px;box-shadow:0 18px 55px rgba(25,40,68,.1)}.login-card h2{margin:0 0 6px;font-size:28px}.login-card>p{margin:0 0 28px;color:#7c8799}.test-mode-alert{margin:8px 0 20px}.login-submit{width:100%;height:44px}
@media(max-width:820px){.login-page{grid-template-columns:1fr}.login-brand-panel{display:none}.login-form-panel{padding:24px}.login-card{padding:6px}}
</style>
```

- [ ] **步骤 8：运行登录页测试验证通过**

运行：

```bash
npm test -- tests/views/login-view.test.ts
```

预期：PASS，登录后调用 `/dashboard`。

- [ ] **步骤 9：先编写失败的后台布局测试**

创建 `pbw-admin-frontend/tests/layout/admin-layout.test.ts`：

```ts
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'

describe('AdminLayout', () => {
  afterEach(() => vi.restoreAllMocks())

  const render = async () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<main data-testid="admin-router-view" />' }, meta: { title: '首页' } }],
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AdminLayout, {
      global: { plugins: [pinia, router], stubs: { teleport: true } },
    })
    return wrapper
  }

  it('展示约定菜单与路由内容出口', async () => {
    const wrapper = await render()
    expect(wrapper.text()).toContain('用户管理')
    expect(wrapper.text()).toContain('基本信息')
    expect(wrapper.text()).toContain('课程管理')
    expect(wrapper.get('[data-testid="admin-router-view"]').exists()).toBe(true)
  })

  it('小屏点击菜单按钮时打开抽屉', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    const wrapper = await render()
    wrapper.findComponent(AdminHeader).vm.$emit('toggle')
    await nextTick()
    expect(wrapper.findComponent({ name: 'ElDrawer' }).props('modelValue')).toBe(true)
  })
})
```

- [ ] **步骤 10：运行布局测试验证失败**

运行：

```bash
npm test -- tests/layout/admin-layout.test.ts
```

预期：FAIL，提示布局组件不存在或菜单缺失。

- [ ] **步骤 11：实现侧栏、顶栏和后台布局**

创建 `pbw-admin-frontend/src/components/layout/AdminSidebar.vue`：

```vue
<script setup lang="ts">
import { DataAnalysis, Film, Goods, HomeFilled, Menu, Monitor, UserFilled } from '@element-plus/icons-vue'
defineProps<{ collapsed: boolean }>()
</script>

<template>
  <aside class="admin-sidebar" :class="{ collapsed }">
    <div class="sidebar-brand"><span>PB</span><strong v-show="!collapsed">PBW Admin</strong></div>
    <el-menu router :collapse="collapsed" :default-active="$route.path" background-color="#111827" text-color="#8f9aab" active-text-color="#fff">
      <el-menu-item index="/dashboard"><el-icon><HomeFilled /></el-icon><template #title>首页</template></el-menu-item>
      <el-menu-item index="/users"><el-icon><UserFilled /></el-icon><template #title>用户管理</template></el-menu-item>
      <el-sub-menu index="content"><template #title><el-icon><DataAnalysis /></el-icon><span>内容管理</span></template>
        <el-menu-item index="/content/basic-info"><el-icon><Monitor /></el-icon>基本信息</el-menu-item>
        <el-menu-item index="/content/videos"><el-icon><Film /></el-icon>视频管理</el-menu-item>
        <el-menu-item index="/content/materials"><el-icon><Goods /></el-icon>素材管理</el-menu-item>
        <el-menu-item index="/content/matrix-accounts"><el-icon><Menu /></el-icon>矩阵账号</el-menu-item>
        <el-menu-item index="/content/courses"><el-icon><DataAnalysis /></el-icon>课程管理</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </aside>
</template>

<style scoped>
.admin-sidebar{width:240px;min-height:100vh;background:#111827;transition:width .2s;overflow:hidden}.admin-sidebar.collapsed{width:64px}.sidebar-brand{height:64px;padding:0 18px;display:flex;align-items:center;gap:10px;color:#fff;white-space:nowrap}.sidebar-brand span{width:30px;height:30px;border-radius:9px;background:#5b73f2;display:grid;place-items:center;font-size:12px;font-weight:800}.sidebar-brand strong{font-size:17px}.el-menu{border-right:0}.el-menu-item.is-active{margin:0 10px;border-radius:8px;background:#5b73f2!important}
</style>
```

创建 `pbw-admin-frontend/src/components/layout/AdminHeader.vue`：

```vue
<script setup lang="ts">
import { ArrowDown, Fold, Expand } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const logout = async () => { auth.logout(); await router.push('/login') }
</script>

<template>
  <header class="admin-header">
    <div class="header-left"><el-button text circle aria-label="切换菜单" @click="emit('toggle')"><el-icon><component :is="collapsed ? Expand : Fold" /></el-icon></el-button><el-breadcrumb separator="/"><el-breadcrumb-item>后台管理</el-breadcrumb-item><el-breadcrumb-item>{{ route.meta.title || '首页' }}</el-breadcrumb-item></el-breadcrumb></div>
    <el-dropdown><div class="admin-user"><el-avatar :size="32">管</el-avatar><span>{{ auth.user?.nickname || '管理员' }}</span><el-icon><ArrowDown /></el-icon></div><template #dropdown><el-dropdown-menu><el-dropdown-item @click="logout">退出登录</el-dropdown-item></el-dropdown-menu></template></el-dropdown>
  </header>
</template>

<style scoped>
.admin-header{height:64px;padding:0 22px;background:#fff;border-bottom:1px solid #e7ebf1;display:flex;align-items:center;justify-content:space-between}.header-left,.admin-user{display:flex;align-items:center;gap:12px}.admin-user{cursor:pointer;color:#38445a;font-size:14px}.admin-user .el-avatar{background:#5b73f2;color:#fff}
</style>
```

创建 `pbw-admin-frontend/src/components/layout/AdminLayout.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
const collapsed = ref(false)
const drawerVisible = ref(false)
const toggleMenu = () => {
  if (window.matchMedia('(max-width: 768px)').matches) drawerVisible.value = true
  else collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="admin-layout">
    <div class="desktop-sidebar"><AdminSidebar :collapsed="collapsed" /></div>
    <el-drawer v-model="drawerVisible" class="mobile-drawer" direction="ltr" size="240px" :with-header="false"><AdminSidebar :collapsed="false" /></el-drawer>
    <div class="admin-column"><AdminHeader :collapsed="collapsed" @toggle="toggleMenu" /><main class="admin-content"><RouterView /></main></div>
  </div>
</template>

<style scoped>
.admin-layout{min-height:100vh;display:flex;background:#f4f6fa}.desktop-sidebar{flex:0 0 auto}.admin-column{min-width:0;flex:1}.admin-content{padding:24px;min-width:0}.mobile-drawer{display:none}
:deep(.mobile-drawer .el-drawer__body){padding:0;background:#111827}
@media(max-width:768px){.desktop-sidebar{display:none}.mobile-drawer{display:block}.admin-content{padding:16px}}
</style>
```

- [ ] **步骤 12：运行布局测试验证通过**

运行：

```bash
npm test -- tests/layout/admin-layout.test.ts
```

预期：PASS，菜单与 RouterView 均存在。

- [ ] **步骤 13：创建应用入口并运行基础测试**

创建 `pbw-admin-frontend/src/main.ts`：

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.css'
import App from '@/App.vue'
import { pinia } from '@/stores'
import { createAppRouter } from '@/router'

const app = createApp(App)
const router = createAppRouter(pinia)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
```

运行：

```bash
npm test -- tests/app-shell.test.ts tests/router tests/views/login-view.test.ts tests/layout
```

预期：全部 PASS。

- [ ] **步骤 14：提交路由、登录和布局**

```bash
git add pbw-admin-frontend/src/main.ts pbw-admin-frontend/src/router pbw-admin-frontend/src/stores/index.ts pbw-admin-frontend/src/components/layout pbw-admin-frontend/src/views pbw-admin-frontend/tests/router pbw-admin-frontend/tests/views pbw-admin-frontend/tests/layout
git commit -m "feat: 完成后台登录与布局"
```

---

### 任务 7：实现实体 Service、列表 Store 和删除状态机

**文件：**
- 创建：`pbw-admin-frontend/src/services/entity.service.ts`
- 创建：`pbw-admin-frontend/src/stores/entity-list.store.ts`
- 创建：`pbw-admin-frontend/src/stores/entities.ts`
- 创建：`pbw-admin-frontend/src/stores/basic-info.store.ts`
- 测试：`pbw-admin-frontend/tests/services/entity.service.test.ts`
- 测试：`pbw-admin-frontend/tests/stores/entity-list.store.test.ts`

- [ ] **步骤 1：先编写失败的实体 Service 测试**

创建 `pbw-admin-frontend/tests/services/entity.service.test.ts`：

```ts
import { createEntityService } from '@/services/entity.service'

describe('EntityService', () => {
  it('转发读取和删除并将未知错误转换为可读消息', async () => {
    const repository = {
      list: vi.fn().mockResolvedValue([{ id: 1, name: 'A' }]),
      remove: vi.fn().mockRejectedValue(new Error('boom')),
    }
    const service = createEntityService(repository, '视频')

    expect(await service.list()).toEqual([{ id: 1, name: 'A' }])
    await expect(service.remove(1)).rejects.toThrow('删除视频失败，请稍后重试')
  })
})
```

- [ ] **步骤 2：运行 Service 测试验证失败**

运行：

```bash
npm test -- tests/services/entity.service.test.ts
```

预期：FAIL，提示找不到 `createEntityService`。

- [ ] **步骤 3：实现实体 Service**

创建 `pbw-admin-frontend/src/services/entity.service.ts`：

```ts
import type { ListRepository } from '@/repositories/contracts'
import { AppError } from '@/services/app-error'

export const createEntityService = <T extends { id: number }>(repository: ListRepository<T>, label: string) => ({
  list: () => repository.list(),
  async remove(id: number) {
    try {
      await repository.remove(id)
    } catch (cause) {
      if (cause instanceof Error && cause.message === '记录不存在') throw new AppError('记录不存在或已删除', 'NOT_FOUND')
      throw new AppError(`删除${label}失败，请稍后重试`, 'DELETE_FAILED')
    }
  },
})
```

- [ ] **步骤 4：运行 Service 测试验证通过**

运行：

```bash
npm test -- tests/services/entity.service.test.ts
```

预期：PASS。

- [ ] **步骤 5：先编写失败的列表 Store 测试**

创建 `pbw-admin-frontend/tests/stores/entity-list.store.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { createEntityListStore } from '@/stores/entity-list.store'

describe('EntityListStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('加载列表并仅在删除成功后移除记录', async () => {
    const service = { list: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]), remove: vi.fn().mockResolvedValue(undefined) }
    const useStore = createEntityListStore('test-success', service)
    const store = useStore()
    await store.load()
    await store.remove(1)
    expect(store.items).toEqual([{ id: 2 }])
  })

  it('删除失败时保留列表并记录错误', async () => {
    const service = { list: vi.fn().mockResolvedValue([{ id: 1 }]), remove: vi.fn().mockRejectedValue(new Error('删除失败')) }
    const useStore = createEntityListStore('test-failure', service)
    const store = useStore()
    await store.load()
    await expect(store.remove(1)).rejects.toThrow('删除失败')
    expect(store.items).toEqual([{ id: 1 }])
    expect(store.error).toBe('删除失败')
  })
})
```

- [ ] **步骤 6：运行 Store 测试验证失败**

运行：

```bash
npm test -- tests/stores/entity-list.store.test.ts
```

预期：FAIL，提示找不到 Store 工厂。

- [ ] **步骤 7：实现列表 Store 工厂和实体 Store**

创建 `pbw-admin-frontend/src/stores/entity-list.store.ts`：

```ts
import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'

interface EntityService<T extends { id: number }> {
  list(): Promise<T[]>
  remove(id: number): Promise<void>
}

export const createEntityListStore = <T extends { id: number }>(id: string, service: EntityService<T>) => defineStore(id, () => {
  const items = shallowRef<T[]>([])
  const loading = ref(false)
  const submittingId = ref<number | null>(null)
  const error = ref<string | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null
    try { items.value = await service.list() }
    catch (cause) { error.value = cause instanceof Error ? cause.message : '数据加载失败' }
    finally { loading.value = false }
  }

  const remove = async (recordId: number) => {
    submittingId.value = recordId
    error.value = null
    try {
      await service.remove(recordId)
      items.value = items.value.filter((item) => item.id !== recordId)
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : '删除失败'
      throw cause
    } finally {
      submittingId.value = null
    }
  }

  return { items, loading, submittingId, error, load, remove }
})
```

创建 `pbw-admin-frontend/src/stores/entities.ts`：

```ts
import { courseRepository, materialRepository, matrixAccountRepository, userRepository, videoRepository } from '@/mocks/repositories'
import { createEntityService } from '@/services/entity.service'
import { createEntityListStore } from '@/stores/entity-list.store'

export const useUserStore = createEntityListStore('users', createEntityService(userRepository, '用户'))
export const useVideoStore = createEntityListStore('videos', createEntityService(videoRepository, '视频'))
export const useMaterialStore = createEntityListStore('materials', createEntityService(materialRepository, '素材'))
export const useMatrixAccountStore = createEntityListStore('matrix-accounts', createEntityService(matrixAccountRepository, '矩阵账号'))
export const useCourseStore = createEntityListStore('courses', createEntityService(courseRepository, '课程'))
```

创建 `pbw-admin-frontend/src/stores/basic-info.store.ts`：

```ts
import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type { BasicInfo } from '@/models/entities'
import { basicInfoRepository } from '@/mocks/repositories'

export const useBasicInfoStore = defineStore('basic-info', () => {
  const info = shallowRef<BasicInfo | null>(null)
  const loading = ref(false)
  const load = async () => {
    loading.value = true
    try { info.value = await basicInfoRepository.get() }
    finally { loading.value = false }
  }
  return { info, loading, load }
})
```

- [ ] **步骤 8：运行 Service 和 Store 测试验证通过**

运行：

```bash
npm test -- tests/services/entity.service.test.ts tests/stores/entity-list.store.test.ts
```

预期：全部 PASS。

- [ ] **步骤 9：提交实体状态层**

```bash
git add pbw-admin-frontend/src/services/entity.service.ts pbw-admin-frontend/src/stores pbw-admin-frontend/tests/services/entity.service.test.ts pbw-admin-frontend/tests/stores/entity-list.store.test.ts
git commit -m "feat: 实现后台列表状态"
```

---

### 任务 8：实现工作台聚合与首页

**文件：**
- 创建：`pbw-admin-frontend/src/models/dashboard.ts`
- 创建：`pbw-admin-frontend/src/services/dashboard.service.ts`
- 创建：`pbw-admin-frontend/src/stores/dashboard.store.ts`
- 修改：`pbw-admin-frontend/src/views/dashboard/DashboardView.vue`
- 创建：`pbw-admin-frontend/src/utils/formatters.ts`
- 测试：`pbw-admin-frontend/tests/services/dashboard.service.test.ts`
- 测试：`pbw-admin-frontend/tests/views/dashboard-view.test.ts`

- [ ] **步骤 1：先编写失败的工作台 Service 测试**

创建 `pbw-admin-frontend/tests/services/dashboard.service.test.ts`：

```ts
import { dashboardService } from '@/services/dashboard.service'

describe('DashboardService', () => {
  it('只根据数据库示例数据计算可解释指标', async () => {
    const summary = await dashboardService.getSummary()

    expect(summary.userCount).toBe(3)
    expect(summary.videoCount).toBe(3)
    expect(summary.materialCount).toBe(3)
    expect(summary.materialTotalPrice).toBe(127.9)
    expect(summary.courseCount).toBe(3)
    expect(summary.onlineCourseCount).toBe(2)
    expect(summary.totalPlayCount).toBe(12800000)
  })
})
```

- [ ] **步骤 2：运行 Service 测试验证失败**

运行：

```bash
npm test -- tests/services/dashboard.service.test.ts
```

预期：FAIL，提示找不到工作台 Service。

- [ ] **步骤 3：实现工作台模型、Service 与 Store**

创建 `pbw-admin-frontend/src/models/dashboard.ts`：

```ts
export interface DashboardSummary {
  userCount: number
  videoCount: number
  materialCount: number
  materialTotalPrice: number
  matrixAccountCount: number
  courseCount: number
  onlineCourseCount: number
  totalPlayCount: number
  totalLikeCount: number
  totalFollowerCount: number
  recentItems: Array<{ id: string; title: string; type: string; updateTime: string }>
}
```

创建 `pbw-admin-frontend/src/services/dashboard.service.ts`：

```ts
import { basicInfoRepository, courseRepository, materialRepository, matrixAccountRepository, userRepository, videoRepository } from '@/mocks/repositories'
import type { DashboardSummary } from '@/models/dashboard'

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const [basicInfo, users, videos, materials, matrixAccounts, courses] = await Promise.all([
      basicInfoRepository.get(), userRepository.list(), videoRepository.list(), materialRepository.list(), matrixAccountRepository.list(), courseRepository.list(),
    ])
    return {
      userCount: users.length,
      videoCount: videos.length,
      materialCount: materials.length,
      materialTotalPrice: materials.reduce((sum, item) => sum + item.price, 0),
      matrixAccountCount: matrixAccounts.length,
      courseCount: courses.length,
      onlineCourseCount: courses.filter((course) => course.isOnline).length,
      totalPlayCount: basicInfo.totalPlayCount,
      totalLikeCount: basicInfo.totalLikeCount,
      totalFollowerCount: basicInfo.totalFollowerCount,
      recentItems: [
        { id: `course-${courses[0].id}`, title: courses[0].courseName, type: '课程', updateTime: courses[0].updateTime },
        { id: `material-${materials[2].id}`, title: materials[2].materialTitle, type: '素材', updateTime: materials[2].updateTime },
        { id: `matrix-${matrixAccounts[1].id}`, title: matrixAccounts[1].platformName, type: '矩阵账号', updateTime: matrixAccounts[1].updateTime },
      ],
    }
  },
}
```

创建 `pbw-admin-frontend/src/stores/dashboard.store.ts`：

```ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DashboardSummary } from '@/models/dashboard'
import { dashboardService } from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null)
  const loading = ref(false)
  const load = async () => {
    loading.value = true
    try { summary.value = await dashboardService.getSummary() }
    finally { loading.value = false }
  }
  return { summary, loading, load }
})
```

创建 `pbw-admin-frontend/src/utils/formatters.ts`：

```ts
export const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value)
export const formatCompactNumber = (value: number) => new Intl.NumberFormat('zh-CN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
export const formatDateTime = (value: string) => value.replace('T', ' ').slice(0, 16)
```

- [ ] **步骤 4：运行 Service 测试验证通过**

运行：

```bash
npm test -- tests/services/dashboard.service.test.ts
```

预期：PASS。

- [ ] **步骤 5：先编写失败的工作台页面测试**

创建 `pbw-admin-frontend/tests/views/dashboard-view.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import DashboardView from '@/views/dashboard/DashboardView.vue'

describe('DashboardView', () => {
  it('展示数据库可计算的统计卡片', async () => {
    setActivePinia(createPinia())
    const wrapper = mount(DashboardView)
    await flushPromises()
    expect(wrapper.text()).toContain('用户总数')
    expect(wrapper.text()).toContain('素材总价')
    expect(wrapper.text()).toContain('全网播放')
    expect(wrapper.text()).toContain('1280万')
  })
})
```

- [ ] **步骤 6：运行页面测试验证失败**

运行：

```bash
npm test -- tests/views/dashboard-view.test.ts
```

预期：FAIL，当前占位页不包含统计卡片。

- [ ] **步骤 7：实现工作台页面**

将 `pbw-admin-frontend/src/views/dashboard/DashboardView.vue` 替换为：

```vue
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Collection, Film, Goods, User } from '@element-plus/icons-vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import { formatCompactNumber, formatCurrency } from '@/utils/formatters'

const store = useDashboardStore()
onMounted(() => store.load())
const cards = computed(() => store.summary ? [
  { label: '用户总数', value: String(store.summary.userCount), icon: User, tone: 'blue' },
  { label: '视频数量', value: String(store.summary.videoCount), icon: Film, tone: 'violet' },
  { label: '素材总价', value: formatCurrency(store.summary.materialTotalPrice), icon: Goods, tone: 'orange' },
  { label: '已上线课程', value: `${store.summary.onlineCourseCount} / ${store.summary.courseCount}`, icon: Collection, tone: 'green' },
] : [])
</script>

<template>
  <section v-loading="store.loading" data-testid="dashboard-view">
    <div class="page-intro"><div><h1>工作台</h1><p>欢迎回来，这是当前内容数据概览。</p></div><el-tag effect="plain">数据库示例数据</el-tag></div>
    <div class="metric-grid"><el-card v-for="card in cards" :key="card.label" class="metric-card" shadow="never"><div class="metric-label">{{ card.label }}</div><strong>{{ card.value }}</strong><el-icon class="metric-icon"><component :is="card.icon" /></el-icon></el-card></div>
    <div v-if="store.summary" class="dashboard-grid">
      <el-card shadow="never"><template #header><strong>品牌影响力</strong></template><div class="influence-grid"><div><span>全网播放</span><b>{{ formatCompactNumber(store.summary.totalPlayCount) }}</b></div><div><span>全网点赞</span><b>{{ formatCompactNumber(store.summary.totalLikeCount) }}</b></div><div><span>全网粉丝</span><b>{{ formatCompactNumber(store.summary.totalFollowerCount) }}</b></div></div></el-card>
      <el-card shadow="never"><template #header><strong>最近更新</strong></template><div v-for="item in store.summary.recentItems" :key="item.id" class="recent-row"><span>{{ item.title }}</span><el-tag size="small" effect="plain">{{ item.type }}</el-tag></div></el-card>
    </div>
  </section>
</template>

<style scoped>
.page-intro{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px}.page-intro h1{margin:0;font-size:26px}.page-intro p{margin:6px 0 0;color:#7c8799}.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.metric-card{position:relative}.metric-label{color:#7c8799;font-size:13px}.metric-card strong{display:block;margin-top:8px;font-size:26px}.metric-icon{position:absolute;right:18px;top:22px;font-size:28px;color:#5b73f2}.dashboard-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:16px;margin-top:16px}.influence-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.influence-grid div{padding:16px;border-radius:10px;background:#f7f8fb}.influence-grid span,.influence-grid b{display:block}.influence-grid span{font-size:12px;color:#7c8799}.influence-grid b{margin-top:8px;font-size:20px}.recent-row{min-height:42px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #edf0f4}
@media(max-width:1000px){.metric-grid{grid-template-columns:repeat(2,1fr)}.dashboard-grid{grid-template-columns:1fr}}@media(max-width:560px){.metric-grid,.influence-grid{grid-template-columns:1fr}.page-intro{align-items:flex-start;gap:12px}}
</style>
```

- [ ] **步骤 8：运行工作台测试验证通过**

运行：

```bash
npm test -- tests/services/dashboard.service.test.ts tests/views/dashboard-view.test.ts
```

预期：全部 PASS。

- [ ] **步骤 9：提交工作台**

```bash
git add pbw-admin-frontend/src/models/dashboard.ts pbw-admin-frontend/src/services/dashboard.service.ts pbw-admin-frontend/src/stores/dashboard.store.ts pbw-admin-frontend/src/views/dashboard/DashboardView.vue pbw-admin-frontend/src/utils/formatters.ts pbw-admin-frontend/tests/services/dashboard.service.test.ts pbw-admin-frontend/tests/views/dashboard-view.test.ts
git commit -m "feat: 实现后台工作台"
```

---

### 任务 9：实现共享管理组件与删除确认

**文件：**
- 创建：`pbw-admin-frontend/src/components/common/PageHeader.vue`
- 创建：`pbw-admin-frontend/src/components/common/ListToolbar.vue`
- 创建：`pbw-admin-frontend/src/components/common/DataTableCard.vue`
- 创建：`pbw-admin-frontend/src/components/common/MediaThumbnail.vue`
- 创建：`pbw-admin-frontend/src/components/common/DeleteAction.vue`
- 测试：`pbw-admin-frontend/tests/components/delete-action.test.ts`
- 测试：`pbw-admin-frontend/tests/components/management-shell.test.ts`

- [ ] **步骤 1：先编写失败的删除确认测试**

创建 `pbw-admin-frontend/tests/components/delete-action.test.ts`：

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import DeleteAction from '@/components/common/DeleteAction.vue'

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal<typeof import('element-plus')>()
  return {
    ...actual,
    ElMessageBox: { confirm: vi.fn() },
    ElMessage: { success: vi.fn(), error: vi.fn() },
  }
})

describe('DeleteAction', () => {
  it('确认后执行一次删除并反馈成功', async () => {
    vi.mocked(ElMessageBox.confirm).mockResolvedValue('confirm')
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(DeleteAction, { props: { title: '三分钟看懂角色弧光', onDelete } })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(ElMessageBox.confirm).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledOnce()
    expect(ElMessage.success).toHaveBeenCalledWith('删除成功')
  })

  it('取消时不执行删除', async () => {
    vi.mocked(ElMessageBox.confirm).mockRejectedValue('cancel')
    const onDelete = vi.fn()
    const wrapper = mount(DeleteAction, { props: { title: '课程', onDelete } })
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(onDelete).not.toHaveBeenCalled()
  })
})
```

- [ ] **步骤 2：运行删除测试验证失败**

运行：

```bash
npm test -- tests/components/delete-action.test.ts
```

预期：FAIL，提示组件不存在。

- [ ] **步骤 3：实现删除确认组件**

创建 `pbw-admin-frontend/src/components/common/DeleteAction.vue`：

```vue
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{ title: string; loading?: boolean; onDelete: () => Promise<void> }>()

const requestDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `删除“${props.title}”后，当前测试会话中不再显示；刷新页面后示例数据恢复。`,
      '确认删除',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning', confirmButtonClass: 'danger-confirm' },
    )
  } catch {
    return
  }

  try {
    await props.onDelete()
    ElMessage.success('删除成功')
  } catch (cause) {
    ElMessage.error(cause instanceof Error ? cause.message : '删除失败')
  }
}
</script>

<template>
  <el-button link type="danger" :loading="loading" @click="requestDelete">删除</el-button>
</template>
```

- [ ] **步骤 4：运行删除测试验证通过**

运行：

```bash
npm test -- tests/components/delete-action.test.ts
```

预期：PASS，确认和取消两个分支均通过。

- [ ] **步骤 5：先编写失败的共享管理外壳测试**

创建 `pbw-admin-frontend/tests/components/management-shell.test.ts`：

```ts
import { mount } from '@vue/test-utils'
import PageHeader from '@/components/common/PageHeader.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import DataTableCard from '@/components/common/DataTableCard.vue'

describe('共享管理组件', () => {
  it('提供标题、查询原型和空状态', () => {
    const header = mount(PageHeader, { props: { title: '视频管理', description: '维护视频内容' }, slots: { actions: '<button>新增视频</button>' } })
    const toolbar = mount(ListToolbar, { props: { placeholder: '搜索视频标题' } })
    const table = mount(DataTableCard, { props: { empty: true, loading: false } })
    expect(header.text()).toContain('新增视频')
    expect(toolbar.text()).toContain('查询')
    expect(table.text()).toContain('暂无数据')
  })
})
```

- [ ] **步骤 6：运行共享组件测试验证失败**

运行：

```bash
npm test -- tests/components/management-shell.test.ts
```

预期：FAIL，提示共享组件不存在。

- [ ] **步骤 7：实现共享管理组件**

创建 `pbw-admin-frontend/src/components/common/PageHeader.vue`：

```vue
<script setup lang="ts">defineProps<{ title: string; description: string }>()</script>
<template><div class="page-header"><div><h1>{{ title }}</h1><p>{{ description }}</p></div><div><slot name="actions" /></div></div></template>
<style scoped>.page-header{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:20px}.page-header h1{margin:0;font-size:26px}.page-header p{margin:6px 0 0;color:#7c8799}@media(max-width:560px){.page-header{align-items:flex-start;flex-direction:column}}</style>
```

创建 `pbw-admin-frontend/src/components/common/ListToolbar.vue`：

```vue
<script setup lang="ts">defineProps<{ placeholder: string }>()</script>
<template><div class="list-toolbar"><el-input :placeholder="placeholder" clearable /><el-select model-value="all" aria-label="状态"><el-option label="全部状态" value="all" /><el-option label="正常" value="active" /></el-select><el-button type="primary">查询</el-button><el-button>重置</el-button></div></template>
<style scoped>.list-toolbar{display:flex;gap:10px;padding:14px;margin-bottom:14px;background:#fff;border:1px solid #e7ebf1;border-radius:12px}.el-input{max-width:260px}.el-select{width:140px}@media(max-width:650px){.list-toolbar{flex-wrap:wrap}.el-input{max-width:none;flex:1 0 100%}}</style>
```

创建 `pbw-admin-frontend/src/components/common/DataTableCard.vue`：

```vue
<script setup lang="ts">defineProps<{ loading: boolean; empty: boolean; total?: number }>()</script>
<template><section v-loading="loading" class="table-card"><el-empty v-if="empty && !loading" description="暂无数据" /><slot v-else /><footer v-if="!empty" class="table-footer"><span>共 {{ total ?? 0 }} 条</span><el-pagination small background layout="prev, pager, next" :total="total ?? 0" :page-size="10" /></footer></section></template>
<style scoped>.table-card{min-height:220px;background:#fff;border:1px solid #e7ebf1;border-radius:12px;overflow:hidden}.table-card :deep(.el-table){width:100%}.table-card :deep(.el-table th.el-table__cell){background:#f8f9fb;color:#5e6a7d}.table-footer{min-height:54px;padding:0 16px;display:flex;align-items:center;justify-content:flex-end;gap:14px;color:#7c8799;font-size:13px;border-top:1px solid #edf0f4}</style>
```

创建 `pbw-admin-frontend/src/components/common/MediaThumbnail.vue`：

```vue
<script setup lang="ts">defineProps<{ src: string | null; alt: string; round?: boolean }>()</script>
<template><div class="media-thumb" :class="{ round }"><el-image v-if="src" :src="src" :alt="alt" fit="cover"><template #error><span>{{ alt.slice(0, 1) }}</span></template></el-image><span v-else>{{ alt.slice(0, 1) }}</span></div></template>
<style scoped>.media-thumb{width:64px;height:40px;border-radius:8px;overflow:hidden;background:linear-gradient(135deg,#26334b,#7186ef);display:grid;place-items:center;color:#fff;font-weight:700}.media-thumb.round{width:38px;height:38px;border-radius:50%}.el-image{width:100%;height:100%}.el-image span{width:100%;height:100%;display:grid;place-items:center}</style>
```

- [ ] **步骤 8：运行共享组件测试验证通过**

运行：

```bash
npm test -- tests/components
```

预期：全部 PASS。

- [ ] **步骤 9：提交共享组件**

```bash
git add pbw-admin-frontend/src/components/common pbw-admin-frontend/tests/components
git commit -m "feat: 添加后台管理通用组件"
```

---

### 任务 10：实现用户管理与基本信息页面

**文件：**
- 修改：`pbw-admin-frontend/src/views/users/UserListView.vue`
- 修改：`pbw-admin-frontend/src/views/content/BasicInfoView.vue`
- 测试：`pbw-admin-frontend/tests/views/user-list-view.test.ts`
- 测试：`pbw-admin-frontend/tests/views/basic-info-view.test.ts`

- [ ] **步骤 1：先编写失败的用户页面测试**

创建 `pbw-admin-frontend/tests/views/user-list-view.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import UserListView from '@/views/users/UserListView.vue'

describe('UserListView', () => {
  it('展示安全用户字段且不渲染明文密码', async () => {
    setActivePinia(createPinia())
    const wrapper = mount(UserListView)
    await flushPromises()
    expect(wrapper.text()).toContain('管理员')
    expect(wrapper.text()).toContain('admin@example.com')
    expect(wrapper.text()).toContain('角色')
    expect(wrapper.text()).not.toContain('123456')
  })
})
```

- [ ] **步骤 2：运行用户页面测试验证失败**

运行：

```bash
npm test -- tests/views/user-list-view.test.ts
```

预期：FAIL，当前占位页没有数据库示例字段。

- [ ] **步骤 3：实现用户管理页面**

将 `pbw-admin-frontend/src/views/users/UserListView.vue` 替换为：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import DataTableCard from '@/components/common/DataTableCard.vue'
import DeleteAction from '@/components/common/DeleteAction.vue'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import { useUserStore } from '@/stores/entities'
import { formatDateTime } from '@/utils/formatters'

const store = useUserStore()
onMounted(() => store.load())
</script>

<template>
  <section>
    <PageHeader title="用户管理" description="查看个人品牌网站的注册用户与管理员账号"><template #actions><el-button type="primary">新增用户</el-button></template></PageHeader>
    <ListToolbar placeholder="搜索昵称、账号或邮箱" />
    <DataTableCard :loading="store.loading" :empty="store.items.length === 0" :total="store.items.length">
      <el-table :data="store.items" row-key="id">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="用户" min-width="210"><template #default="{ row }"><div class="user-cell"><MediaThumbnail :src="row.avatar" :alt="row.nickname" round /><div><strong>{{ row.nickname }}</strong><span>{{ row.account }}</span></div></div></template></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="190" show-overflow-tooltip />
        <el-table-column label="角色" width="110"><template #default="{ row }"><el-tag :type="row.role === '管理员' ? 'primary' : 'info'" effect="light">{{ row.role }}</el-tag></template></el-table-column>
        <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.isDeleted ? 'danger' : 'success'" effect="light">{{ row.isDeleted ? '已删除' : '正常' }}</el-tag></template></el-table-column>
        <el-table-column label="时间" width="190"><template #default="{ row }"><div class="audit-cell"><span>创建 {{ formatDateTime(row.createTime) }}</span><span>更新 {{ formatDateTime(row.updateTime) }}</span></div></template></el-table-column>
        <el-table-column label="操作" width="120" fixed="right"><template #default="{ row }"><el-button link type="primary">查看</el-button><DeleteAction :title="`${row.nickname}（${row.account}）`" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
      </el-table>
    </DataTableCard>
  </section>
</template>

<style scoped>.user-cell{display:flex;align-items:center;gap:10px}.user-cell strong,.user-cell span,.audit-cell span{display:block}.user-cell span,.audit-cell span{margin-top:3px;color:#7c8799;font-size:12px}</style>
```

- [ ] **步骤 4：运行用户页面测试验证通过**

运行：

```bash
npm test -- tests/views/user-list-view.test.ts
```

预期：PASS。

- [ ] **步骤 5：先编写失败的基本信息页面测试**

创建 `pbw-admin-frontend/tests/views/basic-info-view.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import BasicInfoView from '@/views/content/BasicInfoView.vue'

describe('BasicInfoView', () => {
  it('分组展示基本信息全部业务字段且没有删除入口', async () => {
    setActivePinia(createPinia())
    const wrapper = mount(BasicInfoView)
    await flushPromises()
    expect(wrapper.text()).toContain('用镜头拆解故事')
    expect(wrapper.text()).toContain('年度十佳影片')
    expect(wrapper.text()).toContain('影响我的导演')
    expect(wrapper.text()).toContain('contact@example.com')
    expect(wrapper.text()).not.toContain('确认删除')
  })
})
```

- [ ] **步骤 6：运行基本信息页面测试验证失败**

运行：

```bash
npm test -- tests/views/basic-info-view.test.ts
```

预期：FAIL，当前占位页没有分组字段。

- [ ] **步骤 7：实现基本信息页面**

将 `pbw-admin-frontend/src/views/content/BasicInfoView.vue` 替换为：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useBasicInfoStore } from '@/stores/basic-info.store'
import { formatCompactNumber, formatDateTime } from '@/utils/formatters'
const store = useBasicInfoStore()
onMounted(() => store.load())
</script>

<template>
  <section v-loading="store.loading">
    <PageHeader title="基本信息" description="管理个人品牌网站的单例配置与作者资料"><template #actions><el-button type="primary">编辑信息</el-button></template></PageHeader>
    <template v-if="store.info">
      <div class="stats"><el-card shadow="never"><span>全网播放</span><b>{{ formatCompactNumber(store.info.totalPlayCount) }}</b></el-card><el-card shadow="never"><span>全网点赞</span><b>{{ formatCompactNumber(store.info.totalLikeCount) }}</b></el-card><el-card shadow="never"><span>全网粉丝</span><b>{{ formatCompactNumber(store.info.totalFollowerCount) }}</b></el-card></div>
      <div class="info-grid">
        <el-card shadow="never"><template #header><strong>品牌表达</strong></template><el-descriptions :column="1" border><el-descriptions-item label="作者身份">{{ store.info.authorIdentityTag }}</el-descriptions-item><el-descriptions-item label="Slogan">{{ store.info.slogan }}</el-descriptions-item><el-descriptions-item label="创作态度">{{ store.info.creationAttitude }}</el-descriptions-item></el-descriptions></el-card>
        <el-card shadow="never"><template #header><strong>联系方式</strong></template><el-descriptions :column="1" border><el-descriptions-item label="联系邮箱">{{ store.info.contactEmail }}</el-descriptions-item><el-descriptions-item label="联系方式">{{ store.info.contactInfo }}</el-descriptions-item><el-descriptions-item label="联系二维码">{{ store.info.contactQrCode }}</el-descriptions-item></el-descriptions></el-card>
        <el-card shadow="never"><template #header><strong>年度内容</strong></template><div class="tag-group"><span>年度十佳影片</span><div><el-tag v-for="film in store.info.annualTop10Films" :key="film" effect="plain">{{ film }}</el-tag></div></div><div class="tag-group"><span>影响我的导演</span><div><el-tag v-for="director in store.info.influentialThreeDirectors" :key="director" type="info" effect="plain">{{ director }}</el-tag></div></div></el-card>
        <el-card shadow="never"><template #header><strong>媒体资源</strong></template><el-descriptions :column="1" border><el-descriptions-item label="首页封面视频">{{ store.info.homeCoverVideo }}</el-descriptions-item><el-descriptions-item label="作者照片">{{ store.info.authorPhoto }}</el-descriptions-item><el-descriptions-item label="剪辑台工作照">{{ store.info.editingDeskWorkPhoto }}</el-descriptions-item><el-descriptions-item label="素材库截图">{{ store.info.assetLibraryScreenshot }}</el-descriptions-item><el-descriptions-item label="观影日常照片">{{ store.info.dailyMovieWatchingPhoto }}</el-descriptions-item></el-descriptions></el-card>
      </div>
      <p class="audit">ID {{ store.info.id }} · 状态 {{ store.info.isDeleted ? '已删除' : '正常' }} · 创建于 {{ formatDateTime(store.info.createTime) }} · 更新于 {{ formatDateTime(store.info.updateTime) }}</p>
    </template>
  </section>
</template>

<style scoped>.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px}.stats span,.stats b{display:block}.stats span{color:#7c8799;font-size:13px}.stats b{margin-top:8px;font-size:24px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.tag-group+.tag-group{margin-top:18px}.tag-group>span{display:block;margin-bottom:8px;color:#7c8799;font-size:13px}.tag-group .el-tag{margin:0 8px 8px 0}.audit{text-align:right;color:#8b95a5;font-size:12px}@media(max-width:850px){.info-grid{grid-template-columns:1fr}}@media(max-width:560px){.stats{grid-template-columns:1fr}}</style>
```

- [ ] **步骤 8：运行两个页面测试验证通过**

运行：

```bash
npm test -- tests/views/user-list-view.test.ts tests/views/basic-info-view.test.ts
```

预期：全部 PASS。

- [ ] **步骤 9：提交用户与基本信息页面**

```bash
git add pbw-admin-frontend/src/views/users/UserListView.vue pbw-admin-frontend/src/views/content/BasicInfoView.vue pbw-admin-frontend/tests/views/user-list-view.test.ts pbw-admin-frontend/tests/views/basic-info-view.test.ts
git commit -m "feat: 实现用户与基本信息页面"
```

---

### 任务 11：实现视频、素材、矩阵账号和课程管理页面

**文件：**
- 修改：`pbw-admin-frontend/src/views/content/VideoListView.vue`
- 修改：`pbw-admin-frontend/src/views/content/MaterialListView.vue`
- 修改：`pbw-admin-frontend/src/views/content/MatrixAccountListView.vue`
- 修改：`pbw-admin-frontend/src/views/content/CourseListView.vue`
- 测试：`pbw-admin-frontend/tests/views/content-management-views.test.ts`

- [ ] **步骤 1：先编写失败的四类内容页面测试**

创建 `pbw-admin-frontend/tests/views/content-management-views.test.ts`：

```ts
import { createPinia, setActivePinia } from 'pinia'
import type { Component } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import VideoListView from '@/views/content/VideoListView.vue'
import MaterialListView from '@/views/content/MaterialListView.vue'
import MatrixAccountListView from '@/views/content/MatrixAccountListView.vue'
import CourseListView from '@/views/content/CourseListView.vue'

const render = async (component: Component) => {
  setActivePinia(createPinia())
  const wrapper = mount(component)
  await flushPromises()
  return wrapper
}

describe('内容管理页面', () => {
  it('视频页展示标题、介绍、地址和删除入口', async () => {
    const wrapper = await render(VideoListView)
    expect(wrapper.text()).toContain('为什么这部电影能封神')
    expect(wrapper.text()).toContain('视频地址')
    expect(wrapper.text()).toContain('删除')
  })

  it('素材页展示价格、网盘地址和删除入口', async () => {
    const wrapper = await render(MaterialListView)
    expect(wrapper.text()).toContain('电影海报素材包')
    expect(wrapper.text()).toContain('¥39.90')
    expect(wrapper.text()).toContain('网盘地址')
  })

  it('矩阵账号页展示平台、账号地址和删除入口', async () => {
    const wrapper = await render(MatrixAccountListView)
    expect(wrapper.text()).toContain('抖音')
    expect(wrapper.text()).toContain('B站')
    expect(wrapper.text()).toContain('账号地址')
  })

  it('课程页展示价格、上线状态和删除入口', async () => {
    const wrapper = await render(CourseListView)
    expect(wrapper.text()).toContain('电影解说入门课')
    expect(wrapper.text()).toContain('已上线')
    expect(wrapper.text()).toContain('¥199.00')
  })
})
```

- [ ] **步骤 2：运行页面测试验证失败**

运行：

```bash
npm test -- tests/views/content-management-views.test.ts
```

预期：FAIL，四个占位页均缺少数据库字段和删除入口。

- [ ] **步骤 3：实现视频管理页面**

将 `pbw-admin-frontend/src/views/content/VideoListView.vue` 替换为：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import DataTableCard from '@/components/common/DataTableCard.vue'
import DeleteAction from '@/components/common/DeleteAction.vue'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import { useVideoStore } from '@/stores/entities'
import { formatDateTime } from '@/utils/formatters'
const store = useVideoStore()
onMounted(() => store.load())
</script>

<template>
  <section>
    <PageHeader title="视频管理" description="维护个人品牌网站的视频内容与展示信息"><template #actions><el-button type="primary">新增视频</el-button></template></PageHeader>
    <ListToolbar placeholder="搜索视频标题" />
    <DataTableCard :loading="store.loading" :empty="store.items.length === 0" :total="store.items.length">
      <el-table :data="store.items" row-key="id">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="视频封面" width="100"><template #default="{ row }"><MediaThumbnail :src="row.videoCover" :alt="row.videoTitle" /></template></el-table-column>
        <el-table-column label="视频标题 / 介绍" min-width="260"><template #default="{ row }"><div class="primary-cell"><strong>{{ row.videoTitle }}</strong><span>{{ row.videoIntro || '暂无介绍' }}</span></div></template></el-table-column>
        <el-table-column prop="videoUrl" label="视频地址" min-width="230" show-overflow-tooltip />
        <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.isDeleted ? 'danger' : 'success'">{{ row.isDeleted ? '已删除' : '正常' }}</el-tag></template></el-table-column>
        <el-table-column label="时间" width="190"><template #default="{ row }"><div class="audit-cell"><span>创建 {{ formatDateTime(row.createTime) }}</span><span>更新 {{ formatDateTime(row.updateTime) }}</span></div></template></el-table-column>
        <el-table-column label="操作" width="120" fixed="right"><template #default="{ row }"><el-button link type="primary">查看</el-button><DeleteAction :title="row.videoTitle" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
      </el-table>
    </DataTableCard>
  </section>
</template>
<style scoped>.primary-cell strong,.primary-cell span,.audit-cell span{display:block}.primary-cell span{margin-top:5px;color:#7c8799;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audit-cell span{color:#7c8799;font-size:12px;line-height:1.5}</style>
```

- [ ] **步骤 4：实现素材管理页面**

将 `pbw-admin-frontend/src/views/content/MaterialListView.vue` 替换为：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import DataTableCard from '@/components/common/DataTableCard.vue'
import DeleteAction from '@/components/common/DeleteAction.vue'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import { useMaterialStore } from '@/stores/entities'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
const store = useMaterialStore()
onMounted(() => store.load())
</script>

<template>
  <section>
    <PageHeader title="素材管理" description="维护素材商品、价格和网盘交付信息"><template #actions><el-button type="primary">新增素材</el-button></template></PageHeader>
    <ListToolbar placeholder="搜索素材标题" />
    <DataTableCard :loading="store.loading" :empty="store.items.length === 0" :total="store.items.length">
      <el-table :data="store.items" row-key="id">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="素材图片" width="100"><template #default="{ row }"><MediaThumbnail :src="row.materialPhoto" :alt="row.materialTitle" /></template></el-table-column>
        <el-table-column label="素材标题 / 介绍" min-width="250"><template #default="{ row }"><div class="primary-cell"><strong>{{ row.materialTitle }}</strong><span>{{ row.materialIntro || '暂无介绍' }}</span></div></template></el-table-column>
        <el-table-column label="价格" width="110"><template #default="{ row }"><b>{{ formatCurrency(row.price) }}</b></template></el-table-column>
        <el-table-column prop="netdiskUrl" label="网盘地址" min-width="220" show-overflow-tooltip />
        <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.isDeleted ? 'danger' : 'success'">{{ row.isDeleted ? '已删除' : '正常' }}</el-tag></template></el-table-column>
        <el-table-column label="时间" width="190"><template #default="{ row }"><div class="audit-cell"><span>创建 {{ formatDateTime(row.createTime) }}</span><span>更新 {{ formatDateTime(row.updateTime) }}</span></div></template></el-table-column>
        <el-table-column label="操作" width="120" fixed="right"><template #default="{ row }"><el-button link type="primary">查看</el-button><DeleteAction :title="row.materialTitle" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
      </el-table>
    </DataTableCard>
  </section>
</template>
<style scoped>.primary-cell strong,.primary-cell span,.audit-cell span{display:block}.primary-cell span{margin-top:5px;color:#7c8799;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audit-cell span{color:#7c8799;font-size:12px;line-height:1.5}</style>
```

- [ ] **步骤 5：实现矩阵账号页面**

将 `pbw-admin-frontend/src/views/content/MatrixAccountListView.vue` 替换为：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import DataTableCard from '@/components/common/DataTableCard.vue'
import DeleteAction from '@/components/common/DeleteAction.vue'
import MediaThumbnail from '@/components/common/MediaThumbnail.vue'
import { useMatrixAccountStore } from '@/stores/entities'
import { formatDateTime } from '@/utils/formatters'
const store = useMatrixAccountStore()
onMounted(() => store.load())
</script>

<template>
  <section>
    <PageHeader title="矩阵账号" description="管理个人品牌在不同内容平台的账号矩阵"><template #actions><el-button type="primary">新增账号</el-button></template></PageHeader>
    <ListToolbar placeholder="搜索平台名称" />
    <DataTableCard :loading="store.loading" :empty="store.items.length === 0" :total="store.items.length">
      <el-table :data="store.items" row-key="id">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="平台" min-width="180"><template #default="{ row }"><div class="platform-cell"><MediaThumbnail :src="row.platformLogo" :alt="row.platformName" round /><strong>{{ row.platformName }}</strong></div></template></el-table-column>
        <el-table-column prop="intro" label="简介" min-width="260" show-overflow-tooltip />
        <el-table-column prop="accountUrl" label="账号地址" min-width="240" show-overflow-tooltip />
        <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.isDeleted ? 'danger' : 'success'">{{ row.isDeleted ? '已删除' : '正常' }}</el-tag></template></el-table-column>
        <el-table-column label="时间" width="190"><template #default="{ row }"><div class="audit-cell"><span>创建 {{ formatDateTime(row.createTime) }}</span><span>更新 {{ formatDateTime(row.updateTime) }}</span></div></template></el-table-column>
        <el-table-column label="操作" width="120" fixed="right"><template #default="{ row }"><el-button link type="primary">查看</el-button><DeleteAction :title="row.platformName" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
      </el-table>
    </DataTableCard>
  </section>
</template>
<style scoped>.platform-cell{display:flex;align-items:center;gap:10px}.audit-cell span{display:block;color:#7c8799;font-size:12px;line-height:1.5}</style>
```

- [ ] **步骤 6：实现课程管理页面**

将 `pbw-admin-frontend/src/views/content/CourseListView.vue` 替换为：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ListToolbar from '@/components/common/ListToolbar.vue'
import DataTableCard from '@/components/common/DataTableCard.vue'
import DeleteAction from '@/components/common/DeleteAction.vue'
import { useCourseStore } from '@/stores/entities'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
const store = useCourseStore()
onMounted(() => store.load())
</script>

<template>
  <section>
    <PageHeader title="课程管理" description="维护课程内容、价格和上线状态"><template #actions><el-button type="primary">新增课程</el-button></template></PageHeader>
    <ListToolbar placeholder="搜索课程名称或标签" />
    <DataTableCard :loading="store.loading" :empty="store.items.length === 0" :total="store.items.length">
      <el-table :data="store.items" row-key="id">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="课程名称 / 简介" min-width="280"><template #default="{ row }"><div class="primary-cell"><strong>{{ row.courseName }}</strong><span>{{ row.courseIntro || '暂无介绍' }}</span></div></template></el-table-column>
        <el-table-column prop="courseTag" label="课程标签" min-width="180" show-overflow-tooltip />
        <el-table-column label="课程价格" width="120"><template #default="{ row }"><b>{{ formatCurrency(row.coursePrice) }}</b></template></el-table-column>
        <el-table-column label="上线状态" width="110"><template #default="{ row }"><el-tag :type="row.isOnline ? 'success' : 'info'">{{ row.isOnline ? '已上线' : '未上线' }}</el-tag></template></el-table-column>
        <el-table-column label="数据状态" width="100"><template #default="{ row }"><el-tag :type="row.isDeleted ? 'danger' : 'success'">{{ row.isDeleted ? '已删除' : '正常' }}</el-tag></template></el-table-column>
        <el-table-column label="时间" width="190"><template #default="{ row }"><div class="audit-cell"><span>创建 {{ formatDateTime(row.createTime) }}</span><span>更新 {{ formatDateTime(row.updateTime) }}</span></div></template></el-table-column>
        <el-table-column label="操作" width="120" fixed="right"><template #default="{ row }"><el-button link type="primary">查看</el-button><DeleteAction :title="row.courseName" :loading="store.submittingId === row.id" :on-delete="() => store.remove(row.id)" /></template></el-table-column>
      </el-table>
    </DataTableCard>
  </section>
</template>
<style scoped>.primary-cell strong,.primary-cell span,.audit-cell span{display:block}.primary-cell span{margin-top:5px;color:#7c8799;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.audit-cell span{color:#7c8799;font-size:12px;line-height:1.5}</style>
```

- [ ] **步骤 7：运行四类内容页面测试验证通过**

运行：

```bash
npm test -- tests/views/content-management-views.test.ts
```

预期：PASS，4 个测试通过。

- [ ] **步骤 8：提交内容管理页面**

```bash
git add pbw-admin-frontend/src/views/content pbw-admin-frontend/tests/views/content-management-views.test.ts
git commit -m "feat: 实现内容管理页面"
```

---

### 任务 12：集成验证、响应式 QA 与最终审查

**文件：**
- 修改：`pbw-admin-frontend/src/styles/index.css`
- 修改：前述任务中发现问题的最小相关文件
- 测试：`pbw-admin-frontend/tests/**/*.test.ts`

- [ ] **步骤 1：补充全局 Element Plus 视觉变量**

在 `pbw-admin-frontend/src/styles/index.css` 末尾追加：

```css
.el-card {
  border-color: var(--pbw-border);
  border-radius: 12px;
}

.el-button--primary {
  --el-button-bg-color: var(--pbw-primary);
  --el-button-border-color: var(--pbw-primary);
  --el-button-hover-bg-color: #6c82f5;
  --el-button-hover-border-color: #6c82f5;
}

.el-table {
  --el-table-border-color: #edf0f4;
  --el-table-header-bg-color: #f8f9fb;
}

.danger-confirm {
  --el-button-bg-color: #df4657;
  --el-button-border-color: #df4657;
}

@media (max-width: 768px) {
  .el-message-box { width: calc(100vw - 32px); }
  .el-table { min-width: 760px; }
}
```

- [ ] **步骤 2：运行全量单元和组件测试**

运行：

```bash
npm test
```

预期：所有测试 PASS；输出中没有未处理 Promise、Vue 警告或控制台错误。

- [ ] **步骤 3：验证用户安全边界**

运行：

```bash
rg -n "password" src/models/entities.ts src/mocks src/stores || true
```

预期：没有输出；密码只允许出现在 `models/auth.ts`、登录页、认证 Service 和对应测试中。

- [ ] **步骤 4：运行类型检查和生产构建**

运行：

```bash
npm run type-check
npm run build
```

预期：两个命令退出码均为 0；生成 `dist/`，且其内容被 `.claudeignore` 和 `.gitignore` 忽略，不读取或提交。

- [ ] **步骤 5：启动本地应用并进行桌面端浏览器 QA**

运行：

```bash
npm run dev -- --host 127.0.0.1
```

使用 `browser:control-in-app-browser` 打开 Vite 返回的本地 URL，按以下路径检查：

1. `/login` 显示 A「岩蓝专注」双栏登录页。
2. 使用 `admin / 123456` 登录后进入 `/dashboard`。
3. 侧栏包含首页、用户管理和五个内容管理子菜单。
4. 依次打开 `/users`、`/content/basic-info`、`/content/videos`、`/content/materials`、`/content/matrix-accounts`、`/content/courses`。
5. 确认每页字段、示例数据、空值占位和操作列符合规格。
6. 在用户、视频、素材、矩阵账号和课程页各执行一次删除，确认弹窗、成功反馈和列表即时更新。
7. 刷新页面，确认被删除 mock 记录恢复。
8. 检查浏览器控制台没有错误。

- [ ] **步骤 6：进行平板和手机响应式 QA**

通过浏览器 viewport 能力分别检查：

- 1024 × 768：统计卡片允许两列，内容区无严重遮挡。
- 768 × 1024：侧栏收窄，表格可横向滚动。
- 390 × 844：登录页单栏，侧栏以窄栏或抽屉呈现，确认弹窗不超出屏幕。

发现布局或交互问题时，先新增能复现行为的测试；纯 CSS 视觉问题记录截图和具体 viewport，做最小样式修复后重新检查三档尺寸。

- [ ] **步骤 7：调用代码审查技能**

使用 `requesting-code-review` 技能检查：

- 规格覆盖度。
- 页面是否直接访问 axios 或 mock。
- 删除失败是否错误移除本地数据。
- 密码是否进入安全边界外的模型或状态。
- 数据库字段是否遗漏或命名不一致。
- Element Plus 与响应式布局是否存在明显回归。

若发现问题，按 TDD 写失败测试并修复，再重新运行步骤 2 至步骤 6。

- [ ] **步骤 8：调用完成前验证技能并检查提交范围**

使用 `verification-before-completion` 技能重新运行：

```bash
npm test
npm run type-check
npm run build
git diff --check
git status --short
```

预期：测试、类型检查和构建全部成功；无空白错误；暂存区只包含计划内文件。

- [ ] **步骤 9：展示最终提交摘要并提交**

如果响应式 QA 或代码审查产生修复，先向用户展示变更摘要，再提交修复：

```bash
git add .gitignore pbw-admin-frontend docs/superpowers/plans/2026-07-16-pbw-admin-frontend.md
git diff --cached --check
git commit -m "feat: 完成后台管理前端"
```

如果前面任务已经提交全部实现且本步骤无新变更，不创建空提交。

---

## 计划完成判定

- `pbw-admin-frontend/` 工程可安装、测试、类型检查、构建和启动。
- `admin / 123456` 测试登录、路由守卫和退出登录可用。
- 首页、用户、基本信息、视频、素材、矩阵账号和课程页面全部可访问。
- 五类列表页面的删除确认、本地移除和刷新恢复可用。
- 用户领域模型、mock、Store 和页面中不存在明文密码。
- 所有前端字段使用驼峰命名，并覆盖 `database.sql` 对应字段。
- `api/` 独立于 `utils/`，页面不直接调用 axios。
- 桌面、平板和手机三档布局通过浏览器 QA。
- Vitest、`vue-tsc` 和 Vite 生产构建全部通过。
