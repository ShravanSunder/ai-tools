# Agent Job Packet

## Dispatch

Build one bounded packet per non-trivial call. Keep the value column aligned so a human can scan it.

```text
job packet
  job:        <one-sentence assignment and its decision target>
  pattern:    advisor | sidekick | delegate | operator
  lane:       <swarm name / lane — only for swarm dispatches>
  route:      <category> / <lineage> — native | acpx <provider> — <exact model id> @ <reasoning effort>
  access:     history none | all (native only; ACPX always none); workspace read-only | write <paths when write>
  sources:    <anchors the agent must read>
  non-goals:  <what this job must not touch>
  return:     <receipt shape>, bound to assignment id + decision target
              + source/head version (+ session identity when persistent)
  stop when:  <condition that ends the agent's work and produces the receipt>
  verify:     <parent checks at the named verification point that close the job
              before accepting any claim>
```

## Operator Decision

An Operator that reaches work requiring judgment or authority stops and sends this; it proceeds only after explicit parent approval.

```text
decision packet
  from:       <assignment id>
  observed:   <delta that triggered this>
  anchors:    <source or API anchors>
  gate:       <affected gate>
  blocked:    <action the Operator will not take>
  requested:  <decision requested>
  waiting:    wait | continue read-only monitoring | stop
```

## Reduction

```text
agent result
  job:        <assignment id> / <pattern> / <lane when swarm>
  status:     complete | partial | blocked | no-receipt
  receipt:    <level>, matched to the packet's return-line binding
  accepted:   <claims accepted after parent checks>
  rejected:   <claims rejected or unverified>
  checks:     <parent checks run>
  next:       <next action>
```
