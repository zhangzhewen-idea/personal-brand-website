# pbw-web-frontend 视觉验收与差异修复实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 `pbw-web-frontend` 与 `ui-figma` 的五个用户端路由在桌面与移动视口逐页对照，并修复可复现的结构、样式、交互和数据映射差异。

**架构：** 保持页面 → Pinia Store → Service → mock/API 的边界不变；`ui-figma` 是视觉基准，`database.sql` 是实体字段基准。每项修复定位到责任组件或展示配置，禁止以页面级临时覆盖掩盖组件问题。

**技术栈：** Vue 3、TypeScript、Vue Router、Pinia、Tailwind CSS 4、Vite、Vitest、Vue Test Utils。

**设计规格：** `docs/superpowers/specs/2026-07-16-pbw-web-frontend-design.md`

---

## 文件结构与职责

- 修改：`pbw-web-frontend/src/components/layout/Navigation.vue`、`Footer.vue`——公共布局与响应式导航差异。
- 修改：`pbw-web-frontend/src/views/*.vue`、`src/components/sections/**`——路由专属的原型结构、间距与交互差异。
- 修改：`pbw-web-frontend/src/styles/index.css`——跨页面共享的视觉规则。
- 修改：`pbw-web-frontend/src/configs/*.config.ts`、`src/mocks/content.mock.ts`——原型展示与数据库字段语义冲突的数据。
- 修改：`pbw-web-frontend/tests/**/*.test.ts`——可自动断言的回归覆盖。

### 任务 1：建立可重复的逐页验收基线

**文件：**
- 修改：`pbw-web-frontend/package.json`（仅当开发端口无法与原型并行启动时）
- 测试：`pbw-web-frontend/tests/integration/page-routes.test.ts`

- [ ] **步骤 1：运行路由基线测试**

运行：

```bash
cd pbw-web-frontend && npm test -- tests/integration/page-routes.test.ts
```

预期：`/`、`/services`、`/consulting`、`/about`、`/login` 均通过挂载断言。

- [ ] **步骤 2：启动两套页面并记录差异**

运行：

```bash
cd ui-figma && npm run dev -- --host 127.0.0.1
cd pbw-web-frontend && npm run dev -- --host 127.0.0.1
```

对五个路由在 `1440 × 900` 和 `390 × 844` 截取首屏与全页。每条差异记录为“路由 / 视口 / 原型可见结果 / Vue 可见结果 / 组件路径”；没有可见差异不创建修复项。

- [ ] **步骤 3：验证数据边界**

运行：

```bash
cd pbw-web-frontend && npm test -- tests/api/api-contract.test.ts tests/services/content-services.test.ts tests/mocks/content.mock.test.ts
```

预期：契约测试全部通过，公开用户资料不含 `password`。

### 任务 2：修复确认的组件差异

**文件：**
- 修改：`pbw-web-frontend/src/components/layout/Navigation.vue`
- 修改：`pbw-web-frontend/src/components/layout/Footer.vue`
- 修改：`pbw-web-frontend/src/components/sections/home/*.vue`
- 修改：`pbw-web-frontend/src/components/sections/services/CourseCard.vue`
- 修改：`pbw-web-frontend/src/components/sections/consulting/ConsultingServiceCard.vue`
- 修改：`pbw-web-frontend/src/components/sections/about/*.vue`
- 修改：`pbw-web-frontend/src/components/sections/auth/*.vue`
- 修改：`pbw-web-frontend/src/styles/index.css`
- 测试：`pbw-web-frontend/tests/views/*.test.ts`

- [ ] **步骤 1：为每项差异编写失败的回归断言**

将问题定位到最小责任组件；公共导航写入 `tests/app-shell.test.ts`，认证页签和密码显隐写入 `tests/views/auth-view.test.ts`，页面区块存在性写入对应 `tests/views/<page>-view.test.ts`。断言使用可见文本、ARIA 属性或 `data-testid`，不直接断言 Tailwind 类名。

- [ ] **步骤 2：运行受影响测试，确认它能捕获差异**

运行：

```bash
cd pbw-web-frontend && npm test -- tests/app-shell.test.ts tests/views/home-view.test.ts tests/views/services-view.test.ts tests/views/consulting-view.test.ts tests/views/about-view.test.ts tests/views/auth-view.test.ts
```

预期：新增断言在修复前失败，信息指向缺失的结构或错误交互。

- [ ] **步骤 3：实施最小组件级修复**

公共问题修改 `Navigation.vue`、`Footer.vue` 或 `styles/index.css`；页面专属问题修改相应 `sections/` 组件；可见内容问题修改 `configs/`；字段映射问题修改 Service、mapper 或 mock。禁止在页面根节点添加仅用于覆盖子组件的样式。

- [ ] **步骤 4：运行受影响测试并双视口复验**

运行：

```bash
cd pbw-web-frontend && npm test -- tests/app-shell.test.ts tests/views/home-view.test.ts tests/views/services-view.test.ts tests/views/consulting-view.test.ts tests/views/about-view.test.ts tests/views/auth-view.test.ts
```

预期：测试通过，差异在两个规定视口均消失，且页面无横向滚动。

### 任务 3：完成回归验证与交付记录

**文件：**
- 修改：`pbw-web-frontend/tests/**`（仅因确认的回归缺口）
- 修改：`pbw-web-frontend/src/**`（仅因确认的差异）

- [ ] **步骤 1：执行完整自动化验证**

运行：

```bash
cd pbw-web-frontend && npm test && npm run type-check && npm run build
```

预期：测试、类型检查和生产构建均以退出码 `0` 完成。

- [ ] **步骤 2：执行最终视觉回归**

重复十组页面/视口组合。验收为：无缺失区块、无明显布局偏移、无颜色或渐变偏差、无移动端横向溢出，且菜单、页签、弹窗与密码显隐均可展示。

- [ ] **步骤 3：检查提交边界并提交**

运行：

```bash
git diff --check
git status --short
```

预期：无空白错误；仅包含本计划确认的用户端源码和测试，不包含 `.superpowers/`、`ui-figma/`、数据库或其他无关未跟踪文件。提交前先向用户展示变更摘要；获准后使用 `fix: 对齐用户端原型页面` 提交。

