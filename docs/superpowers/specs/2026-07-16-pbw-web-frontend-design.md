# pbw-web-frontend 用户端前端设计规格

- 日期：2026-07-16
- 状态：已完成交互式设计确认
- 目标目录：`pbw-web-frontend/`
- 视觉来源：`ui-figma/`
- 数据来源：`database.sql`

## 1. 背景与目标

在 `pbw-web-frontend/` 中创建用户端前端工程，将现有 React 原型 `ui-figma/` 等价迁移为 Vue 3 页面，并保持桌面端与移动端视觉一致。

本阶段的目标是：

1. 使用 Vue 3、TypeScript、Vue Router、Pinia、Tailwind CSS、axios 和 Vite 建立工程。
2. 一比一复刻原型中的首页、服务、商业咨询、关于我、登录/注册页面。
3. 使用与 `database.sql` 一致的业务实体字段，前端与 mock 数据统一采用驼峰命名。
4. 当前通过异步 mock Service 驱动页面，同时保留以后切换真实 API 的稳定边界。
5. 采用适度分层设计，确保页面、状态、业务编排、mock 和 API 各自职责明确。

## 2. 非目标

本阶段不实现以下业务能力：

- 真实登录、注册、退出和用户会话。
- 真实购买、支付、下载和网盘跳转流程。
- 真实表单提交、商业咨询提交和课程报名。
- 真实视频播放控制和播放数据统计。
- 真实 API 请求、接口联调和后端错误码适配。
- 后台管理页面。

允许实现页面展示所必需的本地交互：路由跳转、移动端菜单、登录/注册页签、弹窗开关、密码显隐、悬停动效和首页滚动提示。

## 3. 输入来源与优先级

当原型内容与数据库示例数据不完全一致时，采用以下优先级：

1. `ui-figma/` 决定页面结构、展示文案、图片、视觉样式和响应式行为。
2. `database.sql` 决定业务实体名称、字段含义、字段类型和可选性。
3. 原型额外字段作为展示配置，不扩充或污染数据库实体模型。
4. SQL 中的 `cdn.example.com`、`pan.example.com` 等占位地址不作为视觉验收资源；存在对应数据库媒体字段时，mock 使用原型中可正常展示的资源 URL。
5. 首页原型使用图片模拟视频封面，但数据库只有 `home_cover_video`。因此 `homeCoverVideo` 保留视频字段语义，首页静态海报放入 `homeHeroPoster` 展示配置，不把图片 URL 错填为视频字段。
6. SQL 的 `INSERT` 内容只用于理解字段语义和示例规模，不要求逐字、逐 URL 复制；页面可见值以原型为准，密码示例数据不得进入前端 mock。

## 4. 技术方案

### 4.1 技术栈

- Vue 3 Composition API
- TypeScript
- Vue Router
- Pinia
- Tailwind CSS 4
- axios
- Vite
- `lucide-vue-next`，用于等价替换原型中的 Lucide 图标
- Vitest、Vue Test Utils 和 `vue-tsc`，用于验证与类型检查

不引入额外的完整 UI 组件库。原型需要的按钮、弹窗、页签和输入框由项目内基础组件配合 Tailwind CSS 实现，避免额外组件库默认样式影响复刻精度。

### 4.2 总体数据流

```text
views / components
        ↓
Pinia stores
        ↓
services
        ↓
当前：mocks        未来：api/modules + axios
        ↘          ↙
        TypeScript models
```

边界规则：

- 页面和组件不得直接导入 mock 数据。
- 页面和组件不得直接调用 axios。
- Store 只调用 Service。
- Service 负责异步数据读取、默认值处理和页面 ViewModel 组合。
- `api/` 是独立顶层目录，不放入 `utils/`。
- mock 与 API 向 Service 返回同一组 TypeScript 模型。

## 5. 建议目录结构

```text
pbw-web-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── http.ts
│   │   ├── mappers/
│   │   └── modules/
│   │       ├── basic-info.api.ts
│   │       ├── course.api.ts
│   │       ├── material-library.api.ts
│   │       ├── matrix-account.api.ts
│   │       ├── user.api.ts
│   │       └── video.api.ts
│   ├── assets/
│   ├── components/
│   │   ├── base/
│   │   ├── layout/
│   │   ├── shared/
│   │   └── sections/
│   │       ├── about/
│   │       ├── auth/
│   │       ├── consulting/
│   │       ├── home/
│   │       └── services/
│   ├── configs/
│   ├── mocks/
│   ├── models/
│   ├── router/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── views/
│   ├── App.vue
│   └── main.ts
├── tests/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 6. 路由与页面设计

### 6.1 公共布局

`SiteLayout` 包含：

- `Navigation`：品牌、桌面导航、登录入口、移动端菜单。
- `RouterView`：当前页面内容。
- `Footer`：品牌说明、快速链接、联系方式和版权信息。

`AuthLayout` 仅用于 `/login`，不展示公共导航和页脚。

### 6.2 路由表

| 路由 | 页面 | 主要区块 | 数据来源 |
| --- | --- | --- | --- |
| `/` | `HomeView` | `VideoHero`、`VideoGallery`、`MaterialLibrary`、`MatrixAccounts` | 数据库实体 + 展示配置 |
| `/services` | `ServicesView` | `CourseHero`、`CourseGrid`、`CourseCard`、`CourseConsultDialog`、`CourseCTA` | `course` + 展示配置 |
| `/consulting` | `ConsultingView` | `ConsultingHero`、`ServiceGrid`、`CooperationWorkflow`、`CaseStudies` | 静态展示配置 |
| `/about` | `AboutView` | `AboutHero`、`CreatorStats`、`Milestones`、`BehindTheScenes`、`ContactSection` | `basic_info`、`matrix_account` + 展示配置 |
| `/login` | `AuthView` | `BrandPanel`、`AuthTabs`、`LoginForm`、`RegisterForm` | 本地表单状态 |

### 6.3 共享组件

- `BaseButton`：原型按钮的主要、次要、描边和禁用样式。
- `BaseDialog`：素材、课程和咨询弹窗。
- `BaseTabs`：登录与注册切换。
- `BaseInput`：图标输入框、密码显隐和错误样式。
- `ResponsiveImage`：统一图片加载与失败占位。
- `SectionHeading`：页面区块标题与副标题。
- `StatItem`：播放量、点赞数和粉丝数展示。

组件保持职责单一。页面组件只组合区块，区块组件只处理单个视觉区域，基础组件不包含业务数据。

## 7. 数据模型

### 7.1 `BasicInfo`

```ts
interface BasicInfo {
  id: number
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
  createTime: string
  updateTime: string
  isDeleted: boolean
}
```

### 7.2 `Video`

```ts
interface Video {
  id: number
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
  createTime: string
  updateTime: string
  isDeleted: boolean
}
```

### 7.3 `MaterialLibraryItem`

```ts
interface MaterialLibraryItem {
  id: number
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  netdiskUrl: string | null
  createTime: string
  updateTime: string
  isDeleted: boolean
}
```

### 7.4 `MatrixAccount`

```ts
interface MatrixAccount {
  id: number
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
  createTime: string
  updateTime: string
  isDeleted: boolean
}
```

### 7.5 `Course`

```ts
interface Course {
  id: number
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
  createTime: string
  updateTime: string
  isDeleted: boolean
}
```

### 7.6 用户与认证输入

前端用户资料模型不得包含数据库中的 `password` 字段：

```ts
type UserRole = '用户' | '管理员'

interface UserProfile {
  id: number
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: UserRole
  createTime: string
  updateTime: string
  isDeleted: boolean
}

interface LoginPayload {
  account: string
  password: string
}

interface RegisterPayload {
  nickname: string
  account: string
  email: string
  password: string
}
```

`confirmPassword` 只存在于注册表单的本地状态，不属于数据库实体或 API 请求模型。

### 7.7 类型转换规则

| 数据库类型或格式 | 前端类型或格式 |
| --- | --- |
| `snake_case` | `camelCase` |
| `DECIMAL` | `number`，展示时统一格式化 |
| `TINYINT(1)` | `boolean` |
| `DATETIME` | ISO 日期字符串 |
| JSON 数组文本 | `string[]` |
| 可空字段 | `T | null` |

## 8. 展示配置与 ViewModel

以下原型字段在数据库中不存在，统一放入 `configs/`：

- 课程时长、课时数量、课程特色、卡片图标和卡片颜色。
- 视频所属平台、展示播放量和卡片展示样式。
- 素材数量、免费标签、图标和卡片颜色。
- 商业服务项目、服务特色、服务时长、合作流程和案例占位。
- 作者成长里程碑。
- 首页静态视频海报 `homeHeroPoster`。

Service 使用数据库实体和展示配置生成页面 ViewModel。数据库实体保持纯净，页面不直接执行配置合并。

## 9. mock 与 API 契约

### 9.1 当前 mock 模式

- mock 数据按业务实体拆分文件。
- 所有字段使用驼峰命名。
- mock Service 返回 `Promise`，模拟未来异步调用方式。
- 页面只消费 Service 返回值，不感知当前数据来自 mock。
- mock 用户资料不包含密码，也不模拟真实认证结果。

### 9.2 未来 API 模式

- `api/http.ts` 创建并导出 axios 实例。
- `api/modules/` 按实体拆分请求函数。
- API 响应格式与页面模型不一致时，在 `api/mappers/` 中转换。
- Store、页面和组件接口保持不变，只替换 Service 内部数据来源。
- 本阶段不创建或修改 `.env`，也不发出真实网络请求。

## 10. Pinia 状态设计

### 10.1 `siteStore`

管理：

- `basicInfo`
- `videos`
- `materials`
- `matrixAccounts`
- 对应加载状态与错误信息

首页、关于页和页脚复用同一份站点内容。

### 10.2 `courseStore`

管理：

- `courses`
- 课程加载状态与错误信息

### 10.3 本地状态

以下状态使用 Vue `ref` 或 `reactive`，不放入 Pinia：

- 移动端菜单开关。
- 弹窗开关。
- 登录/注册页签。
- 密码显隐。
- 登录与注册表单输入。

Store 加载状态统一为：

```ts
type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
```

## 11. 错误处理

- Service 捕获数据读取异常并返回统一错误。
- Store 保存面向页面的可读错误信息。
- mock 默认成功，不在正常视觉验收截图中展示错误区块。
- `ResponsiveImage` 在远程图片加载失败时显示统一占位图。
- `api/http.ts` 预留超时和响应错误标准化，但本阶段不触发真实请求。
- 用户资料、API 响应和 mock 数据均不得包含密码。

## 12. 视觉与响应式设计

### 12.1 视觉原则

- `ui-figma/` 是唯一视觉基准，不重新设计。
- 保持原型的蓝、紫、粉渐变和灰阶体系。
- 保持容器宽度、区块间距、卡片比例、圆角、阴影、透明度和背景模糊。
- 保持原型的悬停位移、缩放、阴影和颜色过渡。
- 原型的 `fonts.css` 为空，使用系统无衬线字体。
- 图标使用 `lucide-vue-next` 的对应图标。

### 12.2 响应式规则

- `390px`：单栏内容、移动菜单、首页统计三列、服务卡片纵向排列、登录页隐藏左侧品牌面板。
- `768px` 起：展示桌面导航，主要列表切换为双栏，关于页切换为双栏结构。
- `1024px` 起：素材与矩阵账号切换为四栏，登录页展示左右分屏。
- `1440px`：内容容器保持原型 `max-w-7xl`，不无限拉伸。
- 移动端不得出现横向滚动条。

## 13. 页面展示交互

保留以下本地交互：

- Vue Router 页面跳转和当前导航高亮。
- 移动端导航菜单展开与收起。
- 登录/注册页签切换。
- 密码显示与隐藏。
- 素材、课程和商业咨询弹窗。
- 首页向下滚动提示。
- 卡片、按钮和平台链接的原型悬停样式。

提交类按钮不得模拟成功结果。登录、注册、购买、下载和报名按钮只保留展示状态或打开原型弹窗，不改变用户业务状态。

## 14. 测试与验证

### 14.1 自动化验证

- `vue-tsc`：TypeScript 和 Vue 模板类型检查。
- Vitest：模型转换、格式化函数、mock Service、Pinia 加载状态。
- Vue Test Utils：五个路由的基础渲染、移动菜单、页签、弹窗和密码显隐。
- Vite 生产构建：确认工程可以生成生产构建产物。

重点测试：

- mock 字段全部为驼峰命名。
- `annualTop10Films` 与 `influentialThreeDirectors` 为字符串数组。
- `isOnline` 与 `isDeleted` 为布尔值。
- 价格和统计数字格式化结果正确。
- 用户资料和用户 mock 不包含 `password`。
- Store 状态可以完成 `idle → loading → success`，异常时进入 `error`。

### 14.2 视觉验收

对以下路由分别在 `1440 × 900` 和 `390 × 844` 下与原型进行同尺寸首屏截图和全页截图比较：

- `/`
- `/services`
- `/consulting`
- `/about`
- `/login`

允许浏览器字体抗锯齿和亚像素舍入差异。不允许出现：

- 页面区块缺失。
- 布局、间距或对齐明显偏移。
- 颜色、渐变、圆角或阴影不一致。
- 移动端横向溢出。
- 响应式断点行为不一致。
- 菜单、页签、弹窗或密码显隐无法展示。

## 15. 完成标准

满足以下条件后，本阶段实现才算完成：

1. `pbw-web-frontend/` 可以独立安装、开发启动和生产构建。
2. 五个路由均可访问，桌面端和移动端页面与原型一致。
3. 页面数据由异步 mock Service 提供，组件不直接依赖 mock 或 axios。
4. `api/` 独立存在并具备未来接入 axios 请求的清晰边界。
5. 六张表对应的页面模型和 mock 字段采用驼峰命名，敏感密码字段遵守安全拆分。
6. Pinia 只管理共享业务状态，本地 UI 状态留在组件中。
7. 类型检查、自动化测试和生产构建通过。
8. 五个路由完成 `1440 × 900` 与 `390 × 844` 的视觉验收。
