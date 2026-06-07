# Development Roadmap

Last updated: 2026-06-07

Phase 1–3 task plans are archived under [`.ai-dev/archived/`](../.ai-dev/archived/). Phase 3.5 progress log: [`.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md`](../.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md).

## Guiding Principle

Finish frontend integration and org-scoped persistence before adding new features. A module is not done until the UI, backend persistence, org scoping, focused tests, and relevant TypeScript checks all pass.

## Phase 0 — Documentation (Complete)

- [x] Create canonical `docs/` library
- [x] Audit module status against code and tests
- [x] Rewrite root `README.md` to stop overstating completion
- [x] Trim `.ai-dev/` to handoff + tasks + archived
- [x] Publish this roadmap

## Phase 1 — Frontend Blockers (Complete)

Phases 1A–1D — **complete 2026-06-06.** Details: [`.ai-dev/archived/`](../.ai-dev/archived/README.md)

## Phase 2 — Module Hardening (Complete)

Phases 2A–2E — **complete 2026-06-06.** Details: [`.ai-dev/archived/`](../.ai-dev/archived/README.md)

## Phase 3 — Quality And Release Prep (Complete)

Phases 3A–3H — **complete 2026-06-06.** 258 tests · TS 0 · deployment guide · browser smoke.

Details: [`.ai-dev/archived/`](../.ai-dev/archived/README.md)

## Phase 3.5 — MVP Convergence (Nearly Complete)

Goal: reach MVP launch readiness without new product features.

Task plan: [`.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md`](../.ai-dev/tasks/phase-3.5-mvp-convergence/plan.md)

### 3.5A. Department Org Scoping ✅ (2026-06-07)

- [x] Filter `DepartmentController` by `organization_id`
- [x] Feature tests for cross-org isolation (12 tests in `DepartmentPagesTest`)

### 3.5B. Module Yellow → Green Verification ✅ (2026-06-07)

- [x] Verify each core module against Quality Gate checklist
- [x] Update `docs/03-module-status.md` — all 10 modules Green
- [x] Fix `UserController::index()` and `FormController::index()` org scoping

### 3.5C. Demo Residue Cleanup ✅ (2026-06-07)

- [x] FormBuilder: warning banner retained; `console.log` removed
- [x] Forms Submit draft: non-functional UI removed
- [x] Production-path `console.log` cleared

### 3.5D. Stabilize Flaky Test ✅ (2026-06-07)

- [x] Fix `UserManagementUITest` `can search users` with deterministic names
- [x] Verified 3 consecutive passes

### 3.5E. Staging Deployment Trial (Pending)

- [ ] Follow `docs/08-deployment.md` for staging setup
- [ ] Record manual smoke checklist in `progress.md`
- [ ] Note form designer UX as **P0 known limitation** in smoke notes (see Forms Designer UX v2 below)

**Current test baseline:** 262 passed (257 Feature/Unit + 5 Browser) · TS 0 errors

### Forms Designer UX v2 (Mandatory — Queue After 3.5E)

**Not part of 3.5 scope** but **required before product iteration / Phase 4**. Forms is Green only on a technical basis; the field designer remains a prototype.

Task plan: [`.ai-dev/tasks/forms-designer-ux-v2/plan.md`](../.ai-dev/tasks/forms-designer-ux-v2/plan.md)

- [ ] Rework `/forms/{id}/design` interaction (list/section-based builder preferred)
- [ ] Finish layout + settings panels; align with Submit/DynamicForm
- [ ] Retire or redirect `/form-builder`
- [ ] Tests + update `03-module-status.md`

## MVP Exit Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Core modules Green (or documented exceptions) | ✅ |
| 2 | No P0 org-scoping gaps | ✅ |
| 3 | No misleading demo on primary paths | ✅ |
| 4 | `php artisan test` and `npm run types` pass | ✅ 262 tests |
| 5 | Staging manual smoke checklist recorded | ⏳ 3.5E |

## Phase 4 — Product Expansion (Deferred)

Do not start until:

1. Phase 3.5 exit criterion #5 (staging trial) is complete, **and**
2. **Forms Designer UX v2** is complete (P0 — see above)

- Scheduled reports and advanced export formats
- PWA / mobile-first improvements
- Permissions / backup / export admin pages
- Additional workflow designer node types

## Suggested Execution Order

1. Phase 1A–1D — complete
2. Phase 2 module hardening — complete
3. Phase 3 quality and release prep — complete
4. Phase 3.5A–3.5D — complete
5. **Phase 3.5E staging trial** — current
6. **Forms Designer UX v2** — mandatory gate before Phase 4
7. Phase 4 product expansion — deferred

## Tracking

When completing a roadmap item:

1. Update the matching section in `docs/03-module-status.md`.
2. Remove or downgrade the blocker in `docs/04-known-issues-and-backlog.md`.
3. Update `.ai-dev/handoff.md` with short-term handoff notes (Chinese).
