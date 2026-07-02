# Pruning And Maintenance

Load trigger: a skill has duplicated guidance, stale sediment, no-op prose,
sprawl, unclear ownership, or branch material repeated in several places.

Carry in: current skill files, usage evidence, proof results, source-of-truth
locations, changelog expectations, and review findings.

## Procedure

1. Find duplication: same meaning in multiple places.
2. Find sediment: old guidance kept because deletion felt risky.
3. Find sprawl: live material that belongs behind references.
4. Find no-op text: lines that do not change behavior versus model default.
5. Move branch-only detail to references; move all-branch rules back to
   `SKILL.md`.
6. Delete instead of rewriting when a line does not earn its place.
7. Retest the behavior that justified the retained wording.

## Return Artifact

```text
delete:
move to reference:
move back to SKILL.md:
retain with reason:
source of truth:
retest requirement:
```

Completion criterion: every retained line has a job, duplicated all-branch
material is removed, and required retests are named.

Source material adapted: Matt's pruning/no-op vocabulary, pstack's minimize
reader load principle, and the local SOP maintenance checklist. Rejected:
keeping stale process history in skill folders. This branch does not duplicate
all-branch workflow state from `SKILL.md`.
