# SASA Forge MVP Monorepo

- `api`: FastAPI + SQLAlchemy + Alembic + Postgres
- `web`: Next.js + Tailwind
- `app`: Expo React Native
- `infra`: Docker Compose

## Quick start (Docker)

```bash
docker compose -f infra/docker-compose.yml up --build
```

API: `http://localhost:8000`

## Local dev

### API

```bash
cd api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed_products.py
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### Create first OWNER

```bash
cd api
python scripts/create_admin_user.py --email owner@sasa.local --password "StrongPass123!" --role OWNER
```

### Web

```bash
cd web
npm install
npm run dev
```

### Mobile app

```bash
cd app
npm install
npx expo start
```

## Stripe setup

Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `api/.env`.

Forward test events:

```bash
stripe listen --forward-to localhost:8000/webhooks/stripe
```

## Replit API run

```bash
cd api
pip install -r requirements.txt
alembic upgrade head
uvicorn api.main:app --host 0.0.0.0 --port 8000
```
