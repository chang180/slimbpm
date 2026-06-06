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

Status: Yellow (was Red)

Phase 1C complete (2026-06-06):

- `useDashboardActions.ts` uses real invitation API and Wayfinder workflow navigation.
- `dashboard.tsx` maps `on*` props correctly; `UserDashboard` receives `organizationSlug`.
- QuickActions/WorkflowMenu broken links fixed or removed.
- `tests/Feature/DashboardPageTest.php` added (4 tests).

Remaining:

- Dashboard does not inline approve/reject; navigates to workflow show page (by design).

Important files:

- `resources/js/hooks/useDashboardActions.ts`
- `resources/js/pages/dashboard.tsx`
- `resources/js/components/dashboard/*`
- `tests/Feature/DashboardPageTest.php`

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

Status: Yellow (was Red)

Phase 1D complete (2026-06-06):

- All methods use `current_organization` from `org.access`.
- Settings and preferences persist in `organization.settings` JSON.
- Stats are org-scoped with camelCase keys; `recentActivity` from real WorkflowHistory/FormSubmission.
- Organization pages use `AppLayout`; TS errors cleared.
- `Organization/Reports` shows real summary + link to `/reports` (no fake metrics).

Important files:

- `app/Http/Controllers/OrganizationController.php`
- `resources/js/pages/Organization/*`
- `tests/Feature/OrganizationManagementTest.php`

## Users

Status: Yellow

Backend controllers and tests exist. Create/edit pages fixed in Phase 2A (TS 0). Index/Show still use `AuthenticatedLayout` instead of `AppLayout`.

## Departments

Status: Yellow

Create/edit fixed in Phase 2B (TS 0). Index/Show layout polish pending.

## Invitations

Status: Yellow

Phase 2C: Wayfinder integration and page tests. Dashboard invitation widget wired in Phase 1C.

## Notifications

Status: Yellow

Phase 2C: page tests added. Mark-read UX verification deferred to Phase 3.
