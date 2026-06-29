---
title: Render Backend Deploy Readiness Plan
date: 2026-06-29
area: deploy
tags:
  - django
  - drf
  - render
  - postgres
  - vercel
problem: StayFinder frontend is deployed to Vercel, but the Django backend still runs only on local SQLite.
what_worked: Keep the frontend on Vercel, keep local full-stack verification running, and plan the backend deploy separately around Render plus Postgres.
what_failed: Starting a backend Vercel serverless setup before choosing the backend platform mixed deployment strategies too early.
root_cause: Django deployment has database, migration, seed, CORS, environment, and frontend API URL concerns that are larger than a static frontend deploy.
prevention_rule: Before editing backend deployment code, first freeze local verification, choose the backend platform, choose the database strategy, and write the deploy checklist.
files_or_patterns:
  - backend/config/settings.py
  - backend/requirements.txt
  - backend/manage.py
  - frontend/vercel.json
verification: Local backend/frontend servers are running, frontend Vercel production is deployed, and latest local test set passed before this plan was written.
---

# Render Backend Deploy Readiness Plan

## Current State

StayFinder currently has a working local full-stack MVP.

Backend:

- Django REST Framework project under `backend/`.
- Apps: `accounts`, `hotels`, `bookings`, `reviews`, `common`.
- Public hotel APIs are implemented:
  - `GET /api/hotels/`
  - `GET /api/hotels/{id}/`
  - `GET /api/hotels/{id}/room-types/`
- Booking APIs are implemented for authenticated flows:
  - `POST /api/bookings/`
  - `GET /api/bookings/`
  - `GET /api/bookings/{id}/`
  - `POST /api/bookings/{id}/cancel/`
- `seed_demo_data` management command creates reusable demo hotel data.
- Local DB is SQLite at `backend/db.sqlite3`.

Frontend:

- Vite React app under `frontend/`.
- Coastal StayFinder UI implemented.
- React routes include list, detail, booking, trips, and state pages.
- Hotel list/detail now call the Django API through `src/api/`.
- Vercel frontend production deploy is live.
- `frontend/vercel.json` rewrites SPA routes to `index.html`, so direct routes like `/hotels/1` work.

Local verification endpoints:

- Frontend: `http://127.0.0.1:5173/`
- Backend: `http://127.0.0.1:8000/`
- Hotel API: `http://127.0.0.1:8000/api/hotels/`

## Platform Decision

Recommended backend platform: Render.

Reason:

- Render fits a standard Django web service model better than Vercel serverless for this learning project.
- It supports a long-running Django process, environment variables, build/start commands, and managed Postgres.
- This keeps the backend mental model close to real Django deployment: app server plus database plus migrations.

Keep Vercel for frontend.

Reason:

- The current React/Vite frontend already deploys cleanly to Vercel.
- Vercel remains a good fit for static frontend hosting.

## Database Decision

Recommended production database: Postgres.

Reason:

- SQLite is fine for local learning but not a real shared deployment database.
- Booking logic needs real transaction behavior and predictable concurrency semantics.
- Existing booking service already uses `transaction.atomic` and `select_for_update`, which are better matched to Postgres than SQLite.

Local DB strategy:

- Short term: keep local SQLite for fast learning.
- Deploy path: use `DATABASE_URL` in production and keep SQLite fallback for local development.
- Later option: add local Postgres through Docker if deployment parity becomes important.

## Required Code Changes

Backend settings:

- Read `SECRET_KEY` from environment.
- Read `DEBUG` from environment.
- Read `ALLOWED_HOSTS` from environment.
- Read `CORS_ALLOWED_ORIGINS` from environment or include the final Vercel frontend origin.
- Add `CSRF_TRUSTED_ORIGINS` for deployed admin/API browser use if needed.
- Configure database via `DATABASE_URL` when present, otherwise keep SQLite fallback.

Backend dependencies:

- Add Postgres/database URL packages:
  - `dj-database-url`
  - `psycopg` or `psycopg2-binary`
- Add production server:
  - `gunicorn`
- Consider static handling only if Django static/admin assets matter:
  - `whitenoise`

Render build/start:

- Build command should install dependencies. On Render Free, migrations and seed may be included in the build command for the first learning deploy because one-off jobs are not available.
- Start command should run Gunicorn against `config.wsgi`.
- Migrations and seed should not be hidden inside every boot.

Frontend:

- Set Vercel environment variable:
  - `VITE_API_BASE_URL=https://<render-backend-domain>`
- Redeploy frontend after backend URL exists.

## Suggested Render Configuration

Render Web Service:

- Root directory: `backend`
- Runtime: Python
- Build command:
  - `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_demo_data`
- Start command:
  - `gunicorn config.wsgi:application`

Render Postgres:

- Create a managed Postgres database.
- Attach the database URL to the web service as `DATABASE_URL`.

Environment variables:

- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS=<render-service-hostname>`
- `CORS_ALLOWED_ORIGINS=https://frontend-omega-lilac-59.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://<render-service-hostname>`
- `DATABASE_URL=<Render Postgres internal/external URL>`

## Verification Checklist Before Backend Deploy

Run locally:

```bash
backend/.venv/bin/python backend/manage.py test hotels bookings
cd frontend
npm run build
npm run lint
npm run test
```

Check local smoke:

```bash
curl http://127.0.0.1:8000/api/hotels/
curl http://127.0.0.1:8000/api/hotels/1/room-types/
curl -I http://127.0.0.1:5173/hotels/1
```

## Verification Checklist After Backend Deploy

Backend smoke:

```bash
curl https://<render-backend-domain>/api/hotels/
curl https://<render-backend-domain>/api/hotels/1/
curl https://<render-backend-domain>/api/hotels/1/room-types/
```

Database smoke:

- Confirm migrations applied.
- Confirm seed data exists.
- Confirm hotel count is at least 4.
- Confirm each seeded hotel has room types.

CORS smoke:

```bash
curl -I \
  -H "Origin: https://frontend-omega-lilac-59.vercel.app" \
  https://<render-backend-domain>/api/hotels/
```

Frontend production smoke:

- Set Vercel `VITE_API_BASE_URL` to Render backend URL.
- Redeploy Vercel frontend.
- Open:
  - `https://frontend-omega-lilac-59.vercel.app/`
  - `https://frontend-omega-lilac-59.vercel.app/hotels/1`
- Confirm hotel data comes from deployed backend, not local backend.

## Risks

- SQLite to Postgres is a real deployment change, not a cosmetic setting change.
- Booking concurrency should be verified against Postgres before treating booking writes as production-safe.
- Free-tier services may sleep, causing first request latency.
- Vercel frontend cannot call `127.0.0.1`; it needs a public backend URL.
- Seed data should not be automatically recreated on every deploy.

## Next Action

Do not deploy Django yet.

Next implementation should be a focused "Render deploy readiness" branch:

1. Add production-safe settings with local fallback.
2. Add Render/Postgres dependencies.
3. Add or document Render build/start commands.
4. Run local tests.
5. Only then create Render service and database.
