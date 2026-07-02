# Invocation And Description

Load trigger: the skill may be model-invoked, user-invoked, routed from another
skill, or has a description that is broad, process-heavy, or hard to discover.

Carry in: candidate skill type, intended users, model/user invocation need,
trigger examples, branch list, and any router entry.

## Procedure

1. Decide invocation mode.
   - Model-invoked: the agent or another skill must discover it.
   - User-invoked: the human should consciously choose it and remember it.
   - Router entry: a higher-level skill should point to it.
2. Write the description as trigger text, not workflow summary.
3. Include concrete situations, symptoms, and terms the user or repo already
   uses.
4. Keep one trigger per real branch. Collapse synonyms that describe the same
   branch.
5. Avoid description shortcuts that let the agent follow frontmatter instead of
   loading the body.
6. If another skill routes here, specify the handoff condition and expected
   branch.

## Return Artifact

```text
invocation mode:
trigger examples:
description:
router entry:
context-load / cognitive-load tradeoff:
```

Completion criterion: a future agent can decide whether to load the skill from
the description without mistaking the description for the workflow.

Source material adapted: Matt's model/user invocation tradeoff and trigger-only
description rule; Codex creator metadata constraints. Rejected: descriptions
that summarize the full body. This branch does not duplicate all-branch
workflow state from `SKILL.md`.
