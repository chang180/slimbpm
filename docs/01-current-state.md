# Current Development State

Last audited: 2026-06-07

## Summary

SlimBPM is a Laravel 13 + React 19 + Inertia 3 application for lightweight BPM/workflow management.

**Phase 3.5A–D is complete.** All 10 core modules are **Green (technical)** per `03-module-status.md`. **Phase 3.5E** (staging trial) remains. **Forms Designer UX v2** is a **P0 mandatory follow-up** before Phase 4 — see `04-known-issues-and-backlog.md`.

## Verified Facts

- `php artisan test` passes with **262 tests / 1449 assertions** (257 Feature/Unit + 5 Browser).
- Up from 258 tests: 4 new department cross-org isolation tests (Phase 3.5A).
- `npm run build` and `npm run build:ssr` pass.
- `composer validate --strict` passes.
- `npm run types` passes with 0 TypeScript errors.
- Stack: Laravel 13.14.0, Inertia Laravel 3.1.0, `@inertiajs/react` 3.3.1, Pest 4.7.2, PHP 8.4.12.

## Phase 3.5 Completed Work (2026-06-07)

| Item | Summary |
|------|---------|
| 3.5A | `DepartmentController` scoped by `organization_id`; 12 tests in `DepartmentPagesTest` |
| 3.5B | All modules Green; `UserController::index()` and `FormController::index()` org scoping added |
| 3.5C | `console.log` removed; Submit draft UI removed; FormBuilder banner retained |
| 3.5D | `UserManagementUITest can search users` — deterministic names, 3 consecutive passes |

Progress log: [`.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md`](../.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md)

## Accepted MVP Exceptions

Documented in `03-module-status.md`:

- `/form-builder`: localStorage demo with warning banner — supersede with `/forms/{id}/design` after UX v2
- No dedicated workflow template edit page — designer/create flow only
- Dashboard approve/reject navigates to workflow show — by design

**P0 (not an acceptable long-term exception):** Form field designer UX — prototype canvas on `/forms/{id}/design`. Task: [`.ai-dev/tasks/forms-designer-ux-v2/plan.md`](../.ai-dev/tasks/forms-designer-ux-v2/plan.md)

## Current Quality Gate

Before calling a module complete, require all of:

- The visible UI action reaches a real route/API.
- The backend persists or returns real data scoped to the current organization.
- A focused Feature/Inertia test covers the path.
- `npm run types` does not fail because of the changed area.
- `php vendor/bin/pint --dirty` has been run after PHP edits.

## Current Next Priority

1. **Phase 3.5E** — Staging deployment trial per `08-deployment.md`; record smoke checklist in `progress.md` (note form designer UX limitation).
2. **Forms Designer UX v2 (P0)** — Rework field designer; required before meaningful E2E and Phase 4. Plan: `.ai-dev/tasks/forms-designer-ux-v2/plan.md`.
3. **Phase 4** — Product expansion (deferred until 3.5E **and** Forms Designer UX v2). See `07-roadmap.md`.
