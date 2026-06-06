# Current Development State

Last audited: 2026-06-06

## Summary

SlimBPM is a Laravel 13 + React 19 + Inertia 3 application for lightweight BPM/workflow management. The project has many backend models, controllers, API endpoints, and feature tests. However, the frontend is not consistently wired to those backend capabilities.

The previous documentation overstated completion. Treat the app as approximately 60% overall. Phase 1–3 quality/release prep is complete (253 tests, TS 0 errors, deployment guide published); product expansion remains in Phase 4.

## Verified Facts

- `php artisan test` passes with 253 tests / 1420 assertions after Phase 3 completion.
- Recent targeted tests pass:
  - `tests/Feature/EndToEndWorkflowFeatureTest.php`
  - `tests/Feature/ReportsPagesTest.php`
  - `tests/Feature/ReportsExportTest.php`
  - `tests/Feature/WorkflowInstanceApiTest.php`
  - `tests/Feature/WorkflowDesignerPageTest.php`
- `npm run build` passes.
- `npm run build:ssr` passes.
- `composer validate --strict` passes.
- `php vendor/bin/pint --dirty` passes.
- `npm audit --audit-level=moderate` reports 0 vulnerabilities.
- `npm run types` passes with 0 TypeScript errors (Phase 2E complete).
- Composer and npm dependencies were upgraded on 2026-06-06:
  - `laravel/framework` 13.14.0
  - `laravel/boost` 2.4.9
  - `laravel/tinker` 3.0.2
  - `inertiajs/inertia-laravel` 3.1.0
  - `@inertiajs/react` 3.3.1
  - `@inertiajs/vite` 3.3.1
  - `pestphp/pest` 4.7.2
  - `phpunit/phpunit` 12.5.28
- Remaining `npm outdated --depth=0` entries are major-version jumps outside the current semver constraints, plus platform-specific optional packages that are not installed on Windows.
- Laravel 13 upgrade review:
  - No direct matches were found for old CSRF middleware references, old queue event properties, old pagination view names, `array_first`, or `array_last`.
  - `config/cache.php` explicitly sets `serializable_classes` to `false`.
- Inertia 3 upgrade review:
  - `config/inertia.php` was republished from Inertia Laravel 3.
  - `<title inertia>` was changed to `<title data-inertia>`.
  - `resources/js/app.tsx` and `resources/js/ssr.tsx` now use a typed `resolvePage` helper compatible with Inertia React 3.
  - No direct usage was found for the scanned v3 breaking points: Axios imports from Inertia, `router.cancel()`, old `invalid` / `exception` events, `Inertia::lazy()`, old Inertia testing traits, or React arrow-function layout assignments.

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

Phases 0–3 are complete. See `07-roadmap.md` Phase 4 for product expansion, or address known follow-ups:

1. Department org scoping on web routes.
2. Stabilize flaky `UserManagementUITest` search assertion.
3. Optional Pest Browser smoke (Phase 3H, requires dependency approval).
4. Staging deployment trial using `08-deployment.md`.
