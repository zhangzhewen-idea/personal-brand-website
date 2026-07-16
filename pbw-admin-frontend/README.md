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

除测试登录和页面切换外，新增、编辑、删除等业务按钮仅保留原型外观，等待后端 API 接入后实现。
