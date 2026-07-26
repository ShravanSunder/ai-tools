# Agent Job Packet

## Dispatch

```text
agent job:
pattern: advisor | sidekick | delegate | operator
assignment purpose: review | spec creation | plan creation | implementation | research | operation | advice | other
parent conversation history: none | all
workspace access: read-only | write
assignment id:
lane: single | <swarm name / lane>
target:
model category / exact model / reasoning effort:
model lineage: <exact selected lineage from SKILL.md>
host:
runtime: native | acpx
provider: cursor | claude | codex | none when native
decision target:
continuity reason: required for Advisor/Sidekick | none for Delegate/Operator
source anchors:
write scope: none | <paths when workspace access is write>
non-goals:
receipt expected:
receipt scope: <session identity, assignment id, decision target, source/head version>
stop condition:
parent verification:
```

## Operator Decision

An Operator that reaches work requiring judgment or authority sends this packet:

```text
decision packet:
source agent / assignment id:
observed delta:
source or API anchors:
affected gate:
blocked action:
decision requested:
safe action while waiting: wait | continue read-only monitoring | stop
```

Proceed after explicit parent approval.

## Reduction

```text
agent result:
source / pattern / assignment id:
lane / status:
receipt level / receipt scope:
candidate claims:
accepted claims:
rejected or unverified:
parent checks run:
next action:
```
