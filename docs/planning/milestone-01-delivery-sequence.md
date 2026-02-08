# Milestone 1 Delivery Sequence

## Branching Strategy

- Keep `main` deployable at all times.
- Use one feature branch per feature: `codex/f01-quality-gates`, `codex/f02-domain-types`, etc.
- Merge order should follow dependency order listed below.

## Dependency Order

1. F01 - Quality Gate Setup
2. F02 - Domain Types and Seed Data
3. F03 - Simulation Engine Core
4. F04 - Market Strip and Session Timer UI
5. F05 - Trade Ticket and Execution Flow
6. F06 - Portfolio and P&L Panel
7. F07 - Test Coverage for Slice
8. F08 - Docs and Repo Hygiene

## PR Requirements Per Feature

- Link one GitHub issue from `docs/planning/milestone-01-issue-drafts.md`.
- Include a short before/after behavior summary.
- Include command output summary for:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
- Include screenshot or short clip for UI-facing changes.

## Milestone Review Gate

Before milestone close, run this final checklist:

1. Verify all F01 to F08 issues are closed.
2. Verify scripts pass on latest `main`.
3. Run one manual session and record observed behavior.
4. Confirm README and AGENTS expectations are aligned with actual scripts and structure.
