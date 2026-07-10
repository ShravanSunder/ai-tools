# Agent Job Packet

## Dispatch

```text
agent job:
pattern: advisor | sidekick | delegate
assignment route: reasoning | operator
assignment id:
topology: single | swarm lane
target:
model category / exact model / reasoning effort:
lineage requirement:
provider / runtime:
decision target:
continuity reason: required for Advisor/Sidekick | none for Delegate
source anchors:
permission boundary:
write scope:
non-goals:
receipt expected:
receipt scope: <session identity, assignment id, decision target, source/head version>
stop condition:
parent verification:
```

## Operator Decision

Use when an Operator reaches work requiring judgment or authority.

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
source / pattern / assignment route / assignment id:
topology / status:
receipt level / receipt scope:
candidate claims:
accepted claims:
rejected or unverified:
parent checks run:
next action:
```
