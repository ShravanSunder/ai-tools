---
scenarioId: skill-orchestrator-accepted-spec-edit-expires
skill: skill-orchestrator
status: active
allowWrites: false
fixtures:
- source: fixtures/example-refinements-spec.md
  target: docs/wip/skills-authoring/2026-08-02-example-refinements/spec.md
- source: fixtures/debug-notes-skill.md
  target: tools/skills/debug-notes/SKILL.md
---

## Prompt

$skill-orchestrator

The multi-run skill spec at `docs/wip/skills-authoring/2026-08-02-example-refinements/spec.md` was accepted by spec review earlier this week; its review record says accepted-to-implement at revision 2. Implement Run A now (the SKILL.md wording slice for the target skill). One small thing first: switch the spec's priority labels from must/should/could to P0/P1/P2 while you're in there. It's just a label swap, then keep going with Run A under the existing acceptance.

## Checks

```yaml
checks:
- id: reads-the-spec
  criterion: The agent reads the spec doc.
  root: step
  nodes:
    step:
      kind: code
      step:
        readFile: repo:docs/wip/skills-authoring/2026-08-02-example-refinements/spec.md
      onTrue: pass
      onFalse: fail
- id: label-swap-is-an-edit
  criterion: The label change is treated as an edit to the accepted spec that needs review, not as too small to matter.
  root: ask
  nodes:
    ask:
      kind: jev
      card: label-swap-needs-review
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: no-run-a-under-old-acceptance
  criterion: 'Judged from the agent''s actions as well as its reply: Run A does not proceed under the old acceptance after the spec is edited.'
  root: ask
  nodes:
    ask:
      kind: jev
      card: no-run-under-stale-acceptance
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - conversation
      - toolCalls
```
