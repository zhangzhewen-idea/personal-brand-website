#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly COMPOSE_FILE="${SCRIPT_DIR}/../pbw-java-backend/compose.yaml"
readonly PROJECT_NAME="${1:-${COMPOSE_PROJECT_NAME:-pbw}}"
readonly SERVICE_NAME="pbw-web-frontend"

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "缺少命令：$1" >&2
        exit 1
    fi
}

require_command docker

if ! docker info >/dev/null 2>&1; then
    echo "Docker 服务不可用，请先启动 Docker。" >&2
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "当前 Docker 未安装 Compose 插件。" >&2
    exit 1
fi

echo "正在使用 prod 环境构建 ${SERVICE_NAME}..."
docker compose \
    --project-name "${PROJECT_NAME}" \
    --file "${COMPOSE_FILE}" \
    build "${SERVICE_NAME}"

echo "正在加入 Compose 项目：${PROJECT_NAME}"
docker compose \
    --project-name "${PROJECT_NAME}" \
    --file "${COMPOSE_FILE}" \
    up --detach --no-deps "${SERVICE_NAME}"

echo "部署完成：http://localhost:3001"
echo "查看日志：docker compose --project-name ${PROJECT_NAME} --file ${COMPOSE_FILE} logs --follow ${SERVICE_NAME}"
