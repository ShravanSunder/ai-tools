# Agent Job Packet

This reference owns the dispatch, operator-decision, and reduction shapes consumed by `SKILL.md` workflow step 3.

## Dispatch

Build one bounded packet for a new or materially changed assignment. Same-assignment follow-ups carry only the change and new evidence; reuse established scope and identity rather than repeating the full packet. Keep the value column aligned so a human can scan it.

Ids are human-readable text slugs, not minted identifiers: assignment id is `<date>-<job-slug>` (e.g. `2026-08-28-ci-watch`), source/head version is a branch plus short SHA, and session identity is the ledger's relationship name. Never invent a UUID; reuse an identifier that already exists (branch, session name, file path) whenever one fits. The return-line binding is a meaning check — does this receipt belong to this assignment, target, and source version — not a string format to validate.

```text
job packet
  job:        <one-sentence assignment and decision target; task category /
              judgment / guidance / architectural span>
  pattern:    advisor | sidekick | worker | reviewer | operator
  lane:       <swarm name / lane — only for swarm dispatches>
  route:      <category> / <lineage> — native | router <verified SessionRef>
              | acpx <provider> — <exact model id> @ <reasoning effort>
  access:     history <host encoding>; workspace read-only | read-only + exec <listed commands>
              | write <paths> (declared when host enforcement is declarative)
  sources:    <anchors the agent must read>
  non-goals:  <what this job must not touch>
  return:     <receipt shape>, bound to assignment id + decision target
              + source/head version (+ session identity when persistent)
  stop when:  <condition that ends the agent's work and produces the receipt>
  verify:     <parent checks at the named verification point that close the job
              before accepting any claim>
```

### Readers

Review, advisor, research, and guidance packets use `workspace read-only`. That means no repo edits except scratch files under project `tmp/` or system `/tmp`. Repeat that prohibition with its exception on `job:`, `non-goals:`, `stop when:`, and `access:`. An attempted repo edit outside those scratch locations is a stop — return blocked. Parent `verify:` checks the repo worktree is unchanged.

`read-only + exec <listed commands>` grants only those commands, permits their output under project `tmp/` or system `/tmp`, and still forbids repo edits. Parent `verify:` checks that every reported command was granted and that the worktree is unchanged.

### Writers

Writer packets name the write paths on `access:`, repeat the bound on `job:` and `non-goals:`, and treat an edit outside those paths as `stop when`. How a host enforces or only declares that bound is the native-provider or ACPX provider reference loaded for the launch.

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
  receipt:    local | provider-active | assignment-output | parent-verified,
              matched to the packet's return-line binding
  accepted:   <claims accepted after parent checks>
  rejected:   <claims rejected or unverified>
  checks:     <parent checks run>
  next:       <next action>
```

`local` proves record or liveness only. `provider-active` proves provider attachment and selected model evidence. `assignment-output` proves captured output matches session, assignment id, decision target, and source/head version. `parent-verified` proves the parent checked an accepted claim against primary evidence. Only current `assignment-output` enters reduction.
