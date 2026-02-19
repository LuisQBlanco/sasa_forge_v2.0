# SASA Forge — Codex Agent Rules

This repository is an existing, working monorepo.
You MUST continue from the current structure.
You MUST NOT rewrite or reset the project.

Repo: https://github.com/LuisQBlanco/sasa_forge_v2.0

---

# 🏗 CURRENT STRUCTURE (LOCKED)

Root structure:

/api      → FastAPI backend (Postgres, Alembic, JWT, Stripe)
/web      → Next.js App Router + Tailwind
/app      → Expo React Native mobile app
/infra    → docker-compose.yml (currently dev-oriented)

The backend and frontend are already functional.
Your job is to improve and extend — not rebuild.

---

# 🎯 BUSINESS CONTEXT (DO NOT CHANGE)

Brand: SASA Forge  
Tagline: 3D Printing & Laser Fabrication  
Parent: SASA Amazing Solutions  
Area: Toronto / GTA  
Shipping: Canada-wide (no pickup)  
Quotes: 40% deposit, 48h SLA  
Uploads: STL/3MF/STEP/PNG/JPG (max 100MB)  
Payments: Stripe + Interac e-Transfer  
Roles: OWNER, STAFF  

---

# 🚫 ABSOLUTE RULES

1. Never reset the repo.
2. Never replace working code without reason.
3. Never expose Postgres to the public network.
4. Never expose API directly in production.
5. Never commit secrets.
6. Never hardcode production domains.
7. Do not introduce heavy frameworks.

---

# 🐳 DOCKER ARCHITECTURE RULES

We are deploying to a SINGLE DigitalOcean Droplet.

Target architecture:

- nginx (only public port 80/443)
- api (internal only)
- web (internal only)
- db (internal only)
- mobile (internal, optional)

Routing standard:

http://localhost/        → web
http://localhost/api/*   → api
http://localhost/api/docs → swagger

Production must:
- Use nginx as reverse proxy
- Remove direct port exposure for db/api/web
- Use Postgres 16
- Run migrations automatically on API start
- Use production Next.js build (not `npm run dev`)

Dev mode may:
- Use hot reload
- Use separate docker-compose.dev.yml

---

# 🔐 SECURITY BASELINE

Always enforce:

- Proper 401/403 handling for JWT
- Catch decode errors (never return 500 for invalid token)
- Rate limit login endpoints
- Limit upload size (110MB at nginx)
- Sanitize filenames
- Add security headers in nginx
- Non-root containers where possible
- Health checks for db/api/web/nginx

---

# 📦 BACKEND RULES (api/)

- Use SQLAlchemy 2.x patterns already in repo
- Use Alembic for migrations
- Keep public_code indexed for orders/quotes
- Do not break existing Stripe integration
- Keep file storage local for dev; S3-ready abstraction allowed
- Always update tests if backend logic changes
- Keep `/api/health` working

---

# 🎨 FRONTEND RULES (web/)

- Next.js App Router only
- Tailwind only (no heavy UI libraries)
- Keep current routes intact
- Do not break CartProvider
- Use environment variable:
  NEXT_PUBLIC_API_URL=/api (behind nginx)

If implementing basePath (/forge):
- Update next.config.js
- Ensure assets and links work correctly

---

# 📱 MOBILE RULES (app/)

- Expo only
- API base URL via EXPO_PUBLIC_API_URL
- Do not require host Expo installation
- Containerization preferred for droplet testing

---

# 🧪 TESTING REQUIREMENTS

When modifying backend:

- Ensure pytest passes
- Keep auth + health smoke tests working

When modifying Docker:

- `docker compose up --build` must work
- No service other than nginx publishes ports

---

# 📝 WORKFLOW RULES

Before making changes:

1. Inspect the current file tree.
2. List files to change.
3. Make minimal edits.
4. Output only changed files.
5. Ensure build/run commands remain valid.
6. Provide verification steps.

---

# 🧠 DECISION PRIORITY

If uncertain:

1. Preserve existing working behavior.
2. Choose minimal change.
3. Favor security over convenience.
4. Keep deployment simple for one droplet.

---

# 🚀 DEPLOYMENT GOAL

Dev:
dev.sasasolutions.ca

Prod:
sasasolutions.ca

Single droplet.
Domain-based routing via nginx.

---

You are not starting over.
You are improving a working system.
Maintain stability first.