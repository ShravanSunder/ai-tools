# Spec Creation Swarm Packets

Use this skill-local packet contract when dispatching read-only spec-creation
subagents. Load `references/creation-evidence-schema.md` and only the selected
`references/lanes/*.md` files for lane-specific behavior.

This file intentionally does not define named lane overlays. Stable lane
behavior belongs in `references/lanes/<lane>.md`.

The parent owns synthesis and decisions. Lane outputs are candidate evidence,
not accepted design truth, until the parent reducer verifies source anchors and
folds accepted evidence into the primary spec artifact.

Parent summaries help route lanes, but they do not constrain lanes by
themselves. Primary artifacts, accepted chat packets, current code/docs, named
research ledgers, and explicit source anchors constrain the lane. Supporting
evidence can corroborate or challenge those anchors; unverified assumptions
remain uncertainty until the parent resolves them.

Do not pass accumulated session history as lane context. Give each lane a
fresh, bounded packet with source anchors, source/file inventory, and the exact
decision target. Do not ask a lane to "understand the repo" or "review
everything" unless that broad audit is the named task and the inspect list
explains why.

For substantial `shravan-dev-workflow` spec creation, create a durable primary
spec artifact under `docs/specs/` unless the user asked for chat-only/no-files,
the work is a single tiny local lane, or the tool surface cannot write
artifacts. Substantial means any of: more than one lane/subagent, output
consumed by another workflow or phase, high/xhigh or security-sensitive lanes,
or findings/decisions/proof obligations that need later inspection. Record any
exception in the parent receipt.

Supporting artifacts are different. Research lane files, parent ledgers,
review reports, and planning scratch can remain in repo-local `tmp/` unless the
user explicitly asks to promote them. Specs are maintained artifacts; scratch
evidence is inspectable support material.

Default artifact shape:

```text
docs/specs/<date>-<slug>.md
                              # primary progressive-disclosure spec

tmp/spec-workflows/<date>-<slug>/
  swarm-ledger.md            # parent synthesis and evidence trace
  lanes/
    <lane-name>.md           # candidate lane evidence
  <slice-name>.md            # optional draft slice before promotion
  evidence-and-gaps.md       # optional evidence ledger, not required reading
```

The primary spec file carries product intent / PRD when load-bearing,
requirements overview, technical contract, boundary map, slice routing map,
proof expectations, non-goals, and open decisions. Slice specs are child specs
for vertical slices, app protocols, ownership boundaries, domain boundaries, or
shared lower-level contracts. Promote slice specs to the repo spec/docs area
when they become maintained contracts rather than draft scratch. Do not create
appendix-style mini-doc sprawl. Every spec artifact file stays under 2000
lines.

## Shared Spec-Creation Packet

```text
You are a read-only design/research lane.
Do not edit files, stage changes, commit, or write implementation code.

Repo: <absolute repo path>
Question: <bounded question>
Decision target: <spec decision, requirement, boundary, tradeoff, proof expectation, or slice route this evidence informs>
Design stage: pre-plan design formation
Parent design packet:
- problem / user / desired outcome
- why now
- current-state anchors
- constraints and invariants
- shared domain vocabulary
- explicit non-goals / Not Doing
- open unknowns
- expected proof modality from this lane
Selected lane reference: <references/lanes/<lane>.md>
Creation evidence schema: references/creation-evidence-schema.md
Reasoning effort: high | xhigh
Source-of-truth inputs:
- <path, doc, log, issue, or code search>: <why this source constrains the lane>
Source/file inventory:
- <path or source>: loaded | referenced | out of scope - <why it matters>
Security context: applicable | not applicable
- not applicable: <reason>
- applicable: <pointer to parent security context plus lane deltas, or assets,
  entry points, untrusted inputs, trust boundaries, sensitive data, privileged
  actions, and security non-goals>

Inspect:
- <path or docs query>: <why>

Non-goals:
- Do not choose implementation order, task sequence, worker assignment, execution DAGs, exact validation commands, reviewer verdicts, or final accepted design.
- <lane-specific design decisions this lane must not own>

Contradiction handling:
- Report contradictions, missing requirements, unsupported assumptions, and
  source gaps. Do not smooth them over.

Return:
- lane name
- status: answered | blocked
- candidate evidence label
- files/docs inspected
- answer
- evidence entries using `references/creation-evidence-schema.md`
- risks or hidden assumptions
- security implications, if any
- proof expectations or proof modalities, not exact commands
- contradictions or uncertainties
- proposed artifact path and candidate lane-file content, when artifacts are expected
- completion receipt: answered | blocked, with source anchors and proposed
  artifact paths; parent writes lane files for read-only lanes
- confidence: high | medium | low
```

## Parent Swarm Ledger

For substantial work, the parent `swarm-ledger.md` records:

- source-of-truth inputs and lane packets issued
- selected and omitted lanes with rationale
- lane artifact paths under `lanes/`
- candidate evidence accepted, contested, rejected, deferred, or left open
- product intent, requirements, technical-contract, security, separability,
  slice-route, and proof-expectation decisions accepted into the primary spec
- route to `spec-review-swarm` for drafted-spec critique, then
  `plan-creation-swarm` after accepted review feedback is folded in
- completion receipt with source anchors, artifact paths, named exceptions, and
  remaining uncertainty

Spec creation stays pre-plan: it names proof expectations and modalities, but
does not produce task sequencing, worker assignment, execution DAGs,
implementation-plan rows, exact validation commands, reviewer verdicts, or
implementation code.
