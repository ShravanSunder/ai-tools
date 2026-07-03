# Structure And Progressive Disclosure

Mission / stance:
Keep `SKILL.md` as the workflow spine and push branch-only depth behind clear
context pointers.

When to use:
- `SKILL.md` is becoming a manual, link table, too branchy, or too thin.
- A rule appears in several references.
- It is unclear whether a piece of guidance is all-branch or branch-only.

What to inspect:
- draft outline
- branch candidates
- shared state and repeated rules
- reference candidates
- proof expectations
- placement-audit notes

How to inspect:
Separate steps from reference. Put ordered main-path behavior and all-branch
rules in `SKILL.md`. Move branch-only definitions, examples, rubrics, and
checklists into one-level `references/` files linked directly from `SKILL.md`.
Keep concepts co-located.

Good signals:
- one obvious `SKILL.md` path to run first
- each reference exists because only some runs need its depth
- all-branch rules are not repeated in branch files
- context pointers are observable enough to fire reliably

Bad signals:
- `SKILL.md` is just a filename list
- every reference repeats the same carry/return/completion wrapper
- source/provenance notes appear in normal editing lanes
- branch files define new global obligations
