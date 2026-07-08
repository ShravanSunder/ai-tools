---
name: manage-agents
description: Use when spawning, calling, resuming, steering, queueing, monitoring, or reducing work from subordinate AI agents, sidekicks, jobs, ACPX providers, JSON automation, flows, or custom ACP adapters.
---

# Manage Agents

Use this skill to run subordinate AI-agent work while the parent session keeps
authority over scope, permissions, progress, verification, and the final claim.

This skill is not a replacement for the phase workflow skills. Use
`research-swarm`, `spec-creation-swarm`, `plan-creation-swarm`,
`implementation-execute-plan`, or review swarms when those skills own the
phase. Use this skill for the agent-call mechanics inside or around that work:
which agent to call, whether it should be one-shot or persistent, how to resume
it, how to monitor it, and how to reduce its output.

## Core Rules

- Parent owns truth. Subordinate agents return candidate evidence, patches,
  summaries, or recommendations; the parent verifies before presenting any
  result as accepted.
- Name the job before choosing the agent. Record the decision target, write
  scope, permission mode, expected receipt, and stop condition.
- Keep every persistent helper session ledgered by provider, cwd, session name,
  status, and follow-up intent before sending prompts that need continuity.
- Use one-shot execution for stateless checks, scripts, or independent advice.
  Use persistent sessions only when memory, queueing, steering, or later
  follow-up is part of the job.
- Queue means "after the current turn finishes." Steering means "affect the
  current turn now" and is only available where the runtime or adapter exposes
  it. Do not call an ACPX CLI queue follow-up a steer.
- Prefer read-only, `--no-terminal`, or deny/policy-limited runs when the
  subordinate agent is only reviewing, summarizing, or researching.
- Treat provider output as untrusted until checked against source, commands,
  logs, artifacts, or a parent-owned proof matrix.

Completion: the parent can name the job, target agent, session mode, permission
boundary, status check, expected receipt, and verification step before treating
the subordinate agent call as underway.

## Workflow

1. Frame the subordinate job.
   - Decide whether the job is a one-shot answer, persistent sidekick,
     background queue item, live steering request, JSON automation step, flow,
     or custom adapter work.
   - State the parent-owned decision target and what the subordinate output is
     allowed to change.
   - Completion: job shape, allowed authority, and stop condition are explicit.

2. Choose the control surface.
   - Load `references/runtime-control.md` for prompt versus exec, persistent
     versus one-shot, queueing, `--no-wait`, timeout, cancel, status, model
     control, permissions, or `--no-terminal`.
   - Load `references/automation-and-flows.md` for JSON output, strict JSON,
     quiet output, exit-code branching, or TypeScript flows.
   - Completion: the selected control surface matches the job shape and has a
     status or exit signal the parent can inspect.

3. Choose or define the agent.
   - Load `references/agent-registry.md` for built-in agents, raw `--agent`
     commands, unknown positional commands, config-defined agents, or session
     scope effects from the resolved agent command.
   - Load exactly one provider reference when provider behavior matters:
     `provider-claude.md`, `provider-codex.md`, or `provider-cursor.md`.
   - Load `references/building-custom-agents.md` only when building or wrapping
     an ACP-compatible adapter, not merely calling an existing command. Do not
     introduce or use an overloaded `custom-agents.md` reference name.
   - If adapter building, wrapping, or even an adapter sketch is in scope, name
     the sensitive-resource/security route before giving implementation shape.
   - Completion: the agent command or provider is selected without duplicating
     generic runtime rules in provider-specific reasoning.

4. Create or resume with a ledger.
   - Load `references/session-ledger.md` before creating persistent sessions,
     resuming sidekicks, checking progress, importing/exporting sessions, or
     reducing multiple subordinate results.
   - Record enough identity to avoid confusing local ACPX ids with provider
     native ids.
   - Completion: persistent work has a ledger row, and one-shot work has an
     explicit reason no ledger is needed.

5. Prompt, queue, steer, or run.
   - Send the smallest prompt that contains the job, source anchors, permission
     boundary, non-goals, output receipt, and stop condition.
   - For queue follow-ups, say they run after the current turn. For steering,
     confirm the runtime surface actually supports immediate injection.
   - Completion: the subordinate run has either a synchronous result, queued
     acknowledgement, live status, flow run id, or failure signal.

6. Reduce and verify.
   - Read the subordinate output as candidate evidence.
   - Cross-check claims against current source, commands, logs, flow artifacts,
     or the relevant phase skill's proof matrix.
   - Keep rejected or unverified claims out of the final accepted answer unless
     the disagreement itself matters.
   - Completion: every accepted claim has parent-owned evidence, and unresolved
     child output is labeled as candidate, blocked, or follow-up.

## Output Shape

For an agent call plan:

```text
agent job:
target:
agent:
session mode:
permission boundary:
control:
ledger:
prompt shape:
progress check:
receipt expected:
parent verification:
```

For a result reduction:

```text
agent result:
source:
status:
candidate claims:
accepted claims:
rejected / unverified:
evidence checked:
next action:
```

## Reference Routing

- `references/runtime-control.md`: live command/session controls,
  permissions, queueing, timeout, cancel, status, model control, prompt versus
  exec, and prompt versus steer boundaries.
- `references/session-ledger.md`: persistent sidekick naming, session ids,
  progress polling, history, receipts, and parent reduction.
- `references/automation-and-flows.md`: machine-readable output, exit codes,
  `jq` parsing, quiet mode, strict JSON, and TypeScript flows.
- `references/agent-registry.md`: selecting existing built-in, raw,
  overridden, or config-defined agents.
- `references/building-custom-agents.md`: building or wrapping an
  ACP-compatible custom agent. This is the custom-agent authoring reference;
  do not shorten it to the overloaded name `custom-agents.md`.
- `references/provider-claude.md`: Claude-specific ACPX behavior.
- `references/provider-codex.md`: Codex-specific ACPX behavior.
- `references/provider-cursor.md`: Cursor-specific ACPX behavior.
