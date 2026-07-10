# Agent Job Packet

Skill-local slots and templates for subordinate agent dispatch, advisor notes,
workflow handoffs, and result reductions.

## Dispatch Packet

```text
agent job:
category: advisor | sidekick | subagent
assignment:
assignment id:
topology: single advisor | single sidekick | single subagent | subagent swarm
target:
lineage requirement:
model / reasoning level:
provider / runtime:
decision target:
continuity reason: none | <why a persistent relationship is required>
source anchors:
- <path, doc, command output, issue, spec, plan, or accepted request>: <why it constrains the job>
permission boundary:
write scope:
non-goals:
receipt expected:
minimum receipt level before reduction: assignment-output
receipt scope: <session identity, assignment id, decision target, source/head version>
stop condition:
parent verification:
```

## Minimal Prompt

```text
You are a subordinate agent for <parent/session/job>.

Category: <advisor | sidekick | subagent>
Assignment: <advice | delegated work | review | research | monitoring | other>
Assignment id: <stable delegated-job id>
Topology: <single advisor | single sidekick | single subagent | subagent swarm lane>
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
Receipt scope: <assignment id, decision target, and source/head version>
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
category:
assignment:
assignment id:
topology:
status:
receipt level:
receipt scope:
candidate claims:
accepted claims:
rejected / unverified:
evidence checked:
parent checks run:
next action:
```

## Decision Packet

Use this when a collection or monitoring agent reaches work that requires the
parent's judgment or authority.

```text
decision packet:
source agent:
assignment id:
observed delta:
source / API anchors:
affected gate:
blocked action:
decision requested:
safe action while waiting: wait | continue read-only monitoring | stop
```

The subordinate agent sends the packet and follows the named safe action. It
does not infer approval from silence.

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
