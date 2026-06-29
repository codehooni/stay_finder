# StayFinder Decisions

This file records project decisions that should stay stable across backend, frontend, and deploy work.

## 2026-06-24: Learn DRF by Rebuilding Managed Backend Concepts

Decision:

- StayFinder should be built as a practical hotel reservation product, not a toy CRUD tutorial.
- Explanations and implementation plans should assume the developer already understands real app shipping through Flutter/Firebase.
- Backend concepts should be mapped to Firebase equivalents when helpful:
  - Firebase collection -> Django model and PostgreSQL table
  - Firestore query -> Django QuerySet
  - Firestore security rules -> DRF permission and queryset restriction
  - Firebase Auth token -> JWT auth and `request.user`
  - Cloud Functions business logic -> Django service layer or background worker

Reason:

- The goal is to learn how to own backend design directly: models, validation, permissions, API contracts, tests, and deployment boundaries.
- The fastest learning path is to connect new DRF concepts to app architecture the developer already knows.

Consequences:

- Backend work should avoid beginner-only examples that do not connect to product behavior.
- Booking creation must be treated as business logic, not as a simple serializer save.
- React work should focus on clean API boundaries and product states, not just rendering static data.

## 2026-06-24: API Contract Comes Before Full-Stack Implementation

Decision:

- Full-stack tasks must update `docs/api-contract.md` before backend and frontend implementation begin.
- The coordinator chat owns contract sequencing.

Reason:

- This project is intentionally split between backend and frontend learning.
- Contract drift would make the learning loop noisy: the developer should see how DRF response shapes and React API client types meet at a clear boundary.

Consequences:

- Backend changes that alter request/response shape are incomplete until this document changes.
- Frontend code should not infer undocumented fields.
- Deploy validation should smoke-test the documented user flow, not only check that a page loads.

## 2026-06-24: Booking Rules Are Server-Owned

Decision:

- Booking availability, total price, booking owner, and booking status are owned by the backend.
- The frontend sends only user intent: room type, dates, and guests.

Reason:

- This mirrors the real security boundary between a trusted server and an untrusted client.
- It teaches the practical difference between UI validation and authoritative backend validation.

Consequences:

- Backend must ignore or reject client-provided `user_id`, `total_price`, and `status`.
- Booking creation should use a service layer that can be tested independently.
- React should display backend validation errors in user-friendly copy.

## 2026-06-24: Vercel Deploys Must Be Verified Beyond URL Creation

Decision:

- A Vercel deployment is not complete when the CLI prints a URL.
- Deploy work must include inspect output and a live smoke test.

Reason:

- Preview/prod differences, environment variables, monorepo roots, and stale aliases can make a deployment look successful while the user flow is broken.

Consequences:

- Deploy reports must include deployment type, URL, inspect result, smoke result, env var changes, and rollback judgment.
- `VITE_API_BASE_URL` must be verified for each deploy environment.

## 2026-06-29: Use Render for Django Backend Deployment

Decision:

- Keep the React frontend on Vercel.
- Deploy the Django REST Framework backend to Render.
- Use Postgres for the deployed backend database.
- Keep local SQLite as a short-term development fallback unless local Postgres parity becomes necessary.

Reason:

- Render matches the standard Django deployment model better than Vercel serverless for this project.
- It keeps the learning focus on Django/DRF, environment variables, migrations, Postgres, and API smoke testing without jumping too early into full server administration.
- Postgres is a better match for booking transaction logic than SQLite, especially because the backend already uses `transaction.atomic` and `select_for_update`.

Consequences:

- Backend deploy work should target Render Web Service plus Render Postgres.
- Production settings must read `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `DATABASE_URL` from environment variables.
- Vercel frontend must set `VITE_API_BASE_URL` to the Render backend URL before the final full-stack production smoke test.
- Django deployment is not complete until migrations, seed data, `/api/hotels/`, room types, CORS, and frontend-to-backend production calls are verified.
