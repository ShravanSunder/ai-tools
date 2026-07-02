# Structure And Progressive Disclosure

Load trigger: `SKILL.md` is becoming a manual, a link table, too branchy, or too
thin to run the workflow.

Carry in: draft outline, branch candidates, shared state, repeated rules,
reference candidates, proof expectations, and placement-audit notes.

## Procedure

1. Separate steps from reference.
2. Put the ordered main path and all-branch material in `SKILL.md`.
3. Move branch-only definitions, examples, rubrics, and checklists into
   one-level `references/` files linked directly from `SKILL.md`.
4. For every context pointer, name:
   - observable load trigger
   - carry-in state
   - branch return artifact
   - completion criterion
5. Keep concepts co-located. Do not scatter one rule across the body and
   multiple references.
6. Use the placement audit to prevent duplicated all-branch material.

## Return Artifact

```text
SKILL.md main-path outline:
all-branch material retained in SKILL.md:
branch-only material moved to references:
context pointers:
placement concerns:
```

Completion criterion: `SKILL.md` can run the workflow in one scan, and every
reference exists because only some branches need its depth.

Source material adapted: Matt's information hierarchy and branch disclosure;
pstack's one entry point routing into playbooks; Codex creator progressive
disclosure. Rejected: pstack's no-planning stance and full manual dumps. This
branch does not duplicate all-branch workflow state from `SKILL.md`.
