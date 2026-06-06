# Development Roadmap

Last updated: 2026-06-06

This roadmap reflects the audited ~60% completion state after the Laravel 13 / Inertia 3 upgrade. It replaces stale phase documents that previously lived under `.ai-dev/`.

## Guiding Principle

Finish frontend integration and org-scoped persistence before adding new features. A module is not done until the UI, backend persistence, org scoping, focused tests, and relevant TypeScript checks all pass.

## Phase 0 — Documentation (Complete)

- [x] Create canonical `docs/` library
- [x] Audit module status against code and tests
- [x] Rewrite root `README.md` to stop overstating completion
- [x] Trim `.ai-dev/` to handoff-only
- [x] Publish this roadmap

## Phase 1 — Frontend Blockers (Current)

Goal: make the three highest-risk areas usable without dead links, demo handlers, or missing pages.

### 1A. TypeScript Baseline ✅ (2026-06-06)

- [x] Resolve Wayfinder route name collisions for `forms.*` and `workflows.*`
- [x] Fix Fortify/Wayfinder `.form()` helper typing in auth and 2FA pages
- [x] API routes prefixed with `api.*`; Wayfinder regenerated

**Result:** TS errors 176 → 164; 209 tests pass.

### 1B. Forms Module ✅ (2026-06-06)

- [x] Wire Forms pages to Wayfinder `@/routes/forms`
- [x] Add `Forms/Edit.tsx`
- [x] Demote `/form-builder` demo
- [x] Add `FormPagesTest.php` (8 tests)

**Result:** Forms TS errors 0; total TS 164 → 131; 217 tests pass.

### 1C. Dashboard Module ✅ (2026-06-06)

- [x] Wire dashboard actions to invitation API and Wayfinder routes
- [x] Fix prop mapping and QuickActions/WorkflowMenu links
- [x] Add `DashboardPageTest.php`

**Result:** Dashboard TS errors 0; total TS 131 → 128; 221 tests pass.

### 1D. Organization Module ✅ (2026-06-06)

- [x] Use `current_organization`; persist settings/preferences
- [x] Org-scoped camelCase stats; remove fake reports data
- [x] Update `OrganizationManagementTest.php`

**Result:** Organization TS errors 0; total TS 128 → 38; 223 tests pass.

**Phase 1 complete.**

## Phase 2 — Module Hardening (Current)

Goal: raise Yellow modules to Green with tests and manual verification.

### 2A. Users Module ✅ (2026-06-06)

- [x] Fix Select imports and Inertia form typing in create/edit
- Users TS 30 → 0；全專案 TS 38 → 9

### 2B. Departments Module ✅ (2026-06-06)

- [x] Fix JSX namespace errors; AppLayout on create/edit
- Departments TS 4 → 0；全專案 TS 9 → 5

### 2C. Invitations & Notifications ✅ (2026-06-06)

- [x] Invitations paginator types + Wayfinder API
- [x] InvitationsPageTest + NotificationsPageTest
- TS 5 → 4；tests 224 → **234**

### 2D. Workflows & Reports (Next)

- Monitor cancel/suspend/resume UX; Reports export/filters
- See `.ai-dev/tasks/phase-2d-workflows-reports/plan.md`

| Module | Work | Phase |
|--------|------|-------|
| ~~Invitations~~ | Paginator + Wayfinder + page tests | **2C** ✅ |
| ~~Notifications~~ | Inertia page smoke tests | **2C** ✅ |
| Workflows | Monitor UX verification | **2D** |
| Reports | Export buttons and date filters | **2D** |
| Misc TS | app-header, DynamicForm, enhanced-select | **2E** |
| Workflows | Verify monitor cancel/suspend/resume UX | 2D |
| Reports | Verify export buttons and date filters on all `/reports/*` pages | 2D |
| Misc TS | app-header, DynamicForm, enhanced-select | 2E |

## Phase 3 — Quality And Release Prep

- Add low-cost Feature/Inertia regression tests for repaired modules.
- Mobile/responsive review on dashboard, forms, and workflow pages.
- Production deployment guide: env vars, queue, mail, SQLite → production DB.
- Optional: Pest Browser smoke tests after explicit dependency approval.

## Phase 4 — Product Expansion (Deferred)

Do not start until Phase 1–3 exit criteria are met.

- Scheduled reports and advanced export formats
- PWA / mobile-first improvements
- Permissions/backup/export pages currently linked from dashboard but not implemented
- Additional workflow designer node types from original specs

## Suggested Execution Order

1. Phase 1A (types/route collisions) — unblocks everything else
2. Phase 1B (Forms) — highest user-visible breakage
3. Phase 1C (Dashboard) — most misleading UX
4. Phase 1D (Organization) — data integrity risk
5. Phase 2 module hardening — parallelizable by module
6. Phase 3 release prep

## Tracking

When completing a roadmap item:

1. Update the matching section in `docs/03-module-status.md`.
2. Remove or downgrade the blocker in `docs/04-known-issues-and-backlog.md`.
3. Add a short note to `.ai-dev/handoff.md` (Chinese) for the next session.
