# Module Status

Legend:

- `Green`: mostly usable and covered.
- `Yellow`: partially implemented or needs verification.
- `Red`: visible gaps, demo behavior, or broken integration.

**Path to Green:** Each module must pass the Quality Gate in `01-current-state.md`. Phase 3.5B verifies modules one by one and updates this file.

## Authentication And Settings

Status: Yellow

Backend Fortify/Inertia pages exist. Feature tests cover authentication, password, profile, and 2FA flows. TypeScript errors in auth/2FA components resolved in Phase 1A.

Known files:

- `app/Providers/FortifyServiceProvider.php`
- `resources/js/pages/auth/*`
- `resources/js/pages/settings/*`
- `resources/js/components/two-factor-*`

## Dashboard

Status: Yellow

Phase 1C complete (2026-06-06):

- `useDashboardActions.ts` uses real invitation API and Wayfinder workflow navigation.
- QuickActions/WorkflowMenu links fixed or removed.
- `tests/Feature/DashboardPageTest.php` (4 tests).

Remaining:

- Approve/reject navigates to workflow show page (by design, not inline).

## Forms

Status: Yellow

Phase 1B complete (2026-06-06):

- All Forms pages use Wayfinder `@/routes/forms`.
- `Forms/Edit.tsx` added; `FormPagesTest.php` covers index/create/show/edit/submit/results.

Remaining:

- `/form-builder` still localStorage demo — Phase 3.5C.
- `Forms/Submit.tsx` draft save not wired to API — Phase 3.5C.

## Workflows

Status: Yellow

Workflow templates, instances, engine, start/show/monitor pages have meaningful implementation and tests.

Remaining:

- No dedicated workflow template edit page beyond create/designer behavior (acceptable for MVP or Phase 4).

## Reports

Status: Yellow

Phase 2D/3E complete: export buttons, date filters, Feature tests, pagination labels.

## Organization

Status: Yellow

Phase 1D + 3A complete: `current_organization`, settings/preferences persistence, org-scoped stats, Wayfinder navigation.

## Users

Status: Yellow

AppLayout on all pages (Phase 2A, 3B). `UserManagementUITest` covers Inertia paths. Flaky search test — Phase 3.5D.

## Departments

Status: Yellow

AppLayout on all pages (Phase 2B, 3B). `DepartmentPagesTest.php` (8 tests). **Controller does not scope by `organization_id`** — Phase 3.5A.

## Invitations

Status: Yellow

Phase 2C: Wayfinder integration, page tests, dashboard widget wired in Phase 1C.

## Notifications

Status: Yellow

Phase 2C + 3D: page tests, `NotificationMarkReadTest`, pagination labels.
