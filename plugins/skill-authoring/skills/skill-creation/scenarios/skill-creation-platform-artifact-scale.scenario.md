---
scenarioId: skill-creation-platform-artifact-scale
skill: skill-creation
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-platform-artifact-scale` (regex form, retired 2026-10-06).

## Prompt

$skill-creation

I want to update the existing `docs-maintain` skill wording and it is shared by Codex and Claude. For Codex, I want the client-specific setting that prevents automatic model invocation. Show me the workflow and proof path. Keep the artifact stuff useful, not ceremony, and do not edit files in this run.

## Checks

```yaml
checks:
- id: opens-platform-mechanics
  criterion: The agent opens the platform-mechanics reference that owns client-specific invocation controls.
  root: step
  nodes:
    step:
      kind: code
      step:
        readFile: skill:references/platform-mechanics.md
      onTrue: pass
      onFalse: fail
- id: no-file-writes
  criterion: The agent attempts no file write in this design pass.
  root: step
  nodes:
    step:
      kind: code
      step:
        noWritesAttempted: {}
      onTrue: pass
      onFalse: fail
- id: codex-control-in-agent-metadata
  criterion: The Codex setting that stops automatic invocation goes in the skill's agents/openai.yaml policy, not in shared SKILL.md frontmatter.
  root: ask
  nodes:
    ask:
      kind: jev
      card: codex-control-in-agent-metadata
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: static-validation-is-structural
  criterion: The reply says platform validation proves structure only, and behavior needs a pressure scenario or a named proof gap.
  root: ask
  nodes:
    ask:
      kind: jev
      card: static-validation-is-structural
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: no-cache-refresh-as-proof
  criterion: The reply does not use an installed-cache refresh as proof.
  root: ask
  nodes:
    ask:
      kind: jev
      card: no-cache-refresh-as-proof
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
