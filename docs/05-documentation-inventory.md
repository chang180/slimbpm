# Documentation Inventory

## Canonical Documents

Use these first:

- `docs/README.md`
- `docs/01-current-state.md`
- `docs/02-project-structure.md`
- `docs/03-module-status.md`
- `docs/04-known-issues-and-backlog.md`
- `docs/05-documentation-inventory.md`
- `docs/06-development-workflow.md`
- `.ai-dev/handoff.md` for short-term latest handoff only.

## Historical Or Stale Documents

These files contain useful context but should not be trusted for completion status:

- `README.md`
  - Still claims around 90% completion.
  - Mentions browser tests and completion levels that do not match current audit.
- `.ai-dev/README.md`
  - Claims most phases are 100%.
  - Should be treated as historical planning/status, not current truth.
- `.ai-dev/development/dev-50-dashboard-refactor.md`
  - Claims dashboard actions and TypeScript were complete.
  - Current audit shows dashboard handlers are mostly `console.log` and `npm run types` fails.
- `.ai-dev/development/phase7-integration-instructions.md`
  - Useful as a testing strategy sketch.
  - Not an accurate record of implemented tests.
- `.ai-dev/features/workflow-designer.md`
  - Useful original feature spec.
  - Some planned node types/features are not necessarily implemented.
- `.ai-dev/scratch/project-structure.md`
  - Useful high-level technology notes.
  - Not current enough for module status.
- `.ai-dev/scratch/sparkle.md`
  - Product concept and original planning notes only.

## Documentation Debt

High priority:

- Rewrite root `README.md` to stop overstating completion.
- Rewrite or archive `.ai-dev/README.md`.
- Add a route map once route name collisions are cleaned up.
- Add an architecture doc for organization scoping and multi-tenancy.

## How To Use Old Files Safely

When reading old files:

1. Extract intent and historical context.
2. Verify against code with `rg`, `php artisan route:list`, tests, and controller/page files.
3. Do not copy completion percentages or checkmarks into new docs without re-auditing.
