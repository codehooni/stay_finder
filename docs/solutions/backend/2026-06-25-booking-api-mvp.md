---
title: Booking API MVP service-layer rules
date: 2026-06-25
area: backend
tags:
  - django
  - drf
  - booking
  - testing
problem: Booking creation needs server-owned ownership, price, status, date validation, inventory validation, listing, detail access control, and cancellation without expanding into JWT, frontend, payment, or admin approval workflows.
what_worked: A thin DRF ViewSet delegates creation and cancellation to a bookings service layer, while serializers keep input and output shapes separate. API tests use Django default User plus force_authenticate to exercise IsAuthenticated behavior without introducing JWT endpoints yet.
what_failed: Running tests before a local venv existed failed because the worktree did not have a python command or installed Django packages.
root_cause: The new sibling worktree had no backend virtual environment, so verification needed a fresh `.venv` created inside `backend/`.
prevention_rule: For each backend role worktree, create or confirm `backend/.venv`, install `backend/requirements.txt`, then run failing tests before implementing service-layer behavior.
files_or_patterns: `bookings/services.py` owns booking business rules, `bookings/serializers.py` separates create input from response output, and `bookings/views.py` filters non-staff querysets to `request.user`.
verification: `.venv/bin/python manage.py makemigrations --check --dry-run`, `.venv/bin/python manage.py test bookings`, and `.venv/bin/python manage.py test hotels bookings`
---
