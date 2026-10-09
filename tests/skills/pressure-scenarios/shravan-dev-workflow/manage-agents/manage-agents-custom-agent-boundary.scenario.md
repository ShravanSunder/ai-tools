---
scenarioId: manage-agents-custom-agent-boundary
skill: manage-agents
status: active
allowWrites: false
---

## Prompt

$manage-agents

Chat-only. I have an existing ACP command:

```bash
./bin/team-agent acp --profile review
```

Should I build a custom adapter for this? If we ever do need one, also sketch what building it involves. I want one compact answer, no extra structure.

## Checks

```yaml
checks:
- id: opens-adapter-reference
  criterion: The agent opens the adapter-building reference before sketching adapter work.
  root: step
  nodes:
    step:
      kind: code
      step:
        readFile: skill:references/building-acp-adapters.md
      onTrue: pass
      onFalse: fail
- id: no-file-writes
  criterion: The agent writes nothing in this chat-only answer.
  root: step
  nodes:
    step:
      kind: code
      step:
        noWritesAttempted: {}
      onTrue: pass
      onFalse: fail
- id: stays-compact
  criterion: The agent answers with a bounded amount of tool work.
  root: step
  nodes:
    step:
      kind: code
      step:
        toolCallCount:
          max: 25
      onTrue: pass
      onFalse: fail
- id: no-adapter-needed
  criterion: The existing ACP command needs no custom adapter; it can be called as it is.
  root: ask
  nodes:
    ask:
      kind: jev
      card: existing-command-needs-no-adapter
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: build-gate-first
  criterion: An adapter is built only after confirming why calling the existing command, a built-in, or a config-defined agent is not enough.
  root: ask
  nodes:
    ask:
      kind: jev
      card: build-gate-before-adapter
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: security-route
  criterion: Adapter-building work goes through a security or sensitive-surface review first.
  root: ask
  nodes:
    ask:
      kind: jev
      card: adapter-security-route
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
