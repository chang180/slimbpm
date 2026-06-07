# Development Roadmap

Last updated: 2026-06-07

This roadmap reflects the audited ~60% completion state after Phase 3. Phase 1–3 task plans are archived under [`.ai-dev/archived/`](../.ai-dev/archived/).

## Guiding Principle

Finish frontend integration and org-scoped persistence before adding new features. A module is not done until the UI, backend persistence, org scoping, focused tests, and relevant TypeScript checks all pass.

## Phase 0 — Documentation (Complete)

- [x] Create canonical `docs/` library
- [x] Audit module status against code and tests
- [x] Rewrite root `README.md` to stop overstating completion
- [x] Trim `.ai-dev/` to handoff + tasks + archived
- [x] Publish this roadmap

## Phase 1 — Frontend Blockers (Complete)

Goal: make the highest-risk areas usable without dead links, demo handlers, or missing pages.

Phases 1A–1D (TypeScript baseline, Forms, Dashboard, Organization) — **complete 2026-06-06.**

Details: [`.ai-dev/archived/`](../.ai-dev/archived/README.md)

## Phase 2 — Module Hardening (Complete)

Goal: fix TypeScript errors and harden module pages with tests.

Phases 2A–2E (Users, Departments, Invitations/Notifications, Workflows/Reports, misc TS → 0) — **complete 2026-06-06.**

Details: [`.ai-dev/archived/`](../.ai-dev/archived/README.md)

## Phase 3 — Quality And Release Prep (Complete)

Goal: regression coverage, UX polish, deployment readiness, optional browser smoke.

Phases 3A–3H — **complete 2026-06-06.**

| Item | Summary |
|------|---------|
| 3A–3E | Wayfinder org pages, AppLayout, department/notification/report regression tests |
| 3F | Responsive review — DashboardHeader, WorkflowMenu, Forms/Show |
| 3G | `docs/08-deployment.md` |
| 3H | Pest Browser smoke — `tests/Browser/SmokeTest.php` |

**Result:** 258 tests (253 Feature/Unit + 5 Browser) · TS 0 errors · deployment guide published.

Details: [`.ai-dev/archived/`](../.ai-dev/archived/README.md)

## Phase 3.5 — MVP Convergence (Current)

Goal: reach MVP launch readiness without new product features. All core modules should meet the Quality Gate in `01-current-state.md`.

Task plan: [`.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md`](../.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md)

### 3.5A. Department Org Scoping

- [ ] Filter `DepartmentController` by `organization_id`
- [ ] Feature test for cross-org isolation

### 3.5B. Module Yellow → Green Verification

- [ ] Verify each core module against Quality Gate checklist
- [ ] Update `docs/03-module-status.md` to Green or document exceptions

### 3.5C. Demo Residue Cleanup

- [ ] FormBuilder: integrate or demote further
- [ ] Forms Submit draft: wire API or remove misleading UI
- [ ] Remove production-path `console.log` where applicable

### 3.5D. Stabilize Flaky Test

- [ ] Fix `UserManagementUITest` `can search users` flakiness
- [ ] Verify 3 consecutive passes

### 3.5E. Staging Deployment Trial

- [ ] Follow `docs/08-deployment.md` for staging setup
- [ ] Record manual smoke checklist in progress.md

## MVP Exit Criteria

Phase 3.5 is complete when all of the following are true:

1. Core modules in `03-module-status.md` are Green (or have documented, accepted exceptions).
2. No P0 org-scoping gaps remain (Department scoping done).
3. No misleading demo surfaces on primary user paths.
4. `php artisan test` and `npm run types` still pass.
5. Staging manual smoke checklist completed and recorded.

## Phase 4 — Product Expansion (Deferred)

Do not start until Phase 3.5 MVP exit criteria are met.

- Scheduled reports and advanced export formats
- PWA / mobile-first improvements
- Permissions / backup / export admin pages (removed from dashboard in Phase 1C; deferred here)
- Additional workflow designer node types from original specs

## Suggested Execution Order

1. Phase 1A–1D — complete
2. Phase 2 module hardening — complete
3. Phase 3 quality and release prep — complete
4. **Phase 3.5 MVP convergence** — current
5. Phase 4 product expansion — deferred

## Tracking

When completing a roadmap item:

1. Update the matching section in `docs/03-module-status.md`.
2. Remove or downgrade the blocker in `docs/04-known-issues-and-backlog.md`.
3. Update `.ai-dev/handoff.md` with short-term handoff notes (Chinese).
