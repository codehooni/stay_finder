---
title: Hotel MVP frontend scaffold
date: 2026-06-24
area: frontend
tags:
  - react
  - vite
  - api-client
  - hotel-mvp
problem: Build the first StayFinder React frontend slice against the backend Hotel public API contract without mixing API URLs into components.
what_worked: A small Vite React TypeScript scaffold with typed hotel API modules kept the list/detail pages focused on loading and rendering states.
what_failed: The referenced detail response example omits min_price while the role instruction says detail includes the list fields.
root_cause: Contract prose and example JSON drifted during backend/frontend handoff.
prevention_rule: When response prose says an endpoint extends another shape, keep the example JSON in sync or add an explicit optional-field note before implementation.
files_or_patterns: frontend/src/api/client.ts, frontend/src/api/hotels.ts, frontend/src/types/hotel.ts, frontend/src/pages/HotelListPage.tsx, frontend/src/pages/HotelDetailPage.tsx
verification: npm run build, npm run lint, npm run test
---
