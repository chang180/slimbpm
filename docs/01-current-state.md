# Current Development State

Last audited: 2026-06-06

## Summary

SlimBPM is a Laravel 12 + React 19 + Inertia 2 application for lightweight BPM/workflow management. The project has many backend models, controllers, API endpoints, and feature tests. However, the frontend is not consistently wired to those backend capabilities.

The previous documentation overstated completion. Treat the app as approximately 60% complete until the frontend integration blockers are resolved.

## Verified Facts

- `php artisan test` was previously reported passing with 205 tests / 970 assertions.
- Recent targeted tests pass:
  - `tests/Feature/EndToEndWorkflowFeatureTest.php`
  - `tests/Feature/ReportsPagesTest.php`
  - `tests/Feature/ReportsExportTest.php`
  - `tests/Feature/WorkflowInstanceApiTest.php`
  - `tests/Feature/WorkflowDesignerPageTest.php`
- `npm run build` passes.
- `npm run types` fails with many TypeScript errors.

## Critical Interpretation

Passing PHP tests prove many backend routes and Inertia props work. They do not prove all visible frontend interactions are usable.

Several UI surfaces are currently misleading:

- Dashboard quick actions look interactive but many handlers only `console.log`.
- Some links route to pages that do not exist.
- Some pages use a hand-written route helper that does not contain the requested route names.
- `/form-builder` is a localStorage demo, not the persisted form template system.
- Organization settings/preferences validate payloads but do not persist them.

## Current Quality Gate

Before calling a module complete, require all of:

- The visible UI action reaches a real route/API.
- The backend persists or returns real data scoped to the current organization.
- A focused Feature/Inertia test covers the path.
- `npm run types` does not fail because of the changed area.
- `php vendor/bin/pint --dirty` has been run after PHP edits.

## Current Next Priority

Build and maintain this documentation library first, then use it to drive module repair. The immediate code priorities after documentation are:

1. Fix frontend route/helper/type blockers in Forms, Dashboard, and Organization.
2. Replace dashboard fake handlers and missing links with real navigation/API calls.
3. Decide whether `/form-builder` is removed, renamed as demo, or integrated with `FormTemplate`.
4. Make organization settings/preferences use `current_organization` and persist values.
