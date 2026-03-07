#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/home/devluisq/project/sasa_forge_v2.0"
COMPOSE_FILE="infra/compose.prod.yml"
ENV_FILE=".env.prod"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-sasa_forge_v2}"

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

read_env_value() {
  local key="$1"
  local value
  value="$(grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
  printf "%s" "$value"
}

if [[ -z "${COMPOSE_PROJECT_NAME:-}" && -f "$ENV_FILE" ]]; then
  ENV_PROJECT_NAME="$(read_env_value COMPOSE_PROJECT_NAME)"
  if [[ -n "$ENV_PROJECT_NAME" ]]; then
    PROJECT_NAME="$ENV_PROJECT_NAME"
  fi
fi

echo "Using compose project: $PROJECT_NAME"
echo "Using compose file: $COMPOSE_FILE"

PORT_OWNER="$(docker ps --format '{{.Names}} {{.Ports}}' | grep '127.0.0.1:8081->80/tcp' || true)"
if [[ -n "$PORT_OWNER" ]] && ! echo "$PORT_OWNER" | grep -q "${PROJECT_NAME}_reverse-proxy"; then
  echo "ERROR: Port 8081 is already owned by another container:"
  echo "$PORT_OWNER"
  echo "Refusing to deploy with project '$PROJECT_NAME' to avoid conflicts."
  exit 1
fi

echo "[1/5] Pulling latest code..."
git fetch origin main
git checkout main
git pull --ff-only origin main

echo "[2/5] Pulling latest images (if defined)..."
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" pull || true

echo "[3/5] Rebuilding containers..."
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" build

echo "[4/5] Starting/updating required services..."
# Uses compose reconciliation; only changed services are recreated.
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" up -d --build

echo "[5/5] Container status..."
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" ps
docker ps

echo "Deploy script finished successfully."
