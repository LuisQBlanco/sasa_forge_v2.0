#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/home/devluisq/project/sasa_forge_v2.0"
COMPOSE_FILE="infra/compose.prod.yml"
TARGET_BRANCH="${1:-${DEPLOY_BRANCH:-main}}"

case "$TARGET_BRANCH" in
  main)
    DEFAULT_PROJECT_NAME="sasa_forge_v2"
    DEFAULT_ENV_FILE=".env.prod"
    DEFAULT_PROXY_BIND_PORT="8081"
    DEFAULT_ENV_LABEL=""
    DEFAULT_TARGET_HOST="3dforge.sasasolutions.ca"
    ;;
  develop)
    DEFAULT_PROJECT_NAME="sasa_forge_v2_dev"
    DEFAULT_ENV_FILE=".env.prod.develop"
    DEFAULT_PROXY_BIND_PORT="8082"
    DEFAULT_ENV_LABEL="DEV / 3D FORGE"
    DEFAULT_TARGET_HOST="dev.3dforge.sasasolutions.ca"
    ;;
  *)
    echo "ERROR: Unsupported branch '$TARGET_BRANCH'. Use 'develop' or 'main'."
    exit 1
    ;;
esac

PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$DEFAULT_PROJECT_NAME}"
ENV_FILE="${DEPLOY_ENV_FILE:-$DEFAULT_ENV_FILE}"
PROXY_BIND_PORT="${PROXY_BIND_PORT:-$DEFAULT_PROXY_BIND_PORT}"
NEXT_PUBLIC_ENV_LABEL="${NEXT_PUBLIC_ENV_LABEL:-$DEFAULT_ENV_LABEL}"
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-/api}"
TARGET_HOST="${TARGET_HOST:-$DEFAULT_TARGET_HOST}"

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

if [[ ! -f "$ENV_FILE" ]]; then
  if [[ "$TARGET_BRANCH" == "develop" && -f ".env.prod" ]]; then
    echo "WARN: Missing $ENV_FILE, falling back to .env.prod for develop deploy."
    ENV_FILE=".env.prod"
  else
    echo "ERROR: Missing env file $ENV_FILE."
    exit 1
  fi
fi

read_env_value() {
  local key="$1"
  local file="$2"
  local value
  value="$(grep -E "^${key}=" "$file" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
  printf "%s" "$value"
}

if [[ -z "${COMPOSE_PROJECT_NAME:-}" ]]; then
  ENV_PROJECT_NAME="$(read_env_value COMPOSE_PROJECT_NAME "$ENV_FILE")"
  if [[ -n "$ENV_PROJECT_NAME" ]]; then
    PROJECT_NAME="$ENV_PROJECT_NAME"
  fi
fi

APP_ENV_FILE="$(basename "$ENV_FILE")"

echo "Target branch: $TARGET_BRANCH"
echo "Target host:   $TARGET_HOST"
echo "Compose file:  $COMPOSE_FILE"
echo "Env file:      $ENV_FILE"
echo "Project name:  $PROJECT_NAME"
echo "Proxy port:    127.0.0.1:${PROXY_BIND_PORT}"

PORT_OWNER="$(docker ps --format '{{.Names}} {{.Ports}}' | grep "127.0.0.1:${PROXY_BIND_PORT}->80/tcp" || true)"
if [[ -n "$PORT_OWNER" ]] && ! echo "$PORT_OWNER" | grep -q "${PROJECT_NAME}_reverse-proxy"; then
  echo "ERROR: Port ${PROXY_BIND_PORT} is already owned by another container:"
  echo "$PORT_OWNER"
  echo "Refusing to deploy with project '$PROJECT_NAME' to avoid conflicts."
  exit 1
fi

echo "[1/7] Pulling latest code for branch ${TARGET_BRANCH}..."
git fetch origin "$TARGET_BRANCH"
git checkout "$TARGET_BRANCH"
git pull --ff-only origin "$TARGET_BRANCH"

echo "[2/7] Pulling latest images (if defined)..."
APP_ENV_FILE="$APP_ENV_FILE" \
PROXY_BIND_PORT="$PROXY_BIND_PORT" \
NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
NEXT_PUBLIC_ENV_LABEL="$NEXT_PUBLIC_ENV_LABEL" \
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" pull || true

echo "[3/7] Building and starting/updating required services..."
APP_ENV_FILE="$APP_ENV_FILE" \
PROXY_BIND_PORT="$PROXY_BIND_PORT" \
NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
NEXT_PUBLIC_ENV_LABEL="$NEXT_PUBLIC_ENV_LABEL" \
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" up -d --build

echo "[4/7] Reloading reverse-proxy nginx config (if running)..."
REVERSE_PROXY_CONTAINER="${PROJECT_NAME}_reverse-proxy_1"
if docker ps --format '{{.Names}}' | grep -qx "$REVERSE_PROXY_CONTAINER"; then
  docker exec "$REVERSE_PROXY_CONTAINER" nginx -s reload || true
else
  echo "WARN: ${REVERSE_PROXY_CONTAINER} not running; skipping nginx reload."
fi

echo "[5/7] Container status..."
APP_ENV_FILE="$APP_ENV_FILE" \
PROXY_BIND_PORT="$PROXY_BIND_PORT" \
NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
NEXT_PUBLIC_ENV_LABEL="$NEXT_PUBLIC_ENV_LABEL" \
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" ps

echo "[6/7] Local health checks..."
curl -fsS "http://127.0.0.1:${PROXY_BIND_PORT}/api/health" | grep -q '"ok":true'
WEB_STATUS="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PROXY_BIND_PORT}/")"
if [[ "$WEB_STATUS" != "200" ]]; then
  echo "ERROR: Web endpoint on port ${PROXY_BIND_PORT} returned HTTP ${WEB_STATUS}"
  exit 1
fi

echo "[7/7] Deploy script finished successfully."
echo "Validate domain:"
echo "  https://${TARGET_HOST}/"
