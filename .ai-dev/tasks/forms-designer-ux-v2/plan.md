# Forms Designer UX v2 — Mandatory Follow-up

Last updated: 2026-06-07

**Status:** Not started — **must be scheduled immediately after Phase 3.5E** (or in parallel with staging smoke if design UX is in the smoke path).

## Why This Exists

Phase 3.5 marked **Forms** as Green on a **technical** basis (routes, persistence, org scoping, tests). The field designer (`FormDesigner` + `/forms/{id}/design`) is still the **canvas-based prototype** from `/form-builder`. It is wired to the API but **not usable enough** for real form authoring or for downstream workflow / E2E validation.

**Do not treat Forms module as product-ready until this task is complete.**

## Problem Summary

| Issue | Current state |
|-------|----------------|
| Interaction model | Absolute x/y canvas drag — feels like a demo, not a form builder |
| `/form-builder` | localStorage demo still exists (banner only) |
| Layout tab | Stub — no real section/field ordering UI |
| Design vs Submit | Preview/submit UX may diverge from what users design |
| Blocking | Creating meaningful forms for workflow smoke / production use is impractical |

## Goal

Deliver a **production-grade form field designer** on `/forms/{id}/design` so users can reliably define fields, settings, and layout — and submitted forms match the design.

## Suggested Scope (executor refines)

1. **Replace or rework** `FormDesigner` UX (prefer vertical list / section-based builder over free canvas unless canvas is fully finished).
2. **Implement layout** — sections, field order, add/remove/reorder.
3. **Complete settings panel** — align with `FormDefinition.settings` used by `DynamicForm` / `Submit`.
4. **Retire or hard-redirect** `/form-builder` once `/forms/{id}/design` is the canonical path.
5. **Tests** — Feature tests for design save; optional Browser test for add-field → save → submit happy path.
6. **Docs** — update `docs/03-module-status.md` Forms section when UX gate is met.

## Out of Scope (unless explicitly added)

- New field types beyond existing `FieldType` set
- Conditional logic builder (can be Phase 4+)
- Form versioning / publish workflow

## Dependencies

- Phase 3.5A–D complete ✅
- `/forms/{id}/design` route + `FormController::design()` exist (minimal wiring done 2026-06-07)
- Phase 3.5E staging smoke should **record designer UX as known limitation** until this task ships

## Exit Criteria

- [ ] A non-developer can create a multi-field form without confusion (manual sign-off)
- [ ] Design → Submit preview matches persisted definition
- [ ] `/form-builder` no longer needed on primary paths (redirect or remove)
- [ ] `FormPagesTest` (+ optional Browser) covers design save path
- [ ] `docs/03-module-status.md` and backlog entry closed

## Before Starting

1. [`docs/03-module-status.md`](../../../docs/03-module-status.md) — Forms exceptions
2. [`docs/04-known-issues-and-backlog.md`](../../../docs/04-known-issues-and-backlog.md) — P0 entry
3. Skim `resources/js/components/FormDesigner.tsx`, `Forms/Design.tsx`, `DynamicForm.tsx`

## Progress

Executor fills [`progress.md`](./progress.md) when work begins.
