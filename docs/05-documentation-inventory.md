# Documentation Inventory

## Canonical Documents

Use these first:

| File | Purpose |
|------|---------|
| `docs/README.md` | Entry point and read order |
| `docs/01-current-state.md` | Verified facts and quality gates |
| `docs/02-project-structure.md` | Code layout and architecture notes |
| `docs/03-module-status.md` | Per-module Red/Yellow/Green status |
| `docs/04-known-issues-and-backlog.md` | Active blockers by priority |
| `docs/07-roadmap.md` | Development plan and phases |
| `docs/06-development-workflow.md` | How AI/humans should work in this repo |
| `docs/08-deployment.md` | Staging and production deployment guide |
| `.ai-dev/handoff.md` | Short-term Chinese handoff for the human owner |

## `.ai-dev/` Layout

| Path | Purpose |
|------|---------|
| `.ai-dev/handoff.md` | Chinese handoff — current state and next steps |
| `.ai-dev/README.md` | Coordinator workflow |
| `.ai-dev/tasks/INDEX.md` | Active task index |
| `.ai-dev/tasks/phase-3.5-*/` | Current phase plan and progress |
| `.ai-dev/archived/README.md` | Index of completed Phase 1–3 task plans |
| `.ai-dev/archived/phase-*/` | Archived plan.md and progress.md |
| `.ai-dev/archived/historical/` | Pre-2026 planning snapshots (archaeology only) |

## Archived Historical Documents

The following were removed from the active tree or never migrated to `docs/`. If needed, use git history or `.ai-dev/archived/historical/`:

- `.ai-dev/UPDATE-2025-10-12.md` — outdated status snapshot
- `.ai-dev/development/dev-50-dashboard-refactor.md` — superseded by Phase 1C
- `.ai-dev/development/phase7-integration-instructions.md` — testing sketch
- `.ai-dev/features/workflow-designer.md` — original spec, partially implemented
- `.ai-dev/scratch/*` — superseded by `docs/02-project-structure.md`

## Documentation Debt

Medium priority:

- Add a route map once route name collisions are cleaned up.
- Expand architecture doc if multi-tenancy grows beyond user-based org scoping.

## How To Verify Claims

When reading any document:

1. Extract intent, not completion percentages.
2. Verify against code with `rg`, `php artisan route:list`, tests, and page/controller files.
3. Run `php artisan test` and `npm run types` before trusting frontend readiness claims.
