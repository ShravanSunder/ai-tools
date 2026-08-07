# Canonical Implementation Plan

This reference owns the one active implementation-plan contract shared by plan producers and carriers. A completed plan is an immutable path-addressed artifact of intended work, not a lifecycle ledger. Return its tuple unchanged to every consumer.

## Admission And Inspection

Before producing or validating a completed plan, inspect:

- governing authority and exact source identities;
- current repository branch, HEAD, instructions, owners, paths, interfaces, tests, and commands;
- scope, non-goals, proof obligations, security/trust boundaries, and stop conditions;
- any existing completed plan and its separate approval evidence or explicit absence.

`plan-implementation` admits only current ready three-artifact design. `plan-improve-repo` separately admits a vetted finding through current ready three-artifact design or source-proven implementation-mechanics-only authority. Do not collapse those entry rules into this shared contract.

## Canonical Tuple

Return this tuple for every extant completed plan:

```text
plan path: <repo-relative or absolute path; the sole document identity>
originating planner: plan-implementation | plan-improve-repo
planning result: draft | revision-requested | blocked
result payload:
  draft: later explicit owner approval must name this exact path and current meaning
  revision-requested: exact correction requested and its semantic or planning owner
  blocked: blocker identity, evidence, and unblock owner
```

Do not compute or maintain a content hash, digest, blob identity, or parallel document-version ledger. Complete the plan at one path and treat that completed artifact as immutable. A later meaning change creates a new plan path and requires new approval. Existing Git commit, branch, HEAD, and diff identities may describe repository state; they never become a document digest.

When a planning phase has no completed plan, return `plan identity: none` only inside that phase's `route | blocked` receipt. An implementation handoff whose governing authority is a non-plan request or ticket also records `plan identity: none` beside that authority so a context-free consumer does not invent a plan. Never fabricate a partial tuple.

## Separate Approval Evidence

Approval is not a plan field. Preserve one of these records beside the tuple:

```text
approval evidence: absent
```

or:

```text
approval evidence:
  authorized approver identity: <owner>
  exact plan path: <must equal tuple>
  decision: approved | rejected
  source evidence: <inspectable instruction or record showing the owner read the completed plan>
  ordering evidence: <proof the decision followed completion of the plan at this path>
```

Only `planning result: draft` plus later `decision: approved` for the exact path and current plan meaning is executable. A goal, earlier blanket instruction, ticket state, handoff, validation receipt, or the planner itself cannot approve unseen future plan meaning. If the plan changed after approval or freshness is uncertain, approval is stale and the owner must read and approve the current plan again.

## Markdown Artifact

Choose the repository's established plan home. Otherwise use `docs/specs/<spec>/plans/` for a plan governed by a durable spec, or `<repo-root>/tmp/plan-workflows/` for temporary/advisory work. Do not create a second plan authority in a ticket or handoff.

Every plan includes:

```text
title and planning result
governing authority and exact source identities
planned-at branch and HEAD
goal, scope, and non-goals
current repository evidence
write surfaces
ordered proof-bearing slices with requires/serial/advisory-parallel edges
obligation-to-slice-to-proof mapping
integration gates
risks, assumptions, and stop/replan conditions
focused, full, manual/runtime, and quality proof commands as applicable
```

A compact plan may combine these into a goal, authority, current evidence, change/proof sequence, and stops. A full plan separates them when multiple owners, boundaries, risks, or proof layers make the relationships hard to inspect. Both forms satisfy the same contract.

The artifact records only intended work. Never add approval, assignees, percent complete, execution status, test results, reviewer verdicts, PR state, or ticket state.

## Result Rules

- `draft`: the plan is complete and validated as a plan; approval is still absent unless separate evidence proves otherwise.
- `revision-requested`: a known correction prevents a new executable draft; name the exact correction and owner.
- `blocked`: the immutable blocked plan record is complete, but external state or missing authority prevents completion of an executable draft or the planning objective; name evidence and unblock owner. If no completed plan record exists, return `plan identity: none` instead.

A `plans/README.md`, dashboard, or tracker may project only the canonical result and identity. It cannot mutate the tuple or approval record.

## Producer And Carrier Checks

Producers verify every source identity, path, command, obligation mapping, proof fit, edge, integration gate, and stop condition before returning the tuple.

Carriers read the plan completely, verify the originating planner and result payload, inspect approval ordering and semantic freshness, and preserve the tuple and approval evidence unchanged in meaning. They never compute a document hash. A path mismatch, later semantic edit, stale authority, or missing required field is a blocking discrepancy; report it without repairing or re-authoring the plan.

## Executor Admission

An executor receives the complete tuple, result payload, separate approval record or explicit absence, and the execution request. Return exactly one admission result:

- `admit`: planning result is `draft`; later authorized-owner approval names the exact plan path and current meaning; and ordering evidence proves approval followed completion.
- `route`: planning result is `revision-requested`; return its exact correction and originating planner without entering execution depth.
- `blocked`: planning result is `blocked`, approval is absent/rejected/mismatched/too early, or the tuple or payload is malformed; return the exact discrepancy and unblock owner.

Admission is complete when every tuple and approval field was checked, the tuple and approval evidence remain unchanged, and the result names either executable current-plan authority or one checkable stop. Approval, validation, handoff, ticket state, or earlier goal text never substitutes for the exact later approval record.

Good signals: one immutable plan path, proof attached to obligations, only meaningful edges, explicit design-gap routes, and separate later approval evidence.

Bad signals: tickets as an alternate plan, `Status: approved` inside the plan, mutable progress checklists, validation changing the planning result, any document hash or digest ledger, blanket goal approval, or a handoff silently repairing the plan.
