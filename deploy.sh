#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/home/devluisq/project/sasa_forge_v2.0"
COMPOSE_FILE="docker-compose.prod.yml"

cd "$PROJECT_DIR"

if docker compose version >/dev/null 2>&1; then
  COMPOSE_BIN=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_BIN=(docker-compose)
else
  echo "ERROR: Neither 'docker compose' nor 'docker-compose' is installed."
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "ERROR: Missing $COMPOSE_FILE in $PROJECT_DIR"
  exit 1
fi

echo "[1/5] Pulling latest code..."
git fetch origin main
git checkout main
git pull --ff-only origin main

echo "[2/5] Pulling latest images (if defined)..."
"${COMPOSE_BIN[@]}" -f "$COMPOSE_FILE" pull || true

echo "[3/5] Rebuilding containers..."
"${COMPOSE_BIN[@]}" -f "$COMPOSE_FILE" build

echo "[4/5] Starting/updating required services..."
# Uses compose reconciliation; only changed services are recreated.
"${COMPOSE_BIN[@]}" -f "$COMPOSE_FILE" up -d --build

echo "[5/5] Container status..."
"${COMPOSE_BIN[@]}" -f "$COMPOSE_FILE" ps
docker ps

echo "Deploy script finished successfully."
