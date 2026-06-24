---
title: Public Hotel API MVP scaffold
date: 2026-06-24
area: backend
tags:
  - django
  - drf
  - hotels
  - testing
problem: StayFinder needed the first backend slice: Django/DRF scaffolding and public hotel read APIs without pulling bookings, auth, frontend, or deploy into scope.
what_worked: Start with API tests, then add a small hotels domain with City, Hotel, and RoomType models. Use a DRF ReadOnlyModelViewSet and a custom room-types action for a simple contract that React can consume early.
what_failed: The repository initially had no backend scaffold or Python dependencies, so the first RED test failed at missing manage.py before reaching API behavior.
root_cause: This was the first backend implementation pass, so project structure, dependencies, settings, urls, apps, models, and migrations all had to be introduced together.
prevention_rule: For future backend slices, add the expected API behavior test first, keep endpoint shape synchronized in docs/api-contract.md, and keep MVP responses narrower than future roadmap fields until models exist.
files_or_patterns: backend/config/settings.py, backend/config/urls.py, backend/hotels/models.py, backend/hotels/serializers.py, backend/hotels/views.py, backend/hotels/tests/test_hotel_api.py, backend/hotels/fixtures/sample_hotels.json
verification: .venv/bin/python backend/manage.py test hotels
---
