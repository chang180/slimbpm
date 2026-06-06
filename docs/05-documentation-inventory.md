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

## Removed Historical Documents (2026-06-06)

The following `.ai-dev/` files were deleted after their useful content was migrated into `docs/`:

- `.ai-dev/README.md` — overstated 100% phase completion
- `.ai-dev/UPDATE-2025-10-12.md` — outdated status snapshot
- `.ai-dev/development/dev-50-dashboard-refactor.md` — dashboard still has fake handlers
- `.ai-dev/development/phase7-integration-instructions.md` — testing sketch, not implemented state
- `.ai-dev/features/workflow-designer.md` — original spec, partially implemented
- `.ai-dev/scratch/project-structure.md` — superseded by `docs/02-project-structure.md`
- `.ai-dev/scratch/sparkle.md` — product concept notes only

If you need historical context, use git history.

## Documentation Debt

Medium priority:

- Add a route map once route name collisions are cleaned up.
- Expand architecture doc if multi-tenancy grows beyond user-based org scoping.

## How To Verify Claims

When reading any document:

1. Extract intent, not completion percentages.
2. Verify against code with `rg`, `php artisan route:list`, tests, and page/controller files.
3. Run `php artisan test` and `npm run types` before trusting frontend readiness claims.
