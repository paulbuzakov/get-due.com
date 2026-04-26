# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

GetDue is a personal finance tracking application (stocks, properties, cash accounts, loans, recurring payments, calendar). Full-stack: .NET 10 API backend + Next.js 16 frontend, PostgreSQL database, all containerized with Docker.

## Commands

### Backend (run from `backend/`)

```bash
dotnet restore GetDue.slnx                    # restore packages
dotnet build GetDue.slnx -c Release            # build
dotnet test GetDue.slnx                        # run all tests
dotnet run --project src/GetDue.API            # start API (http://localhost:5999)
dotnet watch run --project src/GetDue.API      # start API with hot reload

# EF Core migrations (from backend/)
dotnet ef migrations add <Name> --project src/GetDue.Infrastructure --startup-project src/GetDue.API
dotnet ef database update --project src/GetDue.Infrastructure --startup-project src/GetDue.API
```

### Frontend (run from `frontend/`)

```bash
npm ci              # install dependencies
npm run dev         # dev server (http://localhost:3000)
npm run build       # production build
npx tsc --noEmit    # type check (no linter configured yet)
```

### Docker

```bash
docker-compose -f docker-compose.dev.yml up    # dev stack with hot reload
docker-compose up                               # production stack
```

Dev stack exposes: API at :5001, frontend at :3000. PostgreSQL runs inside Docker only.

## Architecture

### Backend — Clean Architecture (.NET 10)

Four projects with strict dependency direction: Domain ← Application ← Infrastructure ← API.

- **GetDue.Domain** — Entities (`BaseEntity`/`AuditableEntity`), enums, repository interfaces (`IRepository<T>`, `IUnitOfWork`)
- **GetDue.Application** — DTOs, FluentValidation validators, AutoMapper profiles, service interfaces. MediatR is wired but services use direct injection currently.
- **GetDue.Infrastructure** — EF Core DbContext (`AppDbContext`), generic `Repository<T>`, JWT auth service, Quartz job scheduling, currency service. DI registration in `ServiceCollectionExtensions`.
- **GetDue.API** — Controllers, `ExceptionHandlingMiddleware` (returns ProblemDetails-style JSON), `DataSeeder`, `Program.cs` composition root.

Key patterns:
- All entities have `UserId` — controllers filter by authenticated user via `User.GetUserId()` extension
- `AppDbContext.SaveChangesAsync` auto-sets `CreatedAt`/`UpdatedAt`/`CreatedBy`/`UpdatedBy` audit fields
- Quartz `RecurringPaymentJob` runs daily at 2 AM UTC
- Auth: JWT bearer tokens with refresh token rotation

### Frontend — Next.js 16 App Router

- **`src/app/`** — App Router pages. Dashboard routes are under `/dashboard/*`
- **`src/components/`** — UI primitives in `ui/`, layout components in `layout/`
- **`src/lib/api.ts`** — Axios instance with JWT interceptor and automatic 401 refresh
- **`src/lib/queries.ts`** — All TanStack React Query hooks with hierarchical query keys
- **`src/stores/`** — Zustand stores for auth state and theme
- **`src/types/index.ts`** — All shared TypeScript interfaces

Key patterns:
- Server state via React Query, client state via Zustand (auth, theme only)
- Path alias `@/*` maps to `./src/*`
- Output mode: `standalone` (optimized Docker builds)

### Important: Next.js 16 has breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Environment Variables

Backend (set in appsettings or environment):
- `ConnectionStrings__DefaultConnection` — PostgreSQL connection string
- `Jwt__Secret` — HS256 signing key (32+ chars)
- `Cors__AllowedOrigins__0` — Frontend origin (default: `http://localhost:3000`)

Frontend:
- `NEXT_PUBLIC_API_URL` — API base URL (default: `http://localhost:5999/api`)

## CI

GitHub Actions (`.github/workflows/ci.yml`): runs on push/PR to main. Backend job: restore → build → test. Frontend job: install → type check → build.
