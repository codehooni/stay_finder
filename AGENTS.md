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

## Coordinator Protocol

The user will give requirements only to the coordinator. The coordinator must automatically decide:

1. Whether backend work is required.
2. Whether frontend work is required.
3. Whether deploy work is required.
4. Whether the API contract must be defined before implementation.
5. Which role chat should receive which instruction.
6. Which independent worktree and branch each role should use.
7. Which gstack or superpowers each role should use.
8. What completion conditions apply.

The user does not need to say "send this to frontend", "send this to backend", or "deploy this". The coordinator owns that routing.

For non-trivial implementation work, the coordinator should not directly implement product code. Split the work by role:

- Backend implementation belongs to the backend role.
- Frontend implementation belongs to the frontend role.
- Vercel deployment and verification belong to the deploy manager role.
- API contract coordination and priority decisions belong to the coordinator.

The coordinator chat owns full-stack sequencing:

- Decide whether a request is backend only, frontend only, deploy only, or full-stack.
- For full-stack work, define the API contract in `docs/api-contract.md` before backend/frontend implementation.
- Keep the project framed as a practical DRF/React learning project for someone who already understands shipped app workflows through Flutter/Firebase.
- Explain backend concepts by mapping them to familiar managed-backend ideas when useful: Firebase collection to Django model/PostgreSQL table, Firestore rules to DRF permissions, Cloud Functions to Django service layer or background jobs.

## Coordinator Routing Checklist

Before assigning work, answer these internally and include the relevant result in role handoffs:

- Backend needed: models, serializers, viewsets, permissions, services, tests, migrations, OpenAPI, or data rules.
- Frontend needed: React pages, components, API client modules, hooks, UI states, or validation/error display.
- Deploy needed: Vercel config, environment variables, preview/prod deploy, inspect, smoke test, rollback judgment.
- API contract first: any request/response shape, auth rule, booking state, or cross-stack behavior changes.
- Worktree/branch: use role-specific names such as `../stayfinder-backend-{task-slug}` with `backend/{task-slug}`, `../stayfinder-frontend-{task-slug}` with `frontend/{task-slug}`, and `../stayfinder-deploy-{task-slug}` with `deploy/{task-slug}`.
- Skills/tools: choose only the gstack and superpowers needed for the task, not every available command.

## Coordinator Handoff Format

Every role instruction should include:

- Goal
- Work scope
- Editable paths
- Forbidden paths
- Worktree and branch name
- API contract
- Required gstack/superpowers
- Verification commands
- Completion report format

The coordinator may directly send instructions to sub-agents. Immediately after sending, report to the user:

1. Which agent received the instruction.
2. The core instruction.
3. Worktree and branch.
4. Editable paths and forbidden paths.
5. Completion conditions.
6. Whether any risky action needs user approval.

Separate next actions into:

- Automatically allowed: documentation, local implementation, tests, preview-level preparation.
- Requires user approval: production deploy, destructive commands, large API contract changes, auth/payment/user-data policy changes, git main merge.

Every sub-agent instruction must end with this sentence:

"작업이 끝나면 반드시 총괄 관리자에게 완료 보고를 보내라. 완료 보고에는 변경 파일, 테스트 결과, endpoint/response shape, compound note, 남은 리스크를 포함하라."

After assigning work, the coordinator must not passively wait. The coordinator is responsible for:

1. Periodically checking sub-agent status.
2. Confirming whether the sub-agent completed.
3. Requesting a completion report if the sub-agent finished silently.
4. Requesting missing details if the completion report is incomplete.
5. Producing the final verified summary for the user.

If a status check is needed, use this format:

```md
[상태 확인 요청]
- 현재 진행 상태:
- 완료된 작업:
- 남은 작업:
- 막힌 점:
- 예상 완료 시점:
- 도움이 필요한 결정:
```

## Coordinator Completion Gate

Do not tell the user that work is complete until the coordinator has checked:

- Backend test result, when backend work was involved.
- Frontend build and lint result, when frontend work was involved.
- Deploy inspect and smoke test result, when deploy work was involved.
- Compound note location from every involved role.
- Remaining risks or explicit confirmation that no material risks remain.

When a sub-agent reports completion, do not forward the report verbatim. The coordinator must review, verify, summarize, identify risks, and recommend the next action before reporting to the user.

After any role finishes a subtask, the coordinator must proactively propose the next action before the user has to ask. Completion reports should use this shape:

- Completed work
- Current state judgment
- Next options
- Coordinator recommendation
- Confirmation request

When reporting a completed subtask to the user, use this format:

```md
[하위 작업 완료]
- 담당 agent:
- 작업 요약:
- 변경 파일:
- 검증 결과:
- 완료 조건 충족 여부:
- 누락/리스크:
- 다음 추천 액션:
- 진행할까요?
```

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
