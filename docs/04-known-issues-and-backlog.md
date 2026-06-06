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

Current status: **131 errors** (down from 164 after Phase 1B; 176 after Phase 1A).

Resolved in Phase 1A:

- Wayfinder workflow route collision
- auth/2FA `.form()` helper type mismatch

Resolved in Phase 1B:

- Forms route helper naming collision and missing `route()` imports
- Forms layout/type errors in `resources/js/pages/Forms/*`

Remaining error clusters (Phase 1C–1D / Phase 2):

- Dashboard props/action mismatch → **Phase 1C**
- Organization prop/type mismatches → Phase 1D
- Users create/edit missing Select imports → Phase 2
- Departments JSX namespace → Phase 2

## P1 Route Naming ✅ (Phase 1A complete)

Web `forms.*` / `workflows.*` and API `api.forms.*` / `api.workflows.*` are now separated. Wayfinder web routes point to Inertia controllers.

## P1 Dashboard Real Actions

Files:

- `resources/js/hooks/useDashboardActions.ts`
- `resources/js/components/dashboard/QuickActions.tsx`
- `resources/js/components/dashboard/WorkflowMenu.tsx`

Required decisions:

- Replace fake handlers with real navigation/API calls.
- Remove or implement missing routes.
- Decide whether dashboard should perform approvals inline or link to workflow detail pages.

## P1 Forms Integration

Required work:

- Create `resources/js/pages/Forms/Edit.tsx` or remove edit route/entry points.
- Stop using incomplete `resources/js/lib/route.ts` for `forms.*`.
- Prefer Wayfinder generated helpers or explicit paths consistently.
- Decide if `/form-builder` becomes the canonical form designer or is removed as demo.
- Add focused Feature/Inertia tests after repair.

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
