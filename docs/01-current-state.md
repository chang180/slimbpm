# Current Development State

Last audited: 2026-06-07

## Summary

SlimBPM is a Laravel 13 + React 19 + Inertia 3 application for lightweight BPM/workflow management. The project has many backend models, controllers, API endpoints, and feature tests.

Phase 0–3 (documentation, frontend blockers, module hardening, quality/release prep) is complete. Treat the app as approximately **60% overall**. All eight tracked modules remain Yellow; Phase 3.5 MVP convergence is the current priority before Phase 4 product expansion.

## Verified Facts

- `php artisan test` passes with **258 tests / 1436 assertions** (253 Feature/Unit + 5 Browser).
- Recent targeted tests pass:
  - `tests/Feature/EndToEndWorkflowFeatureTest.php`
  - `tests/Feature/ReportsPagesTest.php`
  - `tests/Feature/ReportsExportTest.php`
  - `tests/Feature/WorkflowInstanceApiTest.php`
  - `tests/Feature/WorkflowDesignerPageTest.php`
  - `tests/Browser/SmokeTest.php`
- `npm run build` passes.
- `npm run build:ssr` passes.
- `composer validate --strict` passes.
- `npm run types` passes with 0 TypeScript errors.
- Stack (2026-06-06 upgrade): Laravel 13.14.0, Inertia Laravel 3.1.0, `@inertiajs/react` 3.3.1, Pest 4.7.2, PHP 8.4.12.

## Critical Interpretation

Passing PHP tests prove many backend routes and Inertia props work. They do not prove every module meets MVP readiness.

Remaining gaps that affect user trust:

- `/form-builder` is a localStorage demo, not the persisted form template system.
- `Forms/Submit.tsx` draft save logs to console instead of persisting.
- `DepartmentController` web routes do not filter by `organization_id` yet.
- No module in `03-module-status.md` is Green; Phase 2's "raise Yellow to Green" goal was not fully achieved.
- `UserManagementUITest` can flake on `can search users`.

Resolved in Phase 1–3 (no longer accurate to claim):

- Dashboard quick actions using fake `console.log` handlers — wired in Phase 1C.
- Organization settings/preferences not persisting — fixed in Phase 1D.
- Organization pages using broken `@/lib/route.ts` links — migrated to Wayfinder in Phase 3A.

## Current Quality Gate

Before calling a module complete, require all of:

- The visible UI action reaches a real route/API.
- The backend persists or returns real data scoped to the current organization.
- A focused Feature/Inertia test covers the path.
- `npm run types` does not fail because of the changed area.
- `php vendor/bin/pint --dirty` has been run after PHP edits.

## Current Next Priority

**Phase 3.5 — MVP Convergence.** See `07-roadmap.md` and `.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md`.

Ordered focus:

1. Department org scoping on web routes (3.5A).
2. Stabilize flaky `UserManagementUITest` (3.5D).
3. Demo residue cleanup — FormBuilder, Submit draft (3.5C).
4. Module Yellow → Green verification (3.5B).
5. Staging deployment trial using `08-deployment.md` (3.5E).

Phase 4 product expansion is deferred until MVP exit criteria are met.
