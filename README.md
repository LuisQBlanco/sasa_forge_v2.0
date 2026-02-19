# SASA Forge MVP Monorepo

- `api`: FastAPI + SQLAlchemy + Alembic + Postgres
- `web`: Next.js + Tailwind
- `app`: Expo React Native
- `infra`: Docker Compose + nginx reverse proxy

## Environment setup

Create your local env file from the template:

```bash
copy .env.example .env
```

## Local dev (Windows, one click)

Double-click:

```text
run-dev.bat
```

This runs:

```bash
docker compose -f infra/docker-compose.dev.yml up --build
```

## Local prod-like stack (Windows)

Double-click:

```text
run-prod.bat
```

This runs:

```bash
docker compose -f infra/docker-compose.prod.yml up -d --build
```

## Stop stacks

Double-click:

```text
stop.bat
```

## Useful scripts

- `logs.bat` -> `docker compose -f infra/docker-compose.dev.yml logs -f --tail=200`
- `rebuild.bat` -> rebuild dev and prod images with `--no-cache`

## URLs

- `http://localhost/`
- `http://localhost/api/health`
- `http://localhost/api/docs`

Only nginx publishes host ports. API and web are reached through nginx routing:

- `/` -> web
- `/api/*` -> api

## Create first OWNER user (inside container)

```bash
docker compose -f infra/docker-compose.dev.yml exec api python scripts/create_admin_user.py --email owner@sasa.local --password StrongPass123!
```

## Optional mobile container (Expo)

The mobile service is optional and disabled by default. Start it with the `mobile` profile:

```bash
docker compose -f infra/docker-compose.dev.yml --profile mobile up --build
```
