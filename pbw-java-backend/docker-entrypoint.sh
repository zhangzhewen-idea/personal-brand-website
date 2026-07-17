#!/usr/bin/env sh

set -eu

mkdir -p /app/uploads
cp -a /app/uploads-bundled/. /app/uploads/

exec java -jar /app/app.jar
