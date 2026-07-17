#!/usr/bin/env bash

set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

run_frontend_tests() {
  local project="$1"
  echo "==> Testing ${project}"
  (cd "${REPOSITORY_ROOT}/${project}" && npm test)
}

run_frontend_tests "ui-figma"
run_frontend_tests "pbw-web-frontend"
run_frontend_tests "pbw-admin-frontend"

echo "==> Testing pbw-java-backend"
(cd "${REPOSITORY_ROOT}/pbw-java-backend" && mvn test)
