# Personal Brand Website

个人品牌网站全栈项目，包含设计原型、用户端、管理端和 Java 后端。项目围绕个人资料展示、视频内容、素材商品、矩阵账号、课程与用户管理等场景展开，前后端接口统一使用 `/api` 前缀。

## 项目结构

| 目录 | 说明 | 主要技术 |
| --- | --- | --- |
| `ui-figma/` | Figma 设计稿对应的交互原型 | React、Vite、Tailwind CSS |
| `pbw-web-frontend/` | 面向访客和用户的网站前端 | Vue 3、TypeScript、Pinia、Vue Router、Tailwind CSS |
| `pbw-admin-frontend/` | 内容与业务数据管理后台 | Vue 3、TypeScript、Pinia、Vue Router、Element Plus |
| `pbw-java-backend/` | 用户端与管理端共用的 REST API | Java 25、Spring Boot、MyBatis-Plus、MySQL、Redis、Flyway |

后端采用 COLA light 分层，管理端接口位于 `/api/admin`，用户端接口位于 `/api/user`。数据库基线见 `database.sql`，详细接口约定见 `API.md`。

## 本地开发

仓库根目录没有统一启动命令，请在独立终端中从仓库根目录进入对应子项目：

```bash
# 设计原型
cd ui-figma
npm install
npm run dev
```

```bash
# 用户端（默认端口 2001）
cd pbw-web-frontend
npm install
npm run dev
```

```bash
# 管理端（默认端口 2002）
cd pbw-admin-frontend
npm install
npm run dev
```

```bash
# 后端（默认端口 8080）
cd pbw-java-backend
mvn spring-boot:run
```

后端本地运行需要 JDK 25、Maven 3.6.3+、MySQL 8.0+ 和 Redis 6+。各子项目的环境配置、测试与部署方式请查看对应目录下的 `README.md`。

## 相关文档

- `API.md`：REST API 设计与字段约定
- `database.sql`：数据库基线结构
- `docs/superpowers/`：设计与实施记录
