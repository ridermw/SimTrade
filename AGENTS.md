# Repository Guidelines

## Project Structure & Module Organization

Keep runtime code in `src/`. Route handlers and pages live in `src/app/`, reusable UI in `src/components/`, domain helpers in `src/lib/`, and shared types in `src/types/`. Store static market data and demo assets inside `public/data/`. Tests sit alongside modules as `*.test.ts(x)` files; longer flows land in `tests/e2e/`.

## Build, Test, and Development Commands

Install dependencies with `npm install` (Node.js ≥18). Run the local app using `npm run dev` and build for production with `npm run build && npm start`. Execute unit tests via `npm test`; append `-- --watch` while iterating. Enforce quality gates with `npm run lint` (ESLint) and `npm run format` (Prettier). Add `npm run typecheck` if you introduce tsc checks to CI.

## Coding Style & Naming Conventions

Write TypeScript-first, functional React components. Indent with two spaces and limit files to focused responsibilities. Components use PascalCase (`PriceTicker.tsx`); hooks use camelCase prefixed by `use`; utilities stay camelCase. Prefer Tailwind utility classes or module-scoped styles to avoid global leakage. Always run `npm run format` before committing; rely on ESLint auto-fixes for import ordering.

## Testing Guidelines

Cover UI and simulation utilities with Jest and Testing Library; colocate specs (`PriceTicker.test.tsx`) with the code they exercise. Mock timers and fetch calls to keep tests deterministic. Capture full trading sessions in Playwright under `tests/e2e/`; mark multi-minute runs with `@slow` so CI can filter them (`npx playwright test --grep-invert "@slow"`). Maintain ≥80 % coverage for `src/lib/` and core components using `npm test -- --coverage`.

## Commit & Pull Request Guidelines

Use Conventional Commits (`feat:`, `fix:`, `docs:`, etc.) with concise, imperative subjects under 72 characters. PR descriptions must state the gameplay or UX impact, list verification commands, and include screenshots or clips for UI changes. Keep changes scoped, ensure lint/test/typecheck tasks pass, and request at least one teammate review before merge.

## Security & Configuration Tips

Keep secrets in `.env.local` (ignored by Git) and expose values with `NEXT_PUBLIC_` only when safe for the client. Sanitise example configs in `public/configs/` before committing. Document new third-party services, analytics, or permission changes in the PR body and pin dependency upgrades to reviewed versions.
