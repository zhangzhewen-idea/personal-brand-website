# 用户端前端工程

本工程根据 `../ui-figma` 原型与 `../database.sql` 数据结构实现，使用 Vue 3、TypeScript、Vue Router、Pinia、Tailwind CSS、axios 与 Vite。

## 目录分层

- `src/api`：后端接口层
- `src/components`：通用组件与布局组件
- `src/layouts`：页面公共布局
- `src/mock`：页面模拟数据，字段统一使用驼峰命名
- `src/router`：路由配置
- `src/stores`：Pinia 状态管理
- `src/types`：与数据库表对应的数据类型
- `src/views`：路由页面

## 本地运行

```bash
npm install
npm run dev
```

项目提供 `dev`、`prod` 两套环境：

- `npm run dev`：使用 `dev` 环境，连接 `http://localhost:8080/api`
- `npm run dev:prod`：本地使用 `prod` 环境启动，连接 `https://pbw-backend1.harmonies.cc/api`
- `npm run build:dev`：构建开发环境产物
- `npm run build:prod`：构建生产环境产物；`npm run build` 默认执行此命令

## Docker Compose 发布

发布脚本使用 `prod` 环境构建 Docker 镜像，并将用户端加入现有 Compose 项目，对外端口保持为 `3001`：

```bash
./deploy.sh
```

加入指定 Compose 项目时传入项目名：

```bash
./deploy.sh existing-project-name
```

当前仅实现页面展示，登录、注册、购买、下载、咨询等业务功能尚未接入。
