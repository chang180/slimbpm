# Module Status

Legend:

- `Green`: mostly usable and covered.
- `Yellow`: partially implemented or needs verification.
- `Red`: visible gaps, demo behavior, or broken integration.

**Path to Green:** Completed in Phase 3.5B (2026-06-07). All 10 modules are Green. See Quality Gate in `01-current-state.md`.

## Authentication And Settings

Status: Green

Phase 3.5B verified (2026-06-07):

- Fortify-backed login, logout, registration, password reset, 2FA, email verification all functional.
- Feature tests: `tests/Feature/Auth/*`, `tests/Feature/Settings/*` — all pass.
- TypeScript: 0 errors.

Known files:

- `app/Providers/FortifyServiceProvider.php`
- `resources/js/pages/auth/*`
- `resources/js/pages/settings/*`
- `resources/js/components/two-factor-*`

## Dashboard

Status: Green

Phase 1C + 3.5B verified (2026-06-07):

- `useDashboardActions.ts` uses real invitation API and Wayfinder workflow navigation.
- Org-scoped stats from `DashboardController` via `current_organization`.
- `tests/Feature/DashboardPageTest.php` (5 tests pass).

Exception (by design): approve/reject navigates to workflow show page, not inline — acceptable for MVP.

## Forms

Status: Green (technical) — **P0 UX follow-up required**

Phase 1B + 3.5B + 3.5C verified (2026-06-07). Route/persistence/org scoping pass automated checks.

- `FormController::index()` scoped to org users (`whereIn('created_by', $orgUserIds)`).
- All Forms pages use Wayfinder `@/routes/forms`.
- `/forms/{id}/design` wired to `FormDesigner` + `PUT forms.update` (2026-06-07).
- Feature tests: `tests/Feature/FormPagesTest.php`, `FormTemplateMetadataTest.php`.
- TypeScript: 0 errors.

**⚠ Mandatory follow-up — not product-ready for form authoring:**

The field designer is still the **canvas prototype** (`FormDesigner`). Usability is poor; real multi-field forms are impractical to build. This **blocks meaningful workflow E2E and staging validation** beyond “route exists.”

**Required task:** [`.ai-dev/tasks/forms-designer-ux-v2/plan.md`](../.ai-dev/tasks/forms-designer-ux-v2/plan.md) — schedule **immediately after Phase 3.5E** (before treating Forms or Phase 4 as unblocked).

Exception (documented): `/form-builder` remains a localStorage demo with a warning banner; canonical path is `/forms/create` → `/forms/{id}/design`.
Exception (documented): `Forms/Submit.tsx` no longer exposes a draft-save button — `onSave` removed.

## Workflows

Status: Green

Phase 3.5B verified (2026-06-07):

- `WorkflowInstanceController::index()` scoped by org user ids.
- `WorkflowMonitorController` scoped by org.
- Feature tests: `EndToEndWorkflowFeatureTest`, `WorkflowInstanceApiTest`, `WorkflowDesignerPageTest`, `WorkflowMonitorTest`, `WorkflowEngineTest`, `WorkflowStepApiTest`, `WorkflowTemplateApiTest` — all pass.

Exception (acceptable for MVP): No dedicated workflow template edit page beyond create/designer behavior.

## Reports

Status: Green

Phase 2D + 3E + 3.5B verified (2026-06-07):

- `ReportsController` uses `current_organization` and `orgUserIds` throughout.
- Export buttons, date filters, pagination all functional.
- Feature tests: `tests/Feature/ReportsPagesTest.php`, `tests/Feature/ReportsExportTest.php` — all pass.

## Organization

Status: Green

Phase 1D + 3A + 3.5B verified (2026-06-07):

- `OrganizationController` uses `current_organization` throughout.
- Settings and preferences persist via `organization_settings.settings` JSON column.
- Org-scoped stats via `orgUserIds` pattern.
- `DepartmentController` (web) now scopes all queries by `organization_id` (Phase 3.5A).
- Feature tests: `tests/Feature/OrganizationManagementTest.php`, `tests/Feature/OrganizationTest.php` — pass.

## Users

Status: Green

Phase 2A + 3B + 3.5B + 3.5D verified (2026-06-07):

- `UserController::index()` now scoped to `organization_id` (Phase 3.5B).
- AppLayout on all pages.
- `UserManagementUITest` — all 13 tests pass, including deterministic `can search users` (Phase 3.5D).

## Departments

Status: Green

Phase 2B + 3B + 3.5A verified (2026-06-07):

- `DepartmentController` web routes fully scoped by `organization_id`.
- `show`, `edit`, `update`, `destroy` abort 404 on cross-org access.
- Feature tests: `tests/Feature/DepartmentPagesTest.php` (12 tests, 4 new cross-org isolation tests) — all pass.

## Invitations

Status: Green

Phase 2C + 3.5B verified (2026-06-07):

- `InvitationManagementController::index()` scoped by `user->organization_id`.
- Dashboard widget wired in Phase 1C.
- Feature tests: `tests/Feature/InvitationsPageTest.php`, `tests/Feature/InvitationApiTest.php` — pass.

## Notifications

Status: Green

Phase 2C + 3D + 3.5B verified (2026-06-07):

- `NotificationController::index()` scoped to `user_id` (personal notifications — correct scope).
- Page tests, `NotificationMarkReadTest`, pagination labels all functional.
- Feature tests: `tests/Feature/NotificationsPageTest.php`, `tests/Feature/NotificationMarkReadTest.php` — pass.
