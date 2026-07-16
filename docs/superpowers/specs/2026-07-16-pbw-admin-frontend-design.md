# pbw-admin-frontend 后台管理前端设计规格

- 日期：2026-07-16
- 状态：已完成交互式设计确认，待书面规格审查
- 目标目录：`pbw-admin-frontend/`
- 数据来源：`database.sql`
- 视觉方向：A「岩蓝专注」

## 1. 背景与目标

在 `pbw-admin-frontend/` 中创建个人品牌网站的后台管理前端工程，为管理员提供登录入口、数据概览和数据库业务表对应的管理页面。

本阶段目标如下：

1. 使用 Vue 3、TypeScript、Vue Router、Pinia、Element Plus、axios 和 Vite 建立可直接进入后续开发的前端工程。
2. 根据 `database.sql` 中的 `basic_info`、`video`、`material_library`、`matrix_account`、`course`、`users` 六张表设计页面、字段和示例数据。
3. 前端领域模型、页面状态和 mock 数据统一使用驼峰命名；数据库或未来 API 的下划线字段通过 mapper 转换。
4. 登录页提供临时测试模式，在没有后端 API 时可使用 `admin / 123456` 登录并浏览全部后台页面。
5. 当前以本地异步 mock 数据驱动页面，同时建立独立 `api/` 目录和 axios 请求边界，为后续接口联调保留稳定结构。
6. 除删除外，本阶段只实现页面原型和必要的本地交互；用户、视频、素材、矩阵账号和课程支持本地删除。
7. 采用桌面端优先的响应式设计，同时保证平板和手机可用。

## 2. 范围与非目标

### 2.1 本阶段实现

- 管理员账号密码登录页面。
- 临时测试登录、登录状态保存、路由守卫和退出登录。
- 登录后的响应式后台框架，包括侧栏、顶栏、面包屑、管理员菜单和内容区。
- 首页数据概览。
- 用户管理页面。
- 基本信息页面。
- 视频管理页面。
- 素材管理页面。
- 矩阵账号页面。
- 课程管理页面。
- 用户、视频、素材、矩阵账号和课程的删除确认与本地删除。
- 加载、空数据和错误状态。
- 页面展示所需的查询栏、分页、新增、查看和编辑控件原型。

### 2.2 本阶段不实现

- 真实后端登录、刷新 token 和权限体系。
- 新增、编辑、详情提交、查询、筛选、排序和批量操作的业务逻辑。
- 文件上传、图片上传、视频上传和资源预览服务。
- 真实数据库删除和删除恢复。
- 生产环境配置、部署和 CI/CD。

查询、新增、查看和编辑控件会保留完整视觉形态，但不会产生数据修改。删除是本阶段唯一真实执行的数据修改行为。

## 3. 输入来源与数据约束

### 3.1 来源优先级

1. `database.sql` 决定业务实体、字段含义、字段类型、可选性和示例数据规模。
2. 已确认的 A「岩蓝专注」方案决定后台框架、色彩、层次和页面信息密度。
3. Element Plus 决定基础控件交互规范，项目样式覆盖仅用于统一视觉，不改变控件语义。
4. SQL 中的 `cdn.example.com`、`pan.example.com` 等地址仅作为示例文本和媒体占位，不视为可用线上资源。

### 3.2 命名规则

- 数据库和未来 API DTO 可使用 `snake_case`，例如 `video_title`、`course_price`。
- 页面、Store、Service、领域模型和 mock 数据统一使用 `camelCase`，例如 `videoTitle`、`coursePrice`。
- mapper 负责 DTO 与领域模型之间的字段转换，页面不得直接处理下划线字段。
- `TINYINT(1)` 在前端领域模型中转换为 `boolean`。
- `DECIMAL(10,2)` 在前端领域模型中使用 `number`，显示时统一格式化为人民币金额。
- `DATETIME` 在前端使用 ISO 日期时间字符串，页面统一格式化展示。
- `annual_top_10_films` 和 `influential_three_directors` 解析为 `string[]`。

### 3.3 密码安全边界

`users.password` 仅用于说明数据库存在认证凭据，不进入用户列表模型、用户详情、Store 持久化或普通 mock 响应。

前端只在登录表单中定义：

```ts
interface LoginPayload {
  account: string
  password: string
  testMode: boolean
}
```

测试模式校验完成后立即丢弃输入密码，只保存测试 token 和不含密码的管理员资料。

## 4. 技术方案

### 4.1 技术栈

- Vue 3 Composition API
- TypeScript
- Vue Router
- Pinia
- Element Plus
- axios
- Vite
- Vitest
- Vue Test Utils
- `vue-tsc`

### 4.2 设计方案

采用“业务页面 + 共享管理组件”方案：

- 每张数据库表拥有职责明确的业务页面。
- 查询栏、数据表容器、分页、状态标签、空状态和删除确认由共享组件提供。
- 页面按业务差异决定列和展示单元，不使用高度抽象的元数据生成器。
- 页面不直接调用 axios 或导入 mock 数据。
- Pinia 只管理认证、列表、加载、提交和错误状态。
- Service 负责编排登录、读取、删除和数据源切换。
- 当前 Repository 使用异步内存 mock；未来 Repository 可切换到 `api/modules/`。

### 4.3 主数据流

```text
Views / Components
        ↓
Pinia Stores
        ↓
Services
        ↓
当前：Mock Repositories     未来：API Modules + axios
               ↘          ↙
            Domain Models
```

依赖规则：

- Views 和 Components 只能调用 Store action。
- Store 只能调用 Service。
- Service 通过 Repository 接口访问当前数据源。
- Mock Repository 与 API Repository 返回相同领域模型。
- `api/` 为独立顶层目录，不放入 `utils/`。

## 5. 目录结构

```text
pbw-admin-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── http.ts
│   │   ├── dto/
│   │   ├── mappers/
│   │   └── modules/
│   │       ├── auth.api.ts
│   │       ├── basic-info.api.ts
│   │       ├── course.api.ts
│   │       ├── material-library.api.ts
│   │       ├── matrix-account.api.ts
│   │       ├── user.api.ts
│   │       └── video.api.ts
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── configs/
│   ├── models/
│   ├── mocks/
│   │   ├── data/
│   │   └── repositories/
│   ├── repositories/
│   ├── router/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── utils/
│   ├── views/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── content/
│   ├── App.vue
│   └── main.ts
├── tests/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

目录职责：

- `api/`：axios 实例、接口 DTO、mapper 和真实接口模块。
- `repositories/`：定义数据访问接口，隔离 Service 与具体数据源。
- `mocks/`：数据库示例数据的驼峰版本和异步内存 Repository。
- `services/`：认证、读取和删除业务编排。
- `stores/`：Pinia 页面状态。
- `components/common/`：共享管理组件。
- `components/layout/`：后台框架组件。
- `views/`：路由页面和业务组合。
- `utils/`：纯函数工具，不存放 API 接口。

## 6. 视觉系统

### 6.1 A「岩蓝专注」

- 侧栏：深岩蓝黑 `#111827`。
- 页面背景：浅灰蓝 `#F4F6FA`。
- 卡片与顶栏：白色 `#FFFFFF`。
- 主强调色：岩蓝 `#5B73F2`。
- 主文字：深蓝灰 `#172033`。
- 次文字：中性灰蓝 `#7C8799`。
- 成功：青绿；警告：琥珀；危险操作：克制的红色。
- 圆角以 8px 至 12px 为主，阴影轻量，避免厚重拟物效果。

### 6.2 布局

- 桌面端侧栏固定在左侧，顶栏固定在内容区顶部。
- 工作区使用 24px 左右的安全间距，内容卡片之间保持 16px 左右间距。
- 数据表优先保证字段对齐和可读性，操作列固定在右侧。
- 平板端压缩侧栏宽度和卡片间距。
- 手机端侧栏改为抽屉，统计卡片改为单列或双列，表格允许横向滚动。
- 登录页桌面端使用品牌区与表单区双栏布局，手机端改为单栏。

### 6.3 Element Plus 适配

- 使用 Element Plus 的表单、输入框、按钮、菜单、表格、分页、标签、消息和确认弹窗。
- 通过项目级 CSS 变量统一主色、圆角、边框和表格表头，不在业务组件中重复覆盖样式。
- 危险按钮只在操作列和确认弹窗中使用红色，避免页面大面积出现危险色。

## 7. 页面信息架构

### 7.1 路由

| 路由 | 页面 | 数据来源 | 删除 |
| --- | --- | --- | --- |
| `/login` | 管理员登录 | 测试认证 Service | 不适用 |
| `/` | 后台框架重定向 | 路由配置 | 不适用 |
| `/dashboard` | 首页工作台 | 六类 mock 数据汇总 | 不适用 |
| `/users` | 用户管理 | `users` | 支持 |
| `/content/basic-info` | 基本信息 | `basic_info` | 不支持 |
| `/content/videos` | 视频管理 | `video` | 支持 |
| `/content/materials` | 素材管理 | `material_library` | 支持 |
| `/content/matrix-accounts` | 矩阵账号 | `matrix_account` | 支持 |
| `/content/courses` | 课程管理 | `course` | 支持 |

### 7.2 菜单

```text
首页
用户管理
内容管理
├── 基本信息
├── 视频管理
├── 素材管理
├── 矩阵账号
└── 课程管理
```

侧栏根据当前路由高亮，子菜单默认在内容管理路由下展开。顶栏展示菜单折叠按钮、面包屑和管理员菜单。

## 8. 页面设计

### 8.1 登录页

登录页包含：

- PBW Admin 品牌标识与后台定位文案。
- 管理员账号输入框。
- 密码输入框和显隐按钮。
- 临时测试模式提示。
- 登录按钮。
- 表单校验和错误提示。

测试模式使用 `admin / 123456`。成功后生成本地测试 token，保存到 `sessionStorage`，跳转 `/dashboard`。账号或密码不正确时停留在登录页并显示可读错误。

路由守卫规则：

- 未登录访问后台路由时跳转 `/login`。
- 已登录访问 `/login` 时跳转 `/dashboard`。
- 退出登录时清除测试 token 和管理员资料，再跳转 `/login`。

### 8.2 首页工作台

首页只使用数据库示例数据计算可解释指标：

- 用户数量。
- 视频数量。
- 素材数量和素材价格总计。
- 矩阵账号数量。
- 课程总数与已上线课程数量。
- 基本信息中的全网播放量、点赞数和粉丝数。
- 最近更新内容列表。

不展示数据库无法支持的同比、增长率、访问量或收入趋势，避免用虚构数据伪装真实指标。

### 8.3 用户管理

主要列表字段：

- `id`
- `avatar`
- `nickname`
- `account`
- `email`
- `role`
- `createTime`
- `updateTime`
- `isDeleted`

`password` 不展示。角色使用 Element Plus 标签区分“用户”和“管理员”。删除动作显示昵称与账号，确认成功后从当前列表移除。

### 8.4 基本信息

`basic_info` 是单例配置页，不使用普通表格。页面将字段分为：

- 品牌统计：`totalPlayCount`、`totalLikeCount`、`totalFollowerCount`。
- 品牌表达：`authorIdentityTag`、`slogan`、`creationAttitude`。
- 媒体资源：`homeCoverVideo`、`authorPhoto`、`editingDeskWorkPhoto`、`assetLibraryScreenshot`、`dailyMovieWatchingPhoto`。
- 年度内容：`annualTop10Films`、`influentialThreeDirectors`。
- 联系方式：`contactEmail`、`contactQrCode`、`contactInfo`。
- 审计信息：`id`、`createTime`、`updateTime`、`isDeleted`。

页面展示编辑控件原型，但本阶段不保存修改，也不提供删除。

### 8.5 视频管理

列表和展示字段：

- `id`
- `videoCover`
- `videoTitle`
- `videoIntro`
- `videoUrl`
- `createTime`
- `updateTime`
- `isDeleted`

标题和介绍组合为主要信息单元，封面使用固定比例缩略图，长地址省略显示并保留完整文本提示。

### 8.6 素材管理

列表和展示字段：

- `id`
- `materialPhoto`
- `materialTitle`
- `materialIntro`
- `price`
- `netdiskUrl`
- `createTime`
- `updateTime`
- `isDeleted`

价格格式化为人民币，素材图使用固定比例缩略图，网盘地址采用省略显示。

### 8.7 矩阵账号

列表和展示字段：

- `id`
- `platformLogo`
- `platformName`
- `accountUrl`
- `intro`
- `createTime`
- `updateTime`
- `isDeleted`

平台 Logo 与平台名称组合显示，账号地址采用省略显示。

### 8.8 课程管理

列表和展示字段：

- `id`
- `courseName`
- `courseTag`
- `courseIntro`
- `coursePrice`
- `isOnline`
- `createTime`
- `updateTime`
- `isDeleted`

课程价格格式化为人民币，`isOnline` 使用“已上线 / 未上线”状态标签。

## 9. 领域模型

```ts
interface AuditFields {
  id: number
  createTime: string
  updateTime: string
  isDeleted: boolean
}

interface BasicInfo extends AuditFields {
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

interface Video extends AuditFields {
  videoTitle: string
  videoIntro: string | null
  videoUrl: string
  videoCover: string | null
}

interface MaterialLibraryItem extends AuditFields {
  materialTitle: string
  materialPhoto: string | null
  materialIntro: string | null
  price: number
  netdiskUrl: string | null
}

interface MatrixAccount extends AuditFields {
  platformName: string
  platformLogo: string | null
  accountUrl: string | null
  intro: string | null
}

interface Course extends AuditFields {
  courseName: string
  courseTag: string | null
  courseIntro: string | null
  coursePrice: number
  isOnline: boolean
}

type UserRole = '用户' | '管理员'

interface UserProfile extends AuditFields {
  nickname: string
  account: string
  email: string | null
  avatar: string | null
  role: UserRole
}
```

## 10. 删除功能

### 10.1 支持范围

- 用户管理。
- 视频管理。
- 素材管理。
- 矩阵账号。
- 课程管理。

基本信息不支持删除。

### 10.2 交互流程

1. 用户点击表格行的删除按钮。
2. 页面将记录 id 和可识别标题传给共享删除确认组件。
3. Element Plus 弹窗显示删除对象和测试模式说明。
4. 用户取消时不调用 Store，不修改列表。
5. 用户确认时禁用重复提交，Store 调用对应 Service。
6. 当前 Mock Repository 从内存集合移除记录。
7. Service 成功后 Store 更新列表并显示成功消息。
8. Service 失败时保留原列表并显示错误消息。
9. 刷新页面后 mock 数据从初始数据重新加载，被删除记录恢复。

### 10.3 API 预留

每个支持删除的实体均建立独立接口方法，真实联调时由 API Repository 调用相对路径，例如：

```ts
await http.delete(`/users/${id}`)
await http.delete(`/videos/${id}`)
await http.delete(`/materials/${id}`)
await http.delete(`/matrix-accounts/${id}`)
await http.delete(`/courses/${id}`)
```

最终接口路径以后端契约为准；页面和 Store 不依赖这些路径。

## 11. 错误处理与状态

- API 和 Mock Repository 将底层错误标准化为统一应用错误。
- Service 将底层错误映射为用户可读的中文业务消息。
- Store 暴露 `loading`、`submitting` 和 `error` 状态。
- 页面首次加载失败时展示错误状态和重新加载入口。
- 空列表展示 Element Plus 空状态。
- 删除失败时保留原始记录，不做乐观删除。
- 删除提交期间禁用当前确认按钮，防止重复操作。
- 无效或过期测试会话统一清理后跳转登录页。
- 图片加载失败时显示稳定占位，不让表格行高度塌陷。

## 12. 共享组件边界

- `AdminLayout`：侧栏、顶栏、移动端抽屉和内容区。
- `AdminSidebar`：菜单树和路由高亮。
- `AdminHeader`：折叠按钮、面包屑和管理员菜单。
- `PageHeader`：标题、说明和页面级操作区。
- `ListToolbar`：搜索、筛选和查询控件原型。
- `DataTableCard`：表格、加载、空状态和分页容器。
- `StatusTag`：删除状态、角色和上线状态展示。
- `MediaThumbnail`：图片缩略图和失败占位。
- `DeleteAction`：删除按钮、确认弹窗和提交状态。

共享组件只负责可复用界面和交互协议，不导入业务 mock，也不直接访问 Service。

## 13. 测试策略

遵循 TDD，先编写失败测试，再实现最少代码通过测试。

### 13.1 单元测试

- DTO 到领域模型的驼峰字段映射。
- JSON 数组字段解析和空值处理。
- 价格、日期和大数字格式化。
- 测试账号登录成功和错误凭据失败。
- 测试会话保存、读取和清理。
- Mock Repository 删除成功、目标不存在和刷新恢复初始数据。
- Service 删除成功和失败错误转换。
- Store 只在删除成功后移除记录。

### 13.2 组件与路由测试

- 未登录访问后台路由会跳转登录页。
- 已登录访问登录页会跳转首页。
- 侧栏菜单与数据库管理页面一致。
- 用户列表不渲染密码字段。
- 删除取消不会调用 Store。
- 删除确认只调用一次 Store action。
- 删除提交期间按钮不可重复触发。
- 各业务页面正确渲染数据库示例字段。

### 13.3 构建与视觉验证

- Vitest 全量测试通过。
- `vue-tsc` 类型检查通过。
- Vite 生产构建通过。
- 浏览器控制台无错误。
- 桌面、平板、手机三档页面无严重溢出。
- 手机端侧栏抽屉、登录单栏和表格横向滚动正常。
- 删除确认、取消、成功和失败状态均可见且可辨识。

## 14. 验收标准

1. `pbw-admin-frontend/` 可安装依赖并通过 Vite 启动。
2. 技术栈符合 Vue 3、TypeScript、Vue Router、Pinia、Element Plus、axios 和 Vite 要求。
3. 无后端时可使用 `admin / 123456` 登录并访问所有后台页面。
4. 登录状态和路由守卫行为正确，退出后无法继续访问后台路由。
5. 菜单、路由和页面覆盖六张数据库表对应的管理场景。
6. 页面字段和 mock 数据与 `database.sql` 一致，前端使用驼峰命名。
7. `api/` 为独立目录，页面不直接调用 axios。
8. 五类列表数据支持本地删除，取消、成功和失败流程符合设计。
9. 刷新页面后被删除的 mock 记录恢复。
10. 基本信息页面不提供删除。
11. 用户列表和会话中不保存或展示数据库明文密码。
12. 页面在桌面、平板和手机端可用，视觉符合 A「岩蓝专注」。
13. 单元测试、类型检查和生产构建全部通过。
