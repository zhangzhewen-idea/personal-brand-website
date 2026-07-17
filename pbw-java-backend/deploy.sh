#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly COMPOSE_FILE="${SCRIPT_DIR}/compose.yaml"
readonly BUILD_COMPOSE_FILE="${SCRIPT_DIR}/compose.backend-build.yaml"
readonly RUNTIME_IMAGE="alibabadragonwell/dragonwell:25.0.3.0.3.9-standard-ga-anolis"
readonly PROJECT_NAME="${1:-${COMPOSE_PROJECT_NAME:-pbw}}"

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "缺少命令：$1" >&2
        exit 1
    fi
}

require_command docker
require_command mvn

if ! docker info >/dev/null 2>&1; then
    echo "Docker 服务不可用，请先启动 Docker。" >&2
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "当前 Docker 未安装 Compose 插件。" >&2
    exit 1
fi

if ! docker image inspect "${RUNTIME_IMAGE}" >/dev/null 2>&1; then
    echo "本地镜像不存在：${RUNTIME_IMAGE}" >&2
    exit 1
fi

echo "正在打包 pbw-java-backend..."
artifact_name="$(
    mvn -f "${SCRIPT_DIR}/pom.xml" help:evaluate \
        -Dexpression=project.build.finalName -q -DforceStdout
)"
mvn -f "${SCRIPT_DIR}/pom.xml" -Dmaven.test.skip=true package

readonly JAR_PATH="${SCRIPT_DIR}/target/${artifact_name}.jar"
if [[ ! -f "${JAR_PATH}" ]]; then
    echo "未找到打包产物：${JAR_PATH}" >&2
    exit 1
fi

export PBW_JAR_FILE="target/${artifact_name}.jar"

mkdir -p "${SCRIPT_DIR}/uploads" "${SCRIPT_DIR}/log"

echo "正在加入 Compose 项目：${PROJECT_NAME}"
docker compose \
    --project-name "${PROJECT_NAME}" \
    --file "${COMPOSE_FILE}" \
    --file "${BUILD_COMPOSE_FILE}" \
    build pbw-java-backend
docker compose \
    --project-name "${PROJECT_NAME}" \
    --file "${COMPOSE_FILE}" \
    --file "${BUILD_COMPOSE_FILE}" \
    up --detach --no-deps --no-build pbw-java-backend

echo "部署完成：http://localhost:8088"
echo "查看日志：docker compose --project-name ${PROJECT_NAME} --file ${COMPOSE_FILE} logs --follow pbw-java-backend"
