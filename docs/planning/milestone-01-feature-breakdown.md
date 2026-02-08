# Milestone 1: Playable Vertical Slice

## Objective

Deliver a playable 60-second SimTrader session with three mock tickers, buy and sell actions, a countdown timer, and deterministic pricing logic, backed by test and quality scripts.

## Feature List

### F01 - Quality Gate Setup

- Scope: add `test`, `format`, and `typecheck` scripts and baseline config for Jest, Testing Library, and TypeScript checks.
- Out of scope: advanced CI matrix or flaky-test retries.
- Dependencies: none.
- Acceptance criteria:
  - `npm run lint` passes.
  - `npm run typecheck` passes.
  - `npm test` runs locally.
  - `npm run format` runs locally.

### F02 - Domain Types and Seed Data

- Scope: define ticker, quote, order, position, and portfolio types in `src/types`; add three deterministic ticker seeds under `public/data`.
- Out of scope: remote APIs or persistence.
- Dependencies: F01.
- Acceptance criteria:
  - Types cover quote ticks and order execution.
  - Demo data loads without runtime type errors.

### F03 - Simulation Engine Core

- Scope: implement deterministic tick generation in `src/lib` with volatility presets and replayable seed behavior.
- Out of scope: news shocks and Monte Carlo branching.
- Dependencies: F02.
- Acceptance criteria:
  - Engine emits predictable tick sequences for fixed seed.
  - Unit tests verify monotonic time progression and bounded output.

### F04 - Market Strip and Session Timer UI

- Scope: render live ticker cards and 60-second countdown in `src/components` and `src/app/page.tsx`.
- Out of scope: charting.
- Dependencies: F03.
- Acceptance criteria:
  - Three tickers update visually every tick.
  - Timer reaches zero and ends session state.

### F05 - Trade Ticket and Execution Flow

- Scope: add buy and sell actions, quantity input, validation, and order execution reducer logic.
- Out of scope: short selling and margin.
- Dependencies: F04.
- Acceptance criteria:
  - Buy and sell update holdings correctly.
  - Invalid orders show clear validation messages.

### F06 - Portfolio and P&L Panel

- Scope: display cash, holdings value, and total portfolio value updated per tick.
- Out of scope: tax lots and fees.
- Dependencies: F05.
- Acceptance criteria:
  - Portfolio totals update after each trade and tick.
  - Values remain internally consistent with executed orders.

### F07 - Test Coverage for Slice

- Scope: add unit tests for simulation and execution logic plus one UI interaction test.
- Out of scope: full e2e browser suite.
- Dependencies: F06.
- Acceptance criteria:
  - At least one test file in `src/lib` and one in UI component layer.
  - Coverage report includes simulation and execution modules.

### F08 - Docs and Repo Hygiene

- Scope: update README setup and status, add missing `LICENSE`, replace placeholders.
- Out of scope: marketing copy overhaul.
- Dependencies: F01.
- Acceptance criteria:
  - `README.md` reflects actual scripts and current app state.
  - `LICENSE` exists and referenced content is accurate.

## Milestone Exit Criteria

- All features F01 to F08 are merged.
- Local verification: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- Manual check: one full 60-second session with at least one successful buy and one successful sell.
