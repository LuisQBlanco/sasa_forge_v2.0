#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

COMPOSE_FILE="infra/compose.prod.yml"
ENV_FILE=".env.prod"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-sasa_forge_v2}"

if docker compose version >/dev/null 2>&1; then
  COMPOSE_BIN=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_BIN=(docker-compose)
else
  echo "ERROR: Neither 'docker compose' nor 'docker-compose' is installed."
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found."
  echo "Create it with: cp .env.prod.example .env.prod"
  exit 1
fi

read_env_value() {
  local key="$1"
  local value
  value="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 | cut -d= -f2- || true)"
  printf "%s" "$value"
}

if [[ -z "${COMPOSE_PROJECT_NAME:-}" ]]; then
  ENV_PROJECT_NAME="$(read_env_value COMPOSE_PROJECT_NAME)"
  if [[ -n "$ENV_PROJECT_NAME" ]]; then
    PROJECT_NAME="$ENV_PROJECT_NAME"
  fi
fi

echo "Using compose command: ${COMPOSE_BIN[*]}"
echo "Using compose project: $PROJECT_NAME"
echo "Using compose file: $COMPOSE_FILE"

echo "[0/6] Pre-check: host port 8081"
if ss -ltn "( sport = :8081 )" | tail -n +2 | grep -q .; then
  echo "WARNING: Port 8081 already has a listener. Verify this is expected."
  ss -ltnp "( sport = :8081 )" || true
fi

echo "[1/6] Updating code..."
git fetch origin main
git pull --ff-only origin main

echo "[2/6] Building images..."
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" build --pull

echo "[3/6] Starting containers..."
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" up -d --remove-orphans

echo "[4/6] Running migrations (opt-in)..."
if [[ -n "${RUN_DB_MIGRATIONS:-}" ]]; then
  RUN_MIGRATIONS="${RUN_DB_MIGRATIONS}"
else
  RUN_MIGRATIONS="$(read_env_value RUN_DB_MIGRATIONS)"
  RUN_MIGRATIONS="${RUN_MIGRATIONS:-false}"
fi
case "${RUN_MIGRATIONS,,}" in
  1|true|yes)
    if "${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" exec -T api test -f alembic.ini; then
      "${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" exec -T api alembic upgrade head
    else
      echo "Skipping migrations: Alembic is not configured in the api container."
    fi
    ;;
  *)
    echo "Skipping migrations. Set RUN_DB_MIGRATIONS=true in .env.prod to enable."
    ;;
esac

echo "[5/6] Service status..."
"${COMPOSE_BIN[@]}" -p "$PROJECT_NAME" -f "$COMPOSE_FILE" ps

echo "[6/6] Verification..."
echo "$ curl -fsS http://127.0.0.1:8081/healthz"
curl -fsS http://127.0.0.1:8081/healthz
echo
echo "$ curl -I http://127.0.0.1:8081/3dforce"
curl -I http://127.0.0.1:8081/3dforce | head -n 1
echo "$ curl -fsS http://127.0.0.1:8081/3dforce/api/health"
curl -fsS http://127.0.0.1:8081/3dforce/api/health
echo

echo "Deployment complete."
