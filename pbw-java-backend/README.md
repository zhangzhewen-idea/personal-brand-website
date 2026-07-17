# PBW Java 后端

本项目是个人品牌网站的单模块 COLA light 后端，管理端路径统一为 `/api/admin`，用户端路径统一为 `/api/user`。

## 本地依赖

- JDK 25
- Maven 3.6.3+
- MySQL 8.0+
- Redis 6+

## 启动

项目提供 `dev`、`staging`、`prod` 三个 Spring Profile，未指定时默认使用 `dev`。

开发环境使用 `application.yml` 中的本地开发默认值，可通过 `DB_URL`、`DB_USERNAME`、`DB_PASSWORD`、`REDIS_HOST`、`REDIS_PORT` 等环境变量覆盖：

```bash
mvn spring-boot:run
```

预发布和生产环境必须显式指定 Profile，并通过环境变量提供数据库、Redis、JWT、文件存储、跨域和密码重置页面配置：

```bash
SPRING_PROFILES_ACTIVE=staging mvn spring-boot:run
SPRING_PROFILES_ACTIVE=prod java -jar target/pbw-java-backend-0.0.1-SNAPSHOT.jar
```

`staging` 和 `prod` 必填环境变量如下：

- `DB_URL`、`DB_USERNAME`、`DB_PASSWORD`
- `REDIS_HOST`
- `SMTP_HOST`
- `JWT_SECRET`
- `STORAGE_ROOT`、`STORAGE_PUBLIC_BASE_URL`
- `CORS_ALLOWED_ORIGINS`
- `PASSWORD_RESET_FROM`、`PASSWORD_RESET_PAGE_URL`

`REDIS_PORT`、`REDIS_PASSWORD`、`SMTP_PORT`、`SMTP_USERNAME`、`SMTP_PASSWORD` 和 `LOG_FILE` 可选。`prod` 默认关闭 OpenAPI 和 Swagger UI，`staging` 保持开启以便联调。

Flyway 会自动建表并写入演示数据。默认管理员账号为 `admin`，密码为 `123456`。当前按需求暂用明文密码，响应、日志和 OpenAPI 均不会暴露密码。

OpenAPI JSON：`http://localhost:8080/v3/api-docs`

Swagger UI：`http://localhost:8080/swagger-ui.html`

## 测试

集成测试使用 Testcontainers 启动 MySQL 与 Redis，需要本机 Docker 可用。

```bash
mvn test
```

## Docker Compose 部署

部署脚本会先使用本机 Maven 打包，再以本地镜像
`alibabadragonwell/dragonwell:25.0.3.0.3.9-standard-ga-anolis` 为基础构建 `pbw-java-backend:local` 应用镜像，
不会拉取远程运行时镜像。应用 JAR 和 `uploads/` 的现有文件都会被打包进应用镜像。
服务的容器端口和宿主机端口均为 `8088`。

容器启动时会把镜像中的上传文件同步到 `pbw-uploads` Docker 命名卷。
该卷会保留运行期间新增的上传文件；删除命名卷会同时删除这些持久化文件。

直接创建名为 `pbw` 的 Compose 项目：

```bash
./deploy.sh
```

加入已有的 Compose 项目时传入项目名。脚本只新增或更新 `pbw-java-backend` 服务，
不会移除该项目的其他服务：

```bash
./deploy.sh existing-project-name
```

`.env.docker` 已被根目录 `.claudeignore` 和 Git 忽略，不得提交。

同一份 `compose.yaml` 还包含两个前端服务，前端发布脚本会使用 `prod` 环境构建镜像，并仅更新对应服务：

- `../pbw-web-frontend/deploy.sh`：用户端，端口 `3001`
- `../pbw-admin-frontend/deploy.sh`：管理端，端口 `3002`
