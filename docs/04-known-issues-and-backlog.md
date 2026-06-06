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

Current status: **38 errors** (down from 128 after Phase 1D; Phase 1 complete).

Resolved in Phase 1A:

- Wayfinder workflow route collision
- auth/2FA `.form()` helper type mismatch

Resolved in Phase 1B:

- Forms route helper naming collision and missing `route()` imports
- Forms layout/type errors in `resources/js/pages/Forms/*`

Resolved in Phase 1C:

- Dashboard props/action mismatch and fake handlers
- QuickActions union type and broken dashboard links

Resolved in Phase 1D:

- Organization scoping, persistence, camelCase stats, fake reports data

Remaining error clusters (Phase 2):

- Users create/edit Select imports and form submit → **Phase 2A** (~30 errors)
- Departments JSX namespace → Phase 2B (~4 errors)
- Misc components (app-header, DynamicForm, enhanced-select) → Phase 2C (~4 errors)

## P1 Organization Scoping And Persistence ✅ (Phase 1D complete)

See `OrganizationController.php` and updated `OrganizationManagementTest.php`.

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
