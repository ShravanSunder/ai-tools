# Model Shapes

Worked examples for drawing the chosen map shape when prose is not enough.

## Terms

```text
term              meaning in this discussion
source of truth   artifact that can prove the claim
agent report      inherited claim from another worker
run output        direct evidence only after read
```

## Boundary

```text
inside model:    scenario contract, run artifact, assertion reducer
outside model:   human confidence, agent self-report, old session memory
edge to inspect: report -> artifact -> verified conclusion
hidden detail:   unrelated repo health
```

## Flow

```text
request
  -> current map
  -> inherited frame / first principles / assumptions
  -> branches
  -> countercase
  -> rebuilt model
  -> next workflow
```

## State

```text
reported
  -> artifact seen
  -> evidence checked
  -> model rebuilt
  -> confirmed
reported -> contradicted when artifact or run output disagrees
```

## Ownership

```text
user goal:          names the useful decision
agent report:       inherited frame
artifact/run output:first principles
parent agent:       verifies and rebuilds the map
next workflow:      owns action after convergence
```

## Constraint

```text
hard constraints:
- workspace is unavailable
- no artifacts were read
- tests were started, not completed
- reports are claims until verified
model can only conclude what those constraints allow
```

## Tradeoff

```text
trust report now:
  gain speed
  pay false-readiness risk
verify artifacts first:
  gain confidence
  pay time and context
default depends on decision cost
```

## Swarm Work

```text
claim:       sidekick says retry/docs/tests changed
artifact:    diff, changed files, test log, task state
verified:    parent reads artifact and maps it to the claim
assumption:  anything still inferred after artifact read
rebuilt map: claimed work exists; proof is pending or confirmed
```
