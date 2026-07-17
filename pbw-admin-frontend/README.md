# PBW 后台管理前端

基于 `Vue 3`、`TypeScript`、`Vue Router`、`Pinia`、`Element Plus`、`axios` 和 `Vite` 搭建的后台管理前端原型。

## 页面范围

- 管理员登录（内置临时测试模式）
- 工作台
- 基本信息管理
- 视频管理
- 素材库管理
- 矩阵账号管理
- 课程管理
- 用户管理

页面字段依据项目上级目录中的 `database.sql` 设计，前端字段统一使用驼峰命名。

## 本地运行

```bash
npm install
npm run dev
```

项目提供 `dev`、`prod` 两套环境：

- `npm run dev`：使用 `dev` 环境，连接 `http://localhost:8080/api`
- `npm run dev:prod`：本地使用 `prod` 环境启动，连接 `http://localhost:8088/api`
- `npm run build:dev`：构建开发环境产物
- `npm run build:prod`：构建生产环境产物；`npm run build` 默认执行此命令

## Docker Compose 发布

发布脚本使用 `prod` 环境构建 Docker 镜像，并将管理端加入现有 Compose 项目，对外端口保持为 `3002`：

```bash
./deploy.sh
```

加入指定 Compose 项目时传入项目名：

```bash
./deploy.sh existing-project-name
```

临时测试模式默认开启，测试账号为：

- 账号：`admin`
- 密码：`123456`

测试模式关闭后，登录页会请求 `POST /api/admin/login`。

## 目录分层

- `src/api`：独立接口层与 axios 客户端
- `src/components`：通用页面组件
- `src/config`：管理页面字段配置
- `src/data`：数据库示例数据对应的原型数据
- `src/layouts`：后台整体布局
- `src/router`：路由与登录守卫
- `src/stores`：Pinia 状态
- `src/types`：数据库实体类型
- `src/views`：具体业务页面

新增与编辑按钮已接入本地原型弹窗，提交后会更新当前页面内的数据；刷新页面后恢复示例数据。文件上传使用本地预览，等待后端文件服务接入后再持久化资源地址。

素材库商品规格采用最简结构，规格项只保存名称和值，统一共享商品的基础价格和基础库存：

```json
[
  { "name": "颜色", "value": "红色" },
  { "name": "尺寸", "value": "L 码" }
]
```
