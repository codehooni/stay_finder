# StayFinder

StayFinder is a practical full-stack learning project: a global hotel search and booking service built with Django REST Framework and React.

The goal is not another beginner CRUD tutorial. The project is designed for a developer who has already shipped Flutter/Firebase apps and has built a React Todo app, then wants to learn how backend capabilities that Firebase used to manage are designed directly with Django, DRF, PostgreSQL, JWT, permissions, service layers, tests, and API contracts.

## Core Features

- Search hotels by city, dates, guests, price, and amenities.
- View hotel details and room types.
- Create bookings with JWT login.
- View booking list and booking detail.
- Cancel bookings.
- Approve or reject bookings as an admin.
- Write hotel reviews.
- Call DRF APIs from a React frontend through `src/api/*`.
- Deploy preview and production builds through Vercel.

## Learning Goals

- Understand Django project/app structure.
- Model a real reservation domain with Django ORM.
- Separate response shape and input validation with serializers.
- Build APIs with ViewSets and Routers.
- Use QuerySets for filtering and search.
- Control access with JWT and DRF permissions.
- Move booking business rules into a service layer.
- Verify behavior with tests and API documentation.
- Connect React through a typed API client layer instead of direct fetch calls inside components.

## Repo Structure

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
    manage.py
    config/
      settings.py
      urls.py
      asgi.py
      wsgi.py
    accounts/
    hotels/
    bookings/
    reviews/
    common/
  frontend/
    package.json
    vite.config.ts
    src/
      api/
        client.ts
        hotels.ts
        bookings.ts
        auth.ts
      pages/
      components/
      hooks/
      types/
```

## Project Docs

- Agent operating rules: [AGENTS.md](/Users/ijihun/development/react-practice/stay_finder/AGENTS.md)
- API contract: [docs/api-contract.md](/Users/ijihun/development/react-practice/stay_finder/docs/api-contract.md)
- Architecture decisions: [docs/decisions.md](/Users/ijihun/development/react-practice/stay_finder/docs/decisions.md)
- Multi-agent prompt pack: [docs/prompts/stayfinder-codex-multi-agent-prompts.md](/Users/ijihun/development/react-practice/stay_finder/docs/prompts/stayfinder-codex-multi-agent-prompts.md)
