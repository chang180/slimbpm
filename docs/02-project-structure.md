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
- `.ai-dev/`: handoff, active tasks, archived phase plans.
- `docs/`: current canonical development documentation.

## Backend Structure

Important controllers:

- `app/Http/Controllers/DashboardController.php`
- `app/Http/Controllers/FormController.php`
- `app/Http/Controllers/DepartmentController.php` — web routes scoped by `organization_id` (Phase 3.5A)
- `app/Http/Controllers/UserController.php` — `index()` scoped by `organization_id` (Phase 3.5B)
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

## Accepted MVP demo (Phase 3.5C)

- `resources/js/pages/FormBuilder.tsx` — localStorage demo with warning banner; primary form flow uses `/forms/create`

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
- `tests/Browser/SmokeTest.php` — Pest Browser smoke (Phase 3H)

Pest Browser is installed. Browser tests require `npm run build` before running `php artisan test tests/Browser`.

## Architecture Notes

### Organization Scoping

`workflow_templates`, `workflow_instances`, and `form_templates` do **not** have an `organization_id` column. Filter through users instead:

```php
$orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

WorkflowInstance::whereIn('started_by', $orgUserIds);
WorkflowTemplate::whereIn('created_by', $orgUserIds);
FormTemplate::whereIn('created_by', $orgUserIds);
FormSubmission::whereIn('submitted_by', $orgUserIds);
```

Controllers that need org context should read `$request->get('current_organization')`, injected by the `org.access` middleware.

### WorkflowInstance Status Values

The database CHECK constraint allows only: `running`, `completed`, `cancelled`, `suspended`. There is no `pending` status.

### Laravel Paginator JSON Shape

Paginator props are flat, not nested under `meta`:

- Use `instances.total`, not `instances.meta.total`
- Use `instances.current_page`, not `instances.meta.current_page`

### Wayfinder And Route Name Collisions

If API and web controllers share route names, Wayfinder may emit duplicate exports and TypeScript errors. Do not edit generated Wayfinder files as a long-term fix; resolve naming or imports at the route level.

In Feature tests, `route('forms.show')` and `route('workflows.index')` may resolve to API routes. Prefer explicit paths such as `/forms/{id}` and `/workflows`.

### Frontend Route Helper

`resources/js/lib/route.ts` is a small hand-written helper for a few auth/dashboard routes. It does not define `forms.*`, `organization.*`, or most module routes. Use Wayfinder-generated helpers or explicit paths instead.

### WorkflowHistory Timestamp

Use `performed_at`, not `created_at`.

### Authentication

The app uses Laravel Fortify for web authentication. There is no Laravel Sanctum dependency in `composer.json`; API routes rely on session/auth middleware, not bearer tokens.
