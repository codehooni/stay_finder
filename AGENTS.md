# StayFinder Agent Rules

## Global Development Rules

### iOS Build Error: Module 'xxx' not found

Example:

```txt
/ios/Runner/GeneratedPluginRegistrant.m:12:9 Module 'cloud_firestore' not found
```

Likely cause:

- Xcode probably opened the wrong project file.

First fix to suggest:

- Open **`Runner.xcworkspace`**, not `Runner.xcodeproj`.
- CocoaPods dependencies are loaded through the workspace.
- Recommend this before other fixes.

## Project Shape

StayFinder is operated as a monorepo:

```txt
stay_finder/
  AGENTS.md
  README.md
  docs/
    api-contract.md
    decisions.md
    prompts/
    brainstorms/
    plans/
    solutions/
      backend/
      frontend/
      deploy/
      full-stack-contract/
      process/
  backend/
  frontend/
```

## Multi-Agent Operating Model

Use four Codex chats when the project grows beyond a single focused change:

- Coordinator: receives user requests, defines scope, splits backend/frontend/deploy work, owns API contract coordination.
- Backend: Django/DRF only.
- Frontend: React only.
- Deploy: Vercel deployment, environment variables, inspect, smoke tests, rollback judgment.

Each implementation chat must work in an independent git worktree.

The coordinator chat owns full-stack sequencing:

- Decide whether a request is backend only, frontend only, deploy only, or full-stack.
- For full-stack work, define the API contract in `docs/api-contract.md` before backend/frontend implementation.
- Keep the project framed as a practical DRF/React learning project for someone who already understands shipped app workflows through Flutter/Firebase.
- Explain backend concepts by mapping them to familiar managed-backend ideas when useful: Firebase collection to Django model/PostgreSQL table, Firestore rules to DRF permissions, Cloud Functions to Django service layer or background jobs.

## Ownership Boundaries

- Backend chat modifies only `backend/` and explicitly allowed docs.
- Frontend chat modifies only `frontend/` and explicitly allowed docs.
- Deploy chat modifies deployment config and deploy docs only; it does not edit backend/frontend implementation files.
- Coordinator avoids direct implementation unless the task is small enough for one session.
- API contract changes must be documented before frontend/backend implementation proceeds.

## Backend Rules

Backend scope:

- Django, DRF, PostgreSQL, JWT, permissions, serializers, viewsets, routers, tests.
- Apps: `accounts`, `hotels`, `bookings`, `reviews`, `common`.

Booking creation must be validated server-side:

- User is authenticated.
- `check_in < check_out`.
- Past dates are rejected.
- `guests <= room_type.max_guests`.
- Overlapping booking count is less than `room_type.total_rooms`.
- `total_price` is calculated on the server.
- Client-provided `user_id`, `total_price`, and `status` are not trusted.

Prefer service-layer booking logic instead of putting all behavior in a ViewSet.

## Frontend Rules

Frontend scope:

- React, TypeScript, Vite, UI, API clients, hooks, error display.

Expected pages:

- `HotelListPage`
- `HotelDetailPage`
- `HotelBookingPage`
- `MyBookingListPage`

Expected API functions:

- `getHotels(params)`
- `getHotelDetail(hotelId)`
- `createBooking(payload)`
- `getMyBookings()`
- `cancelBooking(bookingId)`

Frontend implementation rules:

- Components must not hard-code API URLs.
- API calls belong in `src/api/client.ts`, `src/api/hotels.ts`, `src/api/bookings.ts`, and similar modules.
- Authorization headers are handled in the shared client.
- Server validation errors are mapped to user-friendly messages.
- Booking creation posts to `POST /api/bookings/` with `room_type`, `check_in`, `check_out`, and `guests`.

## Deploy Rules

Deploy scope:

- Vercel config, preview/prod deploys, environment variables, build logs, deployment inspect, smoke tests, rollback judgment.

Vercel checklist:

- Confirm project root: monorepo root vs `frontend/`.
- Confirm framework preset.
- Confirm build command.
- Confirm output directory.
- Confirm environment variables, especially `VITE_API_BASE_URL`.
- Distinguish preview and production deployment.
- After deploy, do not stop at a URL. Run inspect and live smoke checks.

## Reporting Format

For implementation work, include:

- Work summary
- Changed files
- API contract changes
- Tests and verification commands with results
- Cross-team handoff notes
- Compound note location when applicable

## Compound Notes

After review and verification, record reusable lessons in `docs/solutions/{area}/` or this file.

Areas:

- `backend`
- `frontend`
- `deploy`
- `full-stack-contract`
- `process`

Use this format:

```md
---
title:
date:
area: backend | frontend | deploy | full-stack-contract | process
tags:
  - django
  - drf
  - react
  - testing
problem:
what_worked:
what_failed:
root_cause:
prevention_rule:
files_or_patterns:
verification:
---
```

Every compound note must include a next-time prevention rule.
