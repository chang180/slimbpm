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

### 1C. Dashboard Module (Current)

- Replace `useDashboardActions.ts` `console.log` handlers with real navigation or API calls.
- Fix or remove broken links in `QuickActions.tsx` and `WorkflowMenu.tsx`.
- Wire invitation widget to existing invitation API.
- Align dashboard component prop types with controller props.

**Exit criteria:** every dashboard quick action either works or is removed from UI.

### 1D. Organization Module

- Replace `OrganizationSetting::first()` with `current_organization` in `OrganizationController`.
- Persist settings and preferences instead of validate-and-return-JSON-only.
- Replace simulated data in `Organization/Reports.tsx` with real queries or remove the page.

**Exit criteria:** settings survive page reload; org pages respect current org context.

## Phase 2 — Module Hardening

Goal: raise Yellow modules to Green with tests and manual verification.

| Module | Work |
|--------|------|
| Users | Fix Select imports and Inertia form typing in create/edit |
| Departments | Fix JSX namespace errors; verify CRUD flows |
| Invitations | Ensure dashboard and `/invitations` use the same API paths |
| Notifications | Add Feature tests for mark-read, filters, unread badge refresh |
| Workflows | Clean route naming; verify monitor cancel/suspend/resume UX |
| Reports | Verify export buttons and date filters on all `/reports/*` pages |

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
