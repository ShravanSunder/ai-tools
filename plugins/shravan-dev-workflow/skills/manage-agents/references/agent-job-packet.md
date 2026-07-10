# Agent Job Packet

## Dispatch

```text
agent job:
pattern: advisor | sidekick | delegate | operation
assignment id:
lane: single | <swarm name / lane>
target:
model category / exact model / reasoning effort:
lineage requirement:
provider / runtime:
decision target:
continuity reason: required for Advisor/Sidekick | none for Delegate/Operation
source anchors:
permission boundary:
write scope:
non-goals:
receipt expected:
receipt scope: <session identity, assignment id, decision target, source/head version>
stop condition:
parent verification:
```

## Operation Decision

An Operation that reaches work requiring judgment or authority sends this
packet:

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

Silence is not approval.

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
