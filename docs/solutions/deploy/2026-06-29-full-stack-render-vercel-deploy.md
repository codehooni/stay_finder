---
title: Full Stack Render and Vercel Deploy
date: 2026-06-29
area: deploy
tags:
  - render
  - vercel
  - django
  - postgres
  - react
problem: StayFinder needed a deployed full-stack path where the Vercel React frontend reads real data from a deployed Django API and Postgres database.
what_worked: Deploy the frontend to Vercel, deploy Django as a Render Web Service, attach Render Postgres through DATABASE_URL, then set Vercel VITE_API_BASE_URL to the Render API URL.
what_failed: The first Render API deploy failed because the GitHub commit did not include gunicorn in backend/requirements.txt.
root_cause: Render builds from GitHub main, so local deployment fixes do not affect Render until committed and pushed.
prevention_rule: Before pressing Render deploy, confirm the required runtime packages are committed and pushed, then verify the target commit hash in Render events.
files_or_patterns:
  - backend/requirements.txt
  - backend/config/settings.py
  - backend/config/settings_helpers.py
  - frontend/vercel.json
  - frontend/src/api/client.ts
verification: Render API, CORS, Vercel inspect, Vercel routes, and deployed frontend bundle were verified after deployment.
---

# Full Stack Render and Vercel Deploy

## Final Architecture

```txt
Vercel React frontend
  -> Render Django REST API
    -> Render Postgres database
```

## Deployed URLs

Frontend:

- Production alias: `https://frontend-omega-lilac-59.vercel.app`
- Detail route smoke: `https://frontend-omega-lilac-59.vercel.app/hotels/1`

Backend:

- Render API base URL: `https://stay-finder-api-t28b.onrender.com`
- Hotel list: `https://stay-finder-api-t28b.onrender.com/api/hotels/`
- Hotel detail: `https://stay-finder-api-t28b.onrender.com/api/hotels/3/`
- Room types: `https://stay-finder-api-t28b.onrender.com/api/hotels/1/room-types/`

Database:

- Render Postgres service: `stay-finder-db`
- Production API uses Render Postgres through `DATABASE_URL`.

## Render Services

Postgres:

- Name: `stay-finder-db`
- Region: Singapore
- PostgreSQL version: 18
- Plan: Free
- Storage: 1 GB
- Important: Free database expires on 2026-07-29 unless upgraded.

Web Service:

- Name: `stay-finder-api`
- Runtime: Python 3
- Branch: `main`
- Region: Singapore
- Root directory: `backend`
- Instance type: Free
- Important: Free web services spin down after inactivity, so the first request can be slow.

Build command:

```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py seed_demo_data
```

Start command:

```bash
gunicorn config.wsgi:application
```

## Render Environment Variables

Required:

```txt
DEBUG=False
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=https://frontend-omega-lilac-59.vercel.app
SECURE_SSL_REDIRECT=True
DATABASE_URL=<Render Internal Database URL>
SECRET_KEY=<generated long secret>
```

Notes:

- Use the Render Postgres **Internal Database URL** for `DATABASE_URL`.
- Do not paste `DATABASE_URL` or `SECRET_KEY` into chat or docs.
- `ALLOWED_HOSTS=*` was used to unblock the first deploy. Later it should be narrowed to the actual Render hostname.

Optional later hardening:

```txt
CSRF_TRUSTED_ORIGINS=https://stay-finder-api-t28b.onrender.com
SECURE_HSTS_SECONDS=31536000
```

Do not enable HSTS casually while domains are still changing.

## Vercel Environment Variables

Production:

```txt
VITE_API_BASE_URL=https://stay-finder-api-t28b.onrender.com
```

After setting this variable, redeploy the Vercel frontend so Vite bakes the API URL into the production bundle.

## Commits

Successful backend deploy commit:

```txt
84e8bd4 feat: prepare backend for Render Postgres deploy
```

Previous failed deploy commit:

```txt
61e74ef feat: add coastal booking flow
```

Failure:

```txt
bash: line 1: gunicorn: command not found
Exited with status 127
```

Fix:

- Add `gunicorn` to `backend/requirements.txt`.
- Commit and push the fix to GitHub.
- Re-run Render deploy against the new commit.

## Verification Performed

Backend API smoke:

```bash
curl -i https://stay-finder-api-t28b.onrender.com/api/hotels/
curl -i https://stay-finder-api-t28b.onrender.com/api/hotels/1/room-types/
curl https://stay-finder-api-t28b.onrender.com/api/hotels/3/
```

Expected result:

- `200 OK`
- JSON hotel data from Render Postgres
- `x-render-origin-server: gunicorn`

CORS smoke:

```bash
curl -I \
  -H "Origin: https://frontend-omega-lilac-59.vercel.app" \
  https://stay-finder-api-t28b.onrender.com/api/hotels/
```

Expected result:

```txt
access-control-allow-origin: https://frontend-omega-lilac-59.vercel.app
```

Vercel deploy inspect:

```bash
npx vercel inspect https://frontend-heeaa762i-codehoonis-projects.vercel.app
```

Expected result:

- Status: `Ready`
- Target: production
- Alias includes `https://frontend-omega-lilac-59.vercel.app`

Frontend route smoke:

```bash
curl -I https://frontend-omega-lilac-59.vercel.app/
curl -I https://frontend-omega-lilac-59.vercel.app/hotels/1
```

Expected result:

- Both return `200 OK`.
- `/hotels/1` works because `frontend/vercel.json` rewrites SPA routes to `index.html`.

Bundle API URL verification:

```bash
curl -sS https://frontend-omega-lilac-59.vercel.app/assets/<asset>.js \
  | rg -o "https://stay-finder-api-t28b.onrender.com|http://localhost:8000"
```

Expected result:

```txt
https://stay-finder-api-t28b.onrender.com
```

## Local Verification Commands

Before future deploys:

```bash
backend/.venv/bin/python backend/manage.py test config.tests.test_settings_helpers hotels bookings
cd frontend
npm run build
npm run lint
npm run test
```

Optional production-like check:

```bash
env \
  DEBUG=False \
  SECRET_KEY=replace-with-a-long-local-test-secret \
  ALLOWED_HOSTS=example.com \
  CORS_ALLOWED_ORIGINS=https://frontend-omega-lilac-59.vercel.app \
  CSRF_TRUSTED_ORIGINS=https://example.com \
  backend/.venv/bin/python backend/manage.py check --deploy
```

## Operational Notes

- Render Free Web Service can sleep. The first request after inactivity may take 50 seconds or more.
- Render Free Postgres has an expiry date. Upgrade before 2026-07-29 if this environment should persist.
- `seed_demo_data` is acceptable for demo deployment because it verifies real DB/API flow, but it is not a long-term data management strategy.
- Later real data should come from Django admin, CSV import, or an external hotel data integration.
- Booking writes should be tested against Postgres before treating booking concurrency as production-safe.

## Next Recommended Work

1. Narrow `ALLOWED_HOSTS` from `*` to the Render hostname.
2. Add a proper deployed admin setup if manual hotel data entry is needed.
3. Connect booking creation UI to the deployed API.
4. Add JWT login and Vercel frontend token handling.
