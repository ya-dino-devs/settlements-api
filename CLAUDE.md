# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **npm**. Node app is NestJS 11 on TypeScript.

```bash
npm run start:dev              # nest start --watch
npm run build                  # nest build (output -> dist/)
npm run lint                   # eslint with --fix
npm run format                 # prettier write

npm test                       # jest, unit specs (*.spec.ts under src/)
npm test -- path/to.spec       # run a single spec file
npm run test:watch
npm run test:cov
npm run test:e2e               # uses test/jest-e2e.json

# TypeORM (CLI uses ormconfig.ts, which loads .env.development.local by default)
npm run migration:generate src/migrations/<Name>
npm run migration:create   src/migrations/<Name>
npm run migration:run
npm run migration:rollback
npm run migration:prod:run     # NODE_ENV=production, loads .env
```

## Environment

`@nestjs/config` loads, in order: `.env.development.local`, `.env.development`, `.env`. Local secrets go in `.env.development.local` (gitignored — copy from `.env.development` template). Required keys: `DATABASE_HOST/PORT/USERNAME/PASSWORD/NAME`, `JWT_SECRET`, `JWT_TOKEN_AUDIENCE`, `JWT_TOKEN_ISSUER`, `JWT_ACCESS_TOKEN_TTL`, `JWT_REFRESH_TOKEN_TTL`, `REDIS_HOST`, `REDIS_PORT`. Redis is required at boot (used by `RefreshTokenIdsStorage`).

Note: `src/app.module.ts` hardcodes `host: 'localhost'` for Postgres — `DATABASE_HOST` is only honored by `ormconfig.ts` (the migration CLI). Keep that in mind when running against a non-local DB.

## Architecture

NestJS modular monolith. Top-level modules wired in `src/app.module.ts`:

- **`iam/`** — Identity & Access Management. Owns authentication (sign-up / sign-in / refresh) and authorization. Registers **two global guards** via `APP_GUARD`:
  - `AuthenticationGuard` is the entry point. It reads the `AUTH_TYPE_KEY` metadata set by `@Auth(...)` and delegates to a per-type guard map (default = `AccessTokenGuard`, which verifies JWT and puts the payload on `request[REQUEST_USER_KEY]`).
  - `RolesGuard` reads `ROLES_KEY` from `@Roles(...)` and checks `request.user.role`.

  **Default posture is bearer-protected.** Public endpoints must opt out with `@Auth(AuthType.None)` (see `AuthenticationController` and the read endpoints in `NewsController`). Admin-gated endpoints use `@Roles(Role.Admin)` (roles enum: `regular`, `admin`).

  Refresh tokens are persisted in Redis (`RefreshTokenIdsStorage`, key `user-<id>`) so a single refresh-token-id is valid per user at a time; rotation invalidates the prior one. `InvalidateRefreshTokenError` signals a reuse/mismatch.

  `HashingService` is an abstract token bound to `BcryptService` — depend on the abstract class, not bcrypt directly.

- **`users/`**, **`news/`**, **`news_types/`** — standard Nest CRUD modules (controller / service / entity / dto). Cross-module entity access: `NewsModule` re-exports `TypeOrmModule` so other modules can `TypeOrmModule.forFeature([News])` against it. Validation runs through the global `ValidationPipe` (`src/main.ts`); DTOs use `class-validator` + `class-transformer`.

- **`middlewares/logger.middleware.ts`** — applied only to the `users` route prefix (see `AppModule.configure`).

## Persistence

- TypeORM + Postgres. **Two configs exist** and they differ — be deliberate:
  - **Runtime** (`src/app.module.ts`): `synchronize: false`, `migrationsRun: true`, `autoLoadEntities: true`, verbose `logging`. Migrations are run automatically on boot.
  - **CLI** (`ormconfig.ts`): `synchronize: true` when `NODE_ENV=development` and `DISABLE_SYNC` is unset. Set `DISABLE_SYNC=1` before running `migration:generate` so the generator diffs against the actual schema instead of a freshly-synced one.
- Migrations live in `src/migrations/`; entities are discovered via the glob `./src/**/*.entity{.ts,.js}` (CLI) or `autoLoadEntities` (runtime).

## Testing layout

- Unit specs: colocated as `*.spec.ts` under `src/` (jest config inline in `package.json`, `rootDir: src`).
- E2E: `test/` with its own `jest-e2e.json`.

## API exploration

`requests/*.http` are JetBrains HTTP Client files (`news.http`, `users.http`, `news-types.http`) backed by `requests/http-client.env.json` (+ `.private` for secrets). Use these as the source of truth for example payloads when adding/modifying endpoints.