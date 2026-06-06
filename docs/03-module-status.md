# Module Status

Legend:

- `Green`: mostly usable and covered.
- `Yellow`: partially implemented or needs verification.
- `Red`: visible gaps, demo behavior, or broken integration.

## Authentication And Settings

Status: Yellow

Backend Fortify/Inertia pages exist. Feature tests exist for authentication, password, profile, and 2FA flows. `npm run types` reports Wayfinder `.form()` helper typing errors in 2FA and auth components.

Known files:

- `app/Providers/FortifyServiceProvider.php`
- `resources/js/pages/auth/*`
- `resources/js/pages/settings/*`
- `resources/js/components/two-factor-*`

## Dashboard

Status: Red

Backend uses real database stats and org-scoped chart data in `DashboardController`. Frontend widgets exist, but user actions are not reliably implemented.

Major gaps:

- `useDashboardActions.ts` handlers mostly only `console.log`.
- `QuickActions.tsx` links to missing routes:
  - `/workflows/instances`
  - `/organization/permissions`
  - `/organization/backup`
  - `/organization/export`
- `WorkflowMenu.tsx` links to missing routes:
  - `/workflows/instances`
  - `/workflows/reports`
- Dashboard prop names do not match component prop names cleanly; `npm run types` reports assignment errors.

## Forms

Status: Yellow (was Red)

Phase 1B complete (2026-06-06):

- All Forms pages use Wayfinder `@/routes/forms` as `formsRoutes`.
- `Forms/Edit.tsx` added; web routes reachable without 500.
- Pages use `AppLayout` consistently.
- `/form-builder` demoted (demo banner; QuickActions links to `/forms/create`).
- `tests/Feature/FormPagesTest.php` covers index/create/show/edit/submit/results.

Remaining:

- `/form-builder` still localStorage demo (Phase 4 integration).
- Form definition editing UX may need designer integration later.

Important files:

- `resources/js/pages/Forms/*`
- `app/Http/Controllers/FormController.php`
- `tests/Feature/FormPagesTest.php`

## Workflows

Status: Yellow

Workflow templates, instances, engine, start page, show page, and monitor page have meaningful implementation and tests. Main workflow execution is better covered than many modules.

Known issues:

- Dashboard workflow quick actions are fake.
- Route name collisions affect generated `resources/js/routes/workflows/index.ts`.
- No dedicated workflow template edit page route exists beyond create/designer behavior.

Important files:

- `app/Services/Workflow/WorkflowEngine.php`
- `app/Http/Controllers/WorkflowInstanceController.php`
- `app/Http/Controllers/Api/WorkflowController.php`
- `resources/js/pages/workflows/*`
- `resources/js/components/workflow-designer.tsx`

## Reports

Status: Yellow

The `/reports/*` area is relatively strong compared to other frontend areas. Controllers use real data and recent tests cover org scoping for key pages and CSV exports.

Still verify:

- Frontend export buttons and filters.
- User activity and system stats page interactions.
- Date filtering behavior in ExportService.

Important files:

- `app/Http/Controllers/ReportsController.php`
- `app/Services/ExportService.php`
- `resources/js/pages/reports/*`
- `tests/Feature/ReportsPagesTest.php`
- `tests/Feature/ReportsExportTest.php`

## Organization

Status: Red

Organization pages exist, but this module is not production-ready.

Major gaps:

- `OrganizationController` uses `OrganizationSetting::first()` in multiple methods instead of `current_organization`.
- `updateSettings()` and `updatePreferences()` validate and return JSON but do not persist settings.
- `Organization/Reports.tsx` contains simulated chart data and hard-coded metrics.
- Several Organization pages use prop names/types that do not match shared TypeScript types.

## Users

Status: Yellow/Red

Backend controllers and tests exist. Frontend list/show/create/edit pages exist, but `npm run types` reports missing Select imports and invalid Inertia form options in create/edit pages.

## Departments

Status: Yellow

Backend and frontend pages exist. TypeScript reports JSX namespace errors in create/edit pages. Needs targeted verification.

## Invitations

Status: Yellow

Dedicated invitation management page and API exist. Dashboard invitation widget does not call the real API because it uses `useDashboardActions.ts` fake handlers.

## Notifications

Status: Yellow

Notification center and notification bell call real API endpoints. Needs focused verification for filter, mark-read, and mark-all-read behavior.
