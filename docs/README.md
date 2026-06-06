# SlimBPM Development Documentation

This directory is the canonical development documentation for the current codebase.

The older `.ai-dev/` files are kept as historical planning notes and handoff records, but many of them are stale. When the two disagree, prefer this `docs/` directory unless a newer handoff explicitly says otherwise.

## Read Order For AI Agents

1. `01-current-state.md`
2. `02-project-structure.md`
3. `03-module-status.md`
4. `04-known-issues-and-backlog.md`
5. `05-documentation-inventory.md`
6. `06-development-workflow.md`

## Current Operating Principle

Do not assume the app is close to done because older files say 90-100% complete. The current audited estimate is roughly 60% overall. Backend skeletons and tests exist for many areas, but several frontend surfaces are incomplete, demo-only, or wired to missing routes.

## Update Rule

When a feature area changes meaningfully, update the matching module section in `03-module-status.md` and any new blocker in `04-known-issues-and-backlog.md`. Keep `.ai-dev/handoff.md` for short-term handoff only.
