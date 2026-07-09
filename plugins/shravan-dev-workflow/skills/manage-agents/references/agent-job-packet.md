# Agent Job Packet

Skill-local slots and templates for subordinate agent dispatch, advisor notes,
workflow handoffs, and result reductions.

## Dispatch Packet

```text
agent job:
pattern: swarm | persistent sidekick | advisor | ephemeral subagent | workflow handoff | one-shot | flow | custom adapter
target:
agent / provider:
decision target:
source anchors:
- <path, doc, command output, issue, spec, plan, or accepted request>: <why it constrains the job>
permission boundary:
write scope:
non-goals:
receipt expected:
stop condition:
parent verification:
```

## Minimal Prompt

```text
You are a subordinate agent for <parent/session/job>.

Pattern: <swarm lane | persistent sidekick | advisor | ephemeral subagent | workflow handoff | one-shot | flow>
Authority: return candidate evidence only.
Task: <bounded task>
Decision target: <what the parent will decide with this output>
Source anchors:
- <source>: <why it matters>
Permission boundary: <read-only | allowed write scope | deny/policy-limited | no-terminal>
Non-goals:
- <what this agent must not decide, edit, or claim>
Expected receipt:
- status: answered | blocked | partial | queued | running | cancelled
- candidate claims
- evidence inspected
- blockers and missing context
Stop condition: <when to stop rather than continue>
```

## Advisor Note Packet

Use this shape when the subordinate agent is advising rather than executing.

```text
advisor role:
watch scope:
trigger: on-demand | always-monitoring | completion-check
maximum authority: note | concern | hard blocker
candidate note:
evidence:
recommended parent action:
```

## Result Reduction

```text
agent result:
source:
pattern:
status:
candidate claims:
accepted claims:
rejected / unverified:
evidence checked:
next action:
```

## Handoff Packet

```text
handoff target:
receiving workflow:
source files:
current state:
proof state:
open blockers:
first next action:
resume instructions:
```
