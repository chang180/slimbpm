# Known Issues And Backlog

## P0 Documentation Work

1. Keep this `docs/` directory as the current source of truth.
2. Do not rely on outdated completion percentages from historical notes.
3. Update `03-module-status.md` whenever a module changes status.
4. Track progress against `07-roadmap.md`.

## P1 Frontend Typecheck ✅ (Phase 2E complete)

Command:

```bash
npm run types
```

Current status: **0 errors** (176 → 0 across Phase 1–2).

Resolved in Phase 2:

- Users create/edit Select and form typing (2A)
- Departments JSX namespace (2B)
- Invitations paginator types (2C)
- Workflows Monitor + Reports Index (2D)
- app-header, DynamicForm, enhanced-select (2E)

## P2 Department Org Scoping

`DepartmentController` web routes do not filter by `organization_id` yet. Documented in Phase 3C progress; add scoping in a future phase if required.

## P1 Organization Frontend Routes ✅ (Phase 3A complete)

Organization pages previously called `route('organization.*')` via `@/lib/route.ts`, which returned `#`. Migrated to Wayfinder in Phase 3A.

## P1 Organization Scoping And Persistence ✅ (Phase 1D complete)

See `OrganizationController.php` and updated `OrganizationManagementTest.php`.

## P2 Reports Verification ✅ (Phase 2D partial)

Completed:

- Reports Index export buttons wired to POST routes.
- UserActivity and SystemStats Inertia page tests added.

Remaining (Phase 3):

- Filter/date range tests → **Phase 3E**
- Manual verification on all `/reports/*` subpages → **Phase 3F**

## P2 Notifications Verification ✅ (Phase 2C partial)

Completed:

- InvitationsPageTest + NotificationsPageTest added.

Remaining (Phase 3):

- Verify API mark-read and mark-all-read in frontend → **Phase 3D**
- Confirm unread badge refresh behavior → **Phase 3D**

## P3 Browser E2E

Not current priority.

Pest Browser requires dependency changes:

```bash
composer require pestphp/pest-plugin-browser --dev
npm install playwright@latest
npx playwright install
```

Current testing strategy is low-cost Laravel Feature + Inertia endpoint tests.
