# Project Structure

## Root

- `app/`: Laravel application code.
- `bootstrap/`: Laravel 13 bootstrap configuration.
- `config/`: Laravel configuration.
- `database/`: migrations, factories, seeders.
- `resources/js/`: React/Inertia frontend.
- `resources/css/`: Tailwind CSS entrypoint.
- `routes/`: web, API, auth, console routes.
- `tests/`: Pest tests.
- `.ai-dev/`: historical planning, handoff, scratch notes.
- `docs/`: current canonical development documentation.

## Backend Structure

Important controllers:

- `app/Http/Controllers/DashboardController.php`
- `app/Http/Controllers/FormController.php`
- `app/Http/Controllers/WorkflowInstanceController.php`
- `app/Http/Controllers/WorkflowMonitorController.php`
- `app/Http/Controllers/ReportsController.php`
- `app/Http/Controllers/OrganizationController.php`
- `app/Http/Controllers/InvitationManagementController.php`
- `app/Http/Controllers/NotificationController.php`
- `app/Http/Controllers/Api/*`

Important services:

- `app/Services/Workflow/WorkflowEngine.php`
- `app/Services/Workflow/WorkflowTemplateManager.php`
- `app/Services/ExportService.php`
- `app/Services/NotificationService.php`

Important middleware:

- `app/Http/Middleware/EnsureOrganizationAccess.php`
- `app/Http/Middleware/HandleInertiaRequests.php`

## Frontend Structure

Important directories:

- `resources/js/pages/`: Inertia page components.
- `resources/js/components/`: shared components.
- `resources/js/components/dashboard/`: dashboard widgets.
- `resources/js/routes/`: Wayfinder-generated route helpers.
- `resources/js/hooks/`: custom hooks.
- `resources/js/lib/route.ts`: small hand-written route helper. It is not complete.

Important incomplete-risk files:

- `resources/js/hooks/useDashboardActions.ts`
- `resources/js/components/dashboard/QuickActions.tsx`
- `resources/js/components/dashboard/WorkflowMenu.tsx`
- `resources/js/pages/FormBuilder.tsx`
- `resources/js/pages/Organization/Reports.tsx`
- `resources/js/pages/Organization/Settings.tsx`
- `resources/js/pages/Organization/Preferences.tsx`
- `resources/js/pages/Forms/Create.tsx`
- `resources/js/pages/Forms/Show.tsx`
- `resources/js/pages/Forms/Submit.tsx`

## Routes

Routes are split across:

- `routes/web.php`
- `routes/api.php`
- `routes/auth.php`
- `routes/settings.php`

Known issue: API and web routes share names in several modules, especially `forms.*`, `workflows.*`, and `departments.*`. This can confuse generated route helpers and tests. Prefer explicit paths in tests until route names are cleaned up.

## Tests

Tests are currently mostly Feature tests:

- `tests/Feature/*`
- `tests/Unit/*`

Recent low-cost regression tests:

- `tests/Feature/EndToEndWorkflowFeatureTest.php`
- `tests/Feature/ReportsPagesTest.php`

There is no installed Pest Browser plugin. Browser E2E is optional and not the current strategy.
