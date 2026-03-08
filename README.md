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

Recommended Git flow for local work:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-change
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

## Domain routing + TLS setup

This repo keeps the same shared stack architecture (`reverse-proxy`, `web`, `api`, `db`) with one stack per branch/environment on different localhost ports:

- `main` (production) -> `127.0.0.1:8081`
- `develop` (staging/dev) -> `127.0.0.1:8082`

### Required DNS

- `3dforge.sasasolutions.ca` -> `A` record to droplet public IP
- `www.3dforge.sasasolutions.ca` -> `CNAME` to `3dforge.sasasolutions.ca`
- `dev.3dforge.sasasolutions.ca` -> `A` record to droplet public IP

### Host nginx config

Use the host template:

- `infra/nginx/host.sasasolutions.conf.example`

It includes:

- main app server names:
  - `sasasolutions.ca`
  - `www.sasasolutions.ca`
  - `3dforge.sasasolutions.ca`
- dedicated `www.3dforge.sasasolutions.ca` redirect block on `80` and `443`:
  - `301` -> `https://3dforge.sasasolutions.ca$request_uri`
- development subdomain support:
  - `dev.sasasolutions.ca`
  - `dev.3dforge.sasasolutions.ca`
  - `dev.3dforge.sasasolutions.ca` should proxy to `http://127.0.0.1:8082`

### Certbot command (all required domains)

```bash
sudo certbot --nginx \
  -d sasasolutions.ca \
  -d www.sasasolutions.ca \
  -d dev.sasasolutions.ca \
  -d 3dforge.sasasolutions.ca \
  -d www.3dforge.sasasolutions.ca \
  -d dev.3dforge.sasasolutions.ca
```

### Validation

```bash
sudo nginx -t
sudo systemctl reload nginx

curl -I https://sasasolutions.ca/
curl -I https://www.sasasolutions.ca/
curl -I https://dev.sasasolutions.ca/
curl -I https://3dforge.sasasolutions.ca/
curl -I https://www.3dforge.sasasolutions.ca/
curl -I https://dev.3dforge.sasasolutions.ca/

curl -I https://www.3dforge.sasasolutions.ca/test-path
# Expect: 301 Location: https://3dforge.sasasolutions.ca/test-path

curl -fsS https://3dforge.sasasolutions.ca/api/health
curl -fsS https://dev.3dforge.sasasolutions.ca/api/health
```

## Branch promotion workflow (dev -> prod)

Branch strategy:

- `main` = production (`3dforge.sasasolutions.ca`)
- `develop` = staging/dev (`dev.3dforge.sasasolutions.ca`)
- `feature/*` = temporary branches

Promotion path:

1. Create and work in a feature branch from `develop`.
2. Merge feature branch into `develop`.
3. Deploy `develop` to `dev.3dforge.sasasolutions.ca` and validate.
4. Merge `develop` into `main`.
5. Deploy `main` to `3dforge.sasasolutions.ca`.

Recommended commands:

```bash
# Start a feature
git checkout develop
git pull origin develop
git checkout -b feature/new-capability

# Finish feature -> develop
git add -A
git commit -m "Add new capability"
git push -u origin feature/new-capability
# open PR: feature/new-capability -> develop

# Promote develop -> main after testing
git checkout main
git pull origin main
git merge --no-ff develop
git push origin main
```

## Branch-aware deploy script

`deploy.sh` now supports branch-targeted deployments using the same compose file:

```bash
# Deploy staging/dev stack (port 8082)
./deploy.sh develop

# Deploy production stack (port 8081)
./deploy.sh main
```

Notes:

- `develop` deploy defaults:
  - compose project: `sasa_forge_v2_dev`
  - env file: `.env.prod.develop` (fallback to `.env.prod` if missing)
  - dev marker in UI: `DEV / 3D FORGE`
- `main` deploy defaults:
  - compose project: `sasa_forge_v2`
  - env file: `.env.prod`
  - no dev marker

For `develop` environment values, create:

```bash
cp .env.prod.develop.example .env.prod.develop
```

## Create first OWNER user (inside container)

```bash
docker compose -f infra/docker-compose.dev.yml exec api python scripts/create_admin_user.py --email owner@sasaamazing.com --password StrongPass123!
```

## Sign in to Admin

1. Make sure dev stack is running with `run-dev.bat`.
2. Create an admin user:

```bash
docker compose -f infra/docker-compose.dev.yml exec api python scripts/create_admin_user.py --email owner@sasaamazing.com --password StrongPass123! --role OWNER
```

3. Open `http://localhost/admin/login`.
4. Sign in with the same email and password used in the command above.

## Optional mobile container (Expo)

The mobile service is optional and disabled by default. Start it with the `mobile` profile:

```bash
docker compose -f infra/docker-compose.dev.yml --profile mobile up --build
```
