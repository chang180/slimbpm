# Known Issues And Backlog

## P0 Documentation Work

1. Keep this `docs/` directory as the current source of truth.
2. Do not rely on outdated completion percentages from historical notes.
3. Update `03-module-status.md` whenever a module changes status.
4. Track progress against `07-roadmap.md`.

## P1 Frontend Typecheck

Command:

```bash
npm run types
```

Current status: **128 errors** (down from 164 after Phase 1B; 131 after Phase 1C).

Resolved in Phase 1A:

- Wayfinder workflow route collision
- auth/2FA `.form()` helper type mismatch

Resolved in Phase 1B:

- Forms route helper naming collision and missing `route()` imports
- Forms layout/type errors in `resources/js/pages/Forms/*`

Resolved in Phase 1C:

- Dashboard props/action mismatch and fake handlers
- QuickActions union type and broken dashboard links

Remaining error clusters (Phase 1D / Phase 2):

- Organization prop/type mismatches and layout props → **Phase 1D**
- Users create/edit missing Select imports → Phase 2
- Departments JSX namespace → Phase 2

## P1 Route Naming ✅ (Phase 1A complete)

Web `forms.*` / `workflows.*` and API `api.forms.*` / `api.workflows.*` are now separated. Wayfinder web routes point to Inertia controllers.

## P1 Forms Integration ✅ (Phase 1B complete)

Forms pages wired to Wayfinder; `Forms/Edit.tsx` added; `FormPagesTest.php` covers web paths.

## P1 Dashboard Real Actions ✅ (Phase 1C complete)

`useDashboardActions.ts` uses invitation API and Wayfinder navigation. See `DashboardPageTest.php`.

## P1 Organization Scoping And Persistence

Required work:

- Use `current_organization` from `org.access`.
- Stop using `OrganizationSetting::first()` for org pages.
- Persist settings/preferences into `organization_settings.settings` or a defined schema.
- Replace simulated organization report data with real queries or remove the page.

## P2 Reports Verification

Required work:

- Verify export buttons submit correctly from all report pages.
- Add tests for user activity/system stats Inertia props.
- Add filter/date range tests if filters are retained.

## P2 Notifications Verification

Required work:

- Add Feature/Inertia tests for notification center page props.
- Verify API mark-read and mark-all-read in frontend.
- Confirm unread badge refresh behavior.

## P3 Browser E2E

Not current priority.

Pest Browser requires dependency changes:

```bash
composer require pestphp/pest-plugin-browser --dev
npm install playwright@latest
npx playwright install
```

Current testing strategy is low-cost Laravel Feature + Inertia endpoint tests.
