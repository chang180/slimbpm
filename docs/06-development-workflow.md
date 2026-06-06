# Development Workflow

## Before Editing

1. Read `docs/01-current-state.md`.
2. Read the relevant module section in `docs/03-module-status.md`.
3. Check `docs/04-known-issues-and-backlog.md` for known blockers.
4. Inspect the actual code before making assumptions.

## Laravel Rules

- Use Laravel conventions and existing app structure.
- Use Form Request classes for new controller validation.
- Prefer Eloquent relationships and org-scoped queries.
- Do not use `env()` outside config.
- Run `php vendor/bin/pint --dirty` after PHP edits on Windows.

## Testing Strategy

Current strategy: low-cost Feature/Inertia regression tests.

Use:

```bash
php artisan test tests/Feature/SpecificTest.php
```

For frontend validation:

```bash
npm run types
npm run build
```

Important: `npm run build` can pass while `npm run types` fails.

## Coordinator Task Workflow

For phased development, see `.ai-dev/tasks/`:

1. Coordinator writes `plan.md` for each phase.
2. Executor AI implements and fills `progress.md`.
3. Coordinator reviews against exit criteria in the plan.
4. Update `docs/03-module-status.md` and `.ai-dev/handoff.md` after acceptance.

Current active tasks: `.ai-dev/tasks/INDEX.md` (Phase 3A–3G)

## Documentation Updates

After meaningful changes:

- Update `docs/03-module-status.md` if module completion changes.
- Update `docs/04-known-issues-and-backlog.md` if blockers are added/resolved.
- Update `docs/07-roadmap.md` checkboxes when phase items complete.
- Update `.ai-dev/handoff.md` with short-term handoff notes (Chinese).

## Commit Guidance

Keep documentation commits separate from feature repair commits when possible.

Suggested commit messages:

- `Add AI-first development documentation`
- `Fix forms frontend routing`
- `Wire dashboard quick actions to real routes`
- `Persist organization settings`

## Current Do-Not-Do List

- Do not add Playwright/Pest Browser dependencies unless explicitly approved.
- Do not call modules 100% complete based only on backend tests.
- Do not use `resources/js/lib/route.ts` for routes it does not define.
- Do not edit generated Wayfinder route files as a long-term fix; fix route naming or imports instead.
