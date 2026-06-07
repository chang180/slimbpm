# Known Issues And Backlog

## P0 Documentation Work

1. Keep this `docs/` directory as the current source of truth.
2. Do not rely on outdated completion percentages from historical notes.
3. Update `03-module-status.md` whenever a module changes status.
4. Track progress against `07-roadmap.md`.

## P1 Phase 3.5 MVP (Current)

| Item | Notes |
|------|-------|
| Department org scoping | `DepartmentController` web routes — see plan 3.5A |
| Module Yellow → Green | Quality Gate verification per module — see plan 3.5B |
| Demo residue | FormBuilder localStorage demo; Forms Submit draft `console.log` — see plan 3.5C |
| Flaky test | `UserManagementUITest` `can search users` — see plan 3.5D |
| Staging trial | Manual smoke on staging per `08-deployment.md` — see plan 3.5E |

Task plan: [`.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md`](../.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md)

## Resolved (Phase 1–3)

The following were active blockers and are now complete. Details in [`.ai-dev/archived/`](../.ai-dev/archived/README.md):

- Frontend TypeScript errors (176 → 0, Phase 2E)
- Organization broken `@/lib/route.ts` links (Phase 3A)
- Organization scoping and persistence (Phase 1D)
- Reports export and date filters (Phase 2D/3E)
- Notifications mark-read tests (Phase 3D)
- Deployment documentation (Phase 3G)
- Browser smoke tests (Phase 3H)
- Users/Departments AppLayout (Phase 3B)

## P3 Browser E2E

**Done (Phase 3H).** See `tests/Browser/SmokeTest.php` and `docs/06-development-workflow.md`.

Current testing strategy: Feature + Inertia endpoint tests, plus browser smoke for JS-heavy UI checks.

## Documentation Debt

Medium priority:

- Add a route map once route name collisions are cleaned up.
- Expand architecture doc if multi-tenancy grows beyond user-based org scoping.
