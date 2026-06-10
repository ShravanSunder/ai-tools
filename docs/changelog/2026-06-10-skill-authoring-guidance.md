# 2026-06-10 Skill Authoring Guidance

## Summary

Preserved skill-writing discipline in `AGENTS.md` so future plugin work keeps
skills concise, trigger-driven, progressively disclosed, and pressure-tested
before rollout.

## Changes

- Added guidance that skills encode judgment and house style, not just steps.
- Made `superpowers:writing-skills` the explicit reference workflow for
  creating, editing, auditing, or pressure-testing skills.
- Clarified that substantial behavior-changing skills should preserve intent:
  the judgment to apply, failure mode to prevent, and shortcut to resist.
- Documented trigger-only frontmatter descriptions and searchable skill names.
- Added the pressure-scenario loop for skill changes:
  fail without skill, patch the smallest wording, retest, and close loopholes.
- Clarified when to use `references/`, `scripts/`, and cross-skill references.
- Refined `agents.md` changelog expectations so plugin changes use `docs/changelog/` as durable public-safe release memory, not just chat or commit notes.

## Validation

- `git diff --check`
