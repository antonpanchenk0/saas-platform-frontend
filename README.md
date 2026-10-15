# Tecca SaaS Frontend

Next.js (App Router) frontend for the Tecca SaaS platform. This repository currently contains the
project foundation only: tooling, a minimal scaffold, and test/CI setup. No product features yet.

## Stack

| Area         | Choice                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19, TypeScript (strict)                       |
| Styling      | Tailwind CSS v4                                                              |
| UI           | shadcn/ui + [ReUI](https://reui.io) (**Base UI** variant, style `base-nova`) |
| Server state | TanStack Query                                                               |
| Forms        | React Hook Form + Zod                                                        |
| API          | `openapi-typescript` (types) + `openapi-fetch` (client)                      |
| Unit tests   | Vitest + React Testing Library (jsdom)                                       |
| E2E tests    | Playwright (Chromium)                                                        |
| Code quality | ESLint 9 (flat config), Prettier, Husky + lint-staged                        |
| CI           | GitHub Actions                                                               |

## Requirements

- **Node.js** `^22.22.2` (or `^24.15.0` / `>=26`). `.nvmrc` pins the major version used in CI.
- **pnpm** `>=10.33.0`. The exact version is pinned in `package.json` (`packageManager`); with
  [Corepack](https://nodejs.org/api/corepack.html) enabled (`corepack enable`) the right version is
  used automatically.

Use pnpm only. Do not run `npm install` or `yarn`.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # on Windows (cmd): copy .env.example .env.local
pnpm dev                     # http://localhost:3000 (the .env.example values target https://platform.test)
```

`pnpm install` also installs the Git hooks (Husky).

### Running with the backend stack (Docker, `platform.test`)

For the full local environment the frontend is built and run by the Docker Compose file of the
backend repository (`saas-platform-backend`). It uses this repository's `Dockerfile.dev`,
bind-mounts the source for hot reload, and serves the app through Nginx at
`https://platform.test` and `https://auth.platform.test`. Keep this repository next to the backend
one (`../saas-platform-frontend`), or set `FRONTEND_PATH` in the backend `.env`. Compose reads
`NEXT_PUBLIC_API_BASE_URL`, `NEXT_ALLOWED_DEV_ORIGINS` and `FRONTEND_URL` (as
`NEXT_PUBLIC_APP_URL`) from the backend `.env`, so `.env.local` is not needed there. See the backend `README.md` for the hosts file, certificates and commands.

## Scripts

| Script               | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `pnpm dev`           | Start the development server                                    |
| `pnpm build`         | Create a production build                                       |
| `pnpm start`         | Serve the production build                                      |
| `pnpm lint`          | Run ESLint                                                      |
| `pnpm lint:fix`      | Run ESLint and apply safe fixes                                 |
| `pnpm format`        | Format all supported files with Prettier                        |
| `pnpm format:check`  | Check formatting without writing                                |
| `pnpm typecheck`     | Generate Next.js types, then run `tsc --noEmit`                 |
| `pnpm test`          | Run unit and component tests once (Vitest)                      |
| `pnpm test:watch`    | Run Vitest in watch mode                                        |
| `pnpm test:coverage` | Run tests with coverage                                         |
| `pnpm test:e2e`      | Run Playwright tests                                            |
| `pnpm test:e2e:ui`   | Open the Playwright UI                                          |
| `pnpm generate:api`  | Generate TypeScript API definitions from the OpenAPI schema     |
| `pnpm check`         | Run lint, format check and type check (the fast pre-push check) |

## Code style, linting and types

- **Prettier** (`.prettierrc.json`): single quotes (also in JSX), no semicolons, 2 spaces, trailing
  commas (`all`), 100 columns, `arrowParens: avoid`, LF line endings. `.editorconfig` and
  `.gitattributes` keep editors and Git consistent.
- **ESLint** (`eslint.config.mjs`, flat config): `eslint-config-next` (Core Web Vitals, React,
  React Hooks, a11y) + `typescript-eslint` recommended rules, a few type-aware rules
  (`no-floating-promises`, `no-misused-promises`), `consistent-type-imports`, and
  `eslint-config-prettier` last so formatting is left entirely to Prettier.
  - Intentionally unused arguments/variables must be prefixed with `_` (e.g. `_event`). This is the
    only exemption from `no-unused-vars`.
  - Generated code (`src/lib/api/generated`) and build output are ignored.
  - ESLint is on v9 because `eslint-plugin-react`, `eslint-plugin-jsx-a11y` and
    `eslint-plugin-import` (used by `eslint-config-next`) do not support v10 yet.
- **TypeScript** (`tsconfig.json`): `strict`, `noEmit`, `@/*` → `src/*`. Prefer `unknown` over `any`
  and validate unknown data with Zod. TypeScript is on 6.0 because `typescript-eslint` does not
  support 7.x yet. `openapi-typescript` only declares TypeScript 5 as a peer; it works with 6.0
  (verified) so `package.json` allows it through a narrow `pnpm.peerDependencyRules` entry.
- **Git hooks**: on commit, Husky runs `lint-staged` (ESLint `--fix` + Prettier on staged files
  only). Type checks, tests and E2E run in CI, not on commit.

## Testing

### Unit and component tests (Vitest)

- Tests live in `tests/unit` and `tests/components` (`*.test.ts` / `*.test.tsx`).
- Environment: jsdom. Setup: `tests/setup.ts` (registers `jest-dom` matchers and cleans up between
  tests). Import `describe`/`it`/`expect` from `vitest` (globals are disabled).
- Use `@testing-library/user-event` for interactions.
- Async Server Components and real browser/server behavior are **not** covered well by Vitest — test
  those with Playwright.

### Coverage

`pnpm test:coverage` prints a summary and writes `coverage/` (open `coverage/index.html`; `lcov.info`
is also produced). Generated code, e2e tests, the root layout and the copy-owned `components/ui` and
`components/reui` primitives are excluded.

Thresholds are set in `vitest.config.ts` (`test.coverage.thresholds`): statements 60%, branches 50%,
functions 60%, lines 60%. They are intentionally modest for a new project. As real features are
added, raise them gradually (for example +5 points per milestone), keeping them just below actual
coverage so regressions fail CI.

### End-to-end tests (Playwright)

- Tests live in `tests/e2e` (`*.spec.ts`); config is `playwright.config.ts`. Chromium is the only
  required browser for now.
- First run: `pnpm exec playwright install chromium` (add `--with-deps` on Linux).
- `pnpm test:e2e` starts the dev server automatically (reusing one that is already running). In CI
  (`CI=true`) it serves the production build with `pnpm start`, so run `pnpm build` first.
- Environment variables: `PLAYWRIGHT_BASE_URL` (default `http://localhost:3000`) and
  `PLAYWRIGHT_SKIP_WEBSERVER=true` to test an already running or deployed server.
- Traces are collected on first retry; screenshots and video are kept only for failed tests. Reports
  go to `playwright-report/`, artifacts to `test-results/` (both git-ignored).

## API types (Django REST Framework)

The backend exposes an OpenAPI schema through
[`drf-spectacular`](https://drf-spectacular.readthedocs.io/). Types are generated from it with
`openapi-typescript` into `src/lib/api/generated/schema.d.ts` — **never edit that file by hand**.

1. Choose a schema source, in order of precedence:
   - `API_SCHEMA_SOURCE` in `.env.local` (or the shell): a file path or an `http(s)` URL, e.g.
     `https://api.platform.test/api/schema/` (the default drf-spectacular `SpectacularAPIView` route) or
     `./openapi/schema.yaml`.
   - Otherwise `openapi/schema.yaml` (or `.yml` / `.json`) in the repository root.
2. Run `pnpm generate:api`. Invalid schemas fail the command with an error message.
3. Commit the generated file together with the backend change that caused it.

To export the schema from the backend without a running server:
`python manage.py spectacular --file openapi/schema.yaml`.

Other modes: `pnpm generate:api --check` fails if the committed output differs from the schema (used
in CI), and `--if-present` makes the command succeed silently when no schema is configured. Ordinary
installs, unit tests and builds never require the backend or the generated file.

Once generated, create a typed client with `openapi-fetch`:

```ts
import createClient from 'openapi-fetch'

import type { paths } from '@/lib/api/generated/schema'

export const api = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL })
```

## UI components (ReUI + shadcn/ui)

`components.json` configures the shadcn CLI with the **Base UI** variant (`base-nova`) and the
`@reui` registry. ReUI has no npm package: components are copied into the repo with the CLI.

```bash
pnpm dlx shadcn@latest add button          # stock shadcn/ui component -> src/components/ui
pnpm dlx shadcn@latest add @reui/badge     # ReUI component -> src/components/reui
```

- Use the Base UI variant consistently; do not mix in Radix-based variants of the same primitive.
- `src/components/ui` holds shadcn/ui primitives; ReUI items install into `src/components/reui` (the
  registry's own target). Project-specific compositions belong in `src/components/shared` and
  `src/features`.
- Paid ReUI items need a license key (`REUI_LICENSE_KEY`); see the
  [ReUI registry docs](https://reui.io/docs/registry).
- The root layout wraps the app in an `isolate` container so Base UI popups render above content.

## Project structure

```text
src/
  app/                 Next.js routes, layout, global CSS (Tailwind v4)
  components/ui/       shadcn/ui primitives (installed via CLI)
  components/reui/     ReUI components (installed via CLI)
  components/shared/   Reusable, non-feature-specific components
  features/            Product-specific modules (future)
  hooks/               Shared React hooks
  lib/api/generated/   Generated OpenAPI types (do not edit)
  lib/utils/           Utilities (`cn`)
  providers/           React context providers (TanStack Query)
tests/
  unit/  components/  e2e/  setup.ts
scripts/               Tooling scripts (API type generation)
```

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored). Only variables prefixed with `NEXT_PUBLIC_` reach
the browser — never put secrets in them. Never commit `.env` files; only `.env.example` is tracked.

| Variable                    | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`       | Public URL of this app                              |
| `NEXT_PUBLIC_API_BASE_URL`  | Backend base URL                                    |
| `NEXT_ALLOWED_DEV_ORIGINS`  | Extra dev-server hostnames allowed behind a proxy   |
| `API_SCHEMA_SOURCE`         | OpenAPI schema file or URL for `pnpm generate:api`  |
| `PLAYWRIGHT_BASE_URL`       | E2E base URL (default `http://localhost:3000`)      |
| `PLAYWRIGHT_SKIP_WEBSERVER` | Set to `true` to skip starting a web server for E2E |
| `REUI_LICENSE_KEY`          | Optional, paid ReUI items via the shadcn CLI only   |

## Continuous integration

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests. No secrets are required.

1. **quality**: `pnpm install --frozen-lockfile`, `format:check`, `lint`, `typecheck`,
   `test:coverage`, generated-API drift check (skipped when no schema exists), `build`.
2. **e2e**: installs Chromium (with system dependencies), builds, and runs Playwright.

Run the same checks locally before pushing: `pnpm check && pnpm test:coverage && pnpm build`.

## Troubleshooting

- **`Unsupported engine` / Vitest or jsdom fails to start**: your Node.js is too old. Use Node 22.22.2
  or newer (`nvm use` reads `.nvmrc`).
- **pnpm version mismatch / `ERR_PNPM_UNSUPPORTED_ENGINE`**: run `corepack enable`, or
  `npm i -g pnpm@10.33.0`.
- **`Ignored build scripts: unrs-resolver`**: safe to ignore; the package ships prebuilt binaries.
- **Husky hooks do not run**: run `pnpm install` (the `prepare` script sets `core.hooksPath`), and
  make sure Git is not run with `--no-verify`.
- **Playwright: "Executable doesn't exist"**: run `pnpm exec playwright install chromium`.
- **Playwright: port already in use**: set `PLAYWRIGHT_BASE_URL` to a free port, or stop the other
  server. Locally, an already running server on the configured port is reused.
- **`pnpm generate:api` fails with `no schema source configured`**: set `API_SCHEMA_SOURCE` or add
  `openapi/schema.yaml`. If using a URL, make sure the backend is running.
- **Type errors about `next-env.d.ts` or route types**: run `pnpm typecheck` (it runs
  `next typegen` first) or `pnpm dev` once.
- **Stale build/cache problems**: delete `.next` and `node_modules`, then `pnpm install`.
- **Line-ending diffs on Windows**: the repository enforces LF via `.gitattributes`; configure your
  editor to use LF (`.editorconfig` does this for most editors).
