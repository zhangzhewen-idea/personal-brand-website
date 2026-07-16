# PBW Java 后端

本项目是个人品牌网站的单模块 COLA light 后端，管理端路径统一为 `/api/admin`，用户端路径统一为 `/api/user`。

## 本地依赖

- JDK 25
- Maven 3.6.3+
- MySQL 8.0+
- Redis 6+

## 启动

默认连接本机 `pbw` 数据库和 Redis，可通过 `DB_URL`、`DB_USERNAME`、`DB_PASSWORD`、`REDIS_HOST`、`REDIS_PORT` 覆盖。

```bash
mvn spring-boot:run
```

Flyway 会自动建表并写入演示数据。默认管理员账号为 `admin`，密码为 `123456`。当前按需求暂用明文密码，响应、日志和 OpenAPI 均不会暴露密码。

OpenAPI JSON：`http://localhost:8080/v3/api-docs`

Swagger UI：`http://localhost:8080/swagger-ui.html`

## 测试

集成测试使用 Testcontainers 启动 MySQL 与 Redis，需要本机 Docker 可用。

```bash
mvn test
```
