#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
fi

./gradlew :backend:auth-server:bootJar :backend:api-gateway:bootJar :backend:order-engine:bootJar :backend:portfolio-service:bootJar :backend:broker-service:bootJar

cd infrastructure/docker
docker compose --env-file ../../.env up --build -d
docker compose ps
