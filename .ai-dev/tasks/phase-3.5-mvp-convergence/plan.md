# Phase 3.5 — MVP Convergence

Last updated: 2026-06-07

## Goal

Reach MVP launch readiness without adding new product features. Close the gap between "258 tests pass" and "all core modules are Green per the Quality Gate."

## Guiding Reference

- Quality Gate: [`docs/01-current-state.md`](../../../docs/01-current-state.md)
- Module checklist: [`docs/03-module-status.md`](../../../docs/03-module-status.md)
- Roadmap section: [`docs/07-roadmap.md`](../../../docs/07-roadmap.md) Phase 3.5

## Scope

### 3.5A — Department Org Scoping

- Filter `DepartmentController` web routes by `organization_id` from `current_organization`.
- Add or extend Feature test proving cross-org isolation.
- Files: `app/Http/Controllers/DepartmentController.php`, related tests.

### 3.5B — Module Yellow → Green Verification

For each core module (Forms, Workflows, Organization, Users, Departments, Reports, Invitations, Notifications, Auth/Settings, Dashboard):

1. Confirm visible UI actions reach real routes/APIs.
2. Confirm backend persistence and org scoping.
3. Confirm focused Feature/Inertia test coverage.
4. Confirm `npm run types` passes for touched areas.
5. Update status in `docs/03-module-status.md` to Green, or document a justified exception.

Dashboard approve/reject navigating to workflow show is acceptable by design.

### 3.5C — Demo Residue Cleanup

- `/form-builder`: integrate with persisted form system **or** demote further (clear banner, remove misleading entry points).
- `Forms/Submit.tsx` draft save: wire to API **or** remove/simplify the draft UI.
- Remove or justify remaining `console.log` in production paths (`FormBuilder.tsx`, `Forms/Submit.tsx`).

### 3.5D — Stabilize Flaky Test

- Fix or harden `UserManagementUITest` `can search users` assertion.
- Verify by running the test file 3 consecutive times without failure.

### 3.5E — Staging Deployment Trial

- Follow [`docs/08-deployment.md`](../../../docs/08-deployment.md) to stand up staging (or document blockers).
- Record manual smoke checklist results in `progress.md`: login, dashboard, create form, start workflow, approve, reports index.

## Out of Scope

- PWA / mobile-first overhaul
- Scheduled reports
- Permissions / backup / export admin pages (Phase 4)
- New workflow designer node types
- Major dependency upgrades

## Exit Criteria

- [x] `DepartmentController` org scoping + Feature test passing
- [x] Core modules in `03-module-status.md` are Green or have documented exceptions
- [x] FormBuilder and Submit draft no longer mislead users
- [x] `UserManagementUITest` stable across 3 consecutive runs
- [ ] Staging trial checklist recorded in `progress.md`
- [x] `php artisan test` still passes (262 tests)
- [x] `npm run types` still 0 errors
- [x] `docs/04-known-issues-and-backlog.md` and `.ai-dev/handoff.md` updated

## Before Starting

Read:

1. [`docs/01-current-state.md`](../../../docs/01-current-state.md)
2. [`docs/03-module-status.md`](../../../docs/03-module-status.md)
3. [`docs/02-project-structure.md`](../../../docs/02-project-structure.md) — org scoping notes

## Suggested Order

1. 3.5A (security baseline)
2. 3.5D (CI stability)
3. 3.5C (user-facing demo cleanup)
4. 3.5B (module-by-module verification)
5. 3.5E (staging trial — can run in parallel with 3.5B)

## Dispatch Template

```text
請依 .ai-dev/tasks/phase-3.5-mvp-convergence/plan.md 執行。
開工前先讀 docs/01-current-state.md 與 docs/03-module-status.md。
完成後填寫同目錄 progress.md，附真實指令輸出，不要自行宣稱驗收通過。
```

## Progress

Executor fills [`progress.md`](./progress.md) when work begins.
