# Milestone 1 GitHub Issue Drafts

Use these as the exact issue titles and starting bodies.

## 1) F01 - Add quality gate scripts and baseline test tooling

- Labels: `feature`, `milestone-1`, `tooling`
- Body:
  - Implement scripts: `test`, `format`, `typecheck` in `package.json`.
  - Add baseline config for Jest + Testing Library.
  - Keep existing lint/build behavior intact.
  - Done when `npm run lint`, `npm run typecheck`, `npm test`, and `npm run format` all run locally.

## 2) F02 - Define domain types and seed ticker data

- Labels: `feature`, `milestone-1`, `domain`
- Body:
  - Add core types for ticker, quote tick, order, position, and portfolio in `src/types`.
  - Add deterministic seed data for three tickers in `public/data`.
  - Done when data can be loaded and typed without runtime or type errors.

## 3) F03 - Build deterministic simulation engine

- Labels: `feature`, `milestone-1`, `simulation`
- Body:
  - Implement deterministic tick generator with configurable volatility presets.
  - Support fixed seed replay behavior.
  - Done when unit tests prove deterministic output for fixed seed inputs.

## 4) F04 - Build market strip and 60-second timer UI

- Labels: `feature`, `milestone-1`, `ui`
- Body:
  - Replace scaffold UI with ticker strip and visible session timer.
  - Connect UI to simulation engine tick updates.
  - Done when three tickers update live and timer reaches terminal state.

## 5) F05 - Implement trade ticket and order execution

- Labels: `feature`, `milestone-1`, `trading`
- Body:
  - Add buy and sell controls with quantity input and validation.
  - Implement execution logic for position and cash updates.
  - Done when invalid and valid order paths are both handled and tested.

## 6) F06 - Add portfolio and P&L panel

- Labels: `feature`, `milestone-1`, `portfolio`
- Body:
  - Show cash, holdings value, and total portfolio value.
  - Update values after every tick and every trade.
  - Done when panel values remain consistent with execution state.

## 7) F07 - Add focused tests for simulation and trade flow

- Labels: `feature`, `milestone-1`, `testing`
- Body:
  - Add unit tests for simulation and trade logic.
  - Add one component-level interaction test for buy/sell flow.
  - Done when coverage includes critical modules and tests are stable.

## 8) F08 - Align documentation and add license file

- Labels: `feature`, `milestone-1`, `docs`
- Body:
  - Update README to reflect actual stack, scripts, and current project state.
  - Add `LICENSE` and remove placeholder credits.
  - Done when docs no longer reference missing files or placeholder values.
