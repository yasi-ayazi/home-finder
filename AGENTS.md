# Repository Guidelines

## Architecture and Ownership

Home Finder is a modular monolith composed of a React UI, an Express API, PostgreSQL, and backend-managed media storage. The browser reaches API and media routes through the UI proxy in local Docker:

```text
Browser → UI/Nginx → Express API → PostgreSQL
                       └→ media volume
```

The UI depends on the API and is not a standalone application. PostgreSQL is the source of truth for property metadata. Property images belong to backend storage; do not put property datasets or property media in `ui/public` or add frontend fallback data.

## Project Structure

- `ui/` contains the React 19, TypeScript, Vite, Leaflet, Vitest, and Playwright application.
- `server/src/` contains Express configuration, controllers, routes, services, repositories, models, middleware, database code, OpenAPI, and tests.
- `server/seed-media/` contains versioned sample media copied into runtime storage by the seed process.
- `docker-compose.yml` orchestrates `postgres`, `migrate`, `seed`, `server`, and `ui`.
- `.github/workflows/ci.yml` performs code-quality and full-stack smoke verification only; it must not deploy.

Keep `server/src/app.ts` independent from `server/src/server.ts`: tests must construct the Express app without opening a network port. Keep SQL behind repositories and HTTP behavior in controllers. Do not add empty architectural layers.

## Development Commands

Run the complete environment from the repository root:

```powershell
docker compose up --build
```

Compose must preserve the dependency chain `postgres → migrate → seed → server → ui`. The migration and seed services are one-shot jobs. The server must not start after either job fails.

For native backend development, start PostgreSQL and initialize the database:

```powershell
docker compose up -d postgres
cd server
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

For the UI, keep the database and API running, then use a second terminal:

```powershell
cd ui
npm install
npm run dev
```

The UI is available at `http://localhost:5173`; the API and Scalar documentation are available at `http://localhost:3000` and `http://localhost:3000/docs`.

## Database and Media Rules

- Add schema changes through migrations in `server/src/db/migrations`; never require manual table creation.
- Use parameterized SQL and keep database access behind repository interfaces.
- Keep seed operations idempotent. Repeated seeds must not duplicate records or overwrite developer-modified rows/media.
- Store relative media keys such as `properties/property-1.jpg` in PostgreSQL, never binary images, absolute host paths, or Docker service hostnames.
- Resolve media only beneath the configured `STORAGE_ROOT` and preserve traversal protections.
- The `postgres_data` and `property_media` named volumes must survive ordinary container recreation.

## Coding Style

Use TypeScript, four-space indentation, double quotes, semicolons, and explicit public/domain types. React components and component directories use PascalCase; variables/functions use camelCase; CSS uses descriptive kebab-case or BEM-style names. Keep component `.tsx`, `.css`, and focused tests together.

Validate environment variables through the server configuration module. Return consistent JSON errors through centralized middleware and do not expose production stack traces. Keep the OpenAPI 3.1 definition synchronized with routes and serve documentation with Scalar, not Swagger UI.

## Testing and Verification

Before submitting server changes, run from `server/`:

```powershell
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Database repository tests require an isolated, migrated, seeded database through `TEST_DATABASE_URL`; never point integration tests at developer data.

Before submitting UI changes, run from `ui/`:

```powershell
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

For architecture, API, database, media, proxy, or Compose changes, also run:

```powershell
docker compose config --quiet
docker compose up -d --build --wait
cd ui
npm run test:e2e
```

Verify `/health`, `/ready`, `/api/properties`, `/api/properties/:id`, `/media/...`, `/openapi.json`, and `/docs`. Inspect container logs rather than reporting success from startup status alone.

## Git and Pull Requests

Do not work directly on `main`. Preserve unrelated worktree changes and never reset or overwrite user changes. Follow Conventional Commits with imperative summaries such as `feat: add PostgreSQL property repository`. Keep commits focused.

Pull requests must describe user-visible and architectural changes, list every validation command actually run, call out dependency/configuration changes, and include screenshots for visual changes. CI is verification-only: do not add deployment, registry publishing, releases, Kubernetes, or cloud infrastructure.
