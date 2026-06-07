# Known Issues And Backlog

## P0 Documentation Work

1. Keep this `docs/` directory as the current source of truth.
2. Do not rely on outdated completion percentages from historical notes.
3. Update `03-module-status.md` whenever a module changes status.
4. Track progress against `07-roadmap.md`.

## P1 Staging Trial (Phase 3.5E — Current Blocker)

| Item | Notes |
|------|-------|
| Staging deployment trial | Follow `docs/08-deployment.md` to provision staging. Record manual smoke checklist in `.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md`. |

**Smoke checklist (pending):** login · dashboard · create form · start workflow · approve step · reports index

Phase 3.5 cannot be marked fully complete until this checklist is recorded.

## Resolved (Phase 3.5A–D, 2026-06-07)

- Department org scoping — `DepartmentController` + 4 cross-org tests in `DepartmentPagesTest`
- Module Yellow → Green — all 10 modules Green in `03-module-status.md`
- Demo residue — `console.log` removed; Submit draft UI removed; FormBuilder banner retained
- Flaky test — `UserManagementUITest can search users` uses deterministic names
- User/Form index org scoping — `UserController::index()`, `FormController::index()`

Details: [`.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md`](../.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md)

## Resolved (Phase 1–3)

Details in [`.ai-dev/archived/`](../.ai-dev/archived/README.md): TS errors, org routes, persistence, reports, notifications, browser smoke, layout polish, etc.

## Accepted MVP Exceptions

Documented in `03-module-status.md` — not blockers:

- `/form-builder` localStorage demo with warning banner
- No dedicated workflow template edit page
- Dashboard approve/reject navigates to workflow show

## P3 Browser E2E

**Done (Phase 3H).** See `tests/Browser/SmokeTest.php` and `docs/06-development-workflow.md`.

## Documentation Debt

Medium priority:

- Add a route map once route name collisions are cleaned up.
- Expand architecture doc if multi-tenancy grows beyond user-based org scoping.
