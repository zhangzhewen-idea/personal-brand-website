# Repository Guidelines

## 项目结构与模块组织

本仓库由四个独立子项目组成。`ui-figma/` 是 React + Vite 设计原型；`pbw-web-frontend/` 是 Vue 3 用户端；`pbw-admin-frontend/` 是 Vue 3 + Element Plus 管理端；`pbw-java-backend/` 是 Java 25、Spring Boot 后端。前端源码位于各模块的 `src/`，用户端测试与组件相邻，命名为 `*.spec.ts`。后端遵循 COLA light 分层：`adapter/`、`application/`、`domain/`、`infrastructure/`；测试位于 `src/test/java/`。数据库基线见 `database.sql`，后端迁移见 `src/main/resources/db/migration/`，设计与实施记录位于 `docs/superpowers/`。

## 构建、测试与本地开发

命令必须在目标子目录执行；仓库根目录没有统一构建脚本。

- `npm install`：安装对应前端模块依赖。
- `npm run dev`：启动前端；用户端默认端口为 `3001`，管理端默认端口为 `3002`，其他模块使用 Vite 默认端口。
- `npm run build`：执行 TypeScript 检查并构建 Vue 前端；`ui-figma` 仅执行 Vite 构建。
- `npm test`：在任一前端子项目中运行该模块的 Vitest 测试。
- `mvn spring-boot:run`：在 `pbw-java-backend/` 中以默认 `dev` Profile 启动后端。
- `mvn test`：运行 JUnit、ArchUnit 与 Testcontainers 测试；集成测试要求 Docker 可用。

## 编码风格与命名

前端使用 2 空格缩进；Vue 模块沿用单引号、无分号风格，`ui-figma/` 沿用双引号与分号，不要为统一格式产生无关 diff。组件使用 PascalCase，组合函数与变量使用 camelCase。Vue 路由页面命名为 `*View.vue`，可复用组件放入 `src/components/`，HTTP 调用集中在 `src/api/`。Java 使用 4 空格缩进；类使用 PascalCase，包名小写，并保持依赖方向为 `adapter -> application -> domain`，基础设施通过 gateway 接口接入。仓库暂未配置统一 ESLint、Prettier 或 Checkstyle，提交前应遵循相邻文件风格并运行构建。

## 测试规范

用户端使用 Vitest 与 Vue Test Utils，测试文件与被测页面或组件相邻，采用 `ComponentName.spec.ts`。后端使用 `*Test.java`，架构约束集中在 `ArchitectureTest`。新增交互、接口或分层依赖时应补充对应测试；当前没有强制覆盖率阈值。提交前至少运行受影响模块的测试与构建。

## 提交与 Pull Request

提交历史采用 Conventional Commits 前缀与简洁中文主题，例如 `feat: 完善课程报名入口`、`fix: 修复导航重复高亮`、`test: 补充组件测试`。每次提交保持单一目的。Pull Request 应说明变更范围、验证命令和关联 Issue；涉及 UI 时附桌面端与移动端截图，涉及 API 或数据库时列出端点、迁移及兼容性影响。不得提交 `.env`、密钥、Token、证书、构建产物或本地日志。

---

# AI Agent 共用规则

本文件是本项目面向 Claude Code 与 Codex 的共用规则源。

## 加载方式

- Claude Code 直接读取并遵循本文件。
- Codex 通过根目录 `AGENTS.md` 加载并遵循本文件，再应用其中的 Codex 专属适配。

## Skill 共用约定

- 项目 skill 的唯一来源是 `.claude/skills/`。
- `.codex/skills` 指向 `.claude/skills/`，Codex 与 Claude Code 共用同一组 skill。
- 代理应使用当前平台原生支持的方式加载 skill，不得假设 `Skill`、`Read`、`Bash` 等特定工具名始终存在。

## 规则边界与优先级

- 共用规则只在本文件维护；平台入口文件只补充平台能力差异，不复制共用规则。
- 规则冲突时，按“用户当前明确要求 > 平台系统与安全约束 > 平台专属适配 > 本文件共用规则 > skill 默认流程”的顺序处理。
- 下方标记为自动生成的 superpowers-zh 区块不得手工修改。
