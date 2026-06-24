# Implementation Review Packet

This file owns the skill-local final implementation-review packet. It is the
only packet anatomy owner for `implementation-review-swarm`. Other prompt files
may reference this packet, but they must not duplicate or redefine it.

The parent reducer builds the packet. Reviewer lanes read the packet and source
artifacts independently. Controller summaries, implementer summaries, parent
memory, prior agent reports, and broad transcript snippets are routing hints, not
source truth.

## Review Classifier

Use the source-trace path when any of these are true:

- source-backed or plan-backed implementation review;
- pre-merge or PR-readiness implementation review;
- runtime authority, security boundary, cross-backend routing, public capability
  surface, agent/tool execution, plugin/MCP behavior, or architecture cutover;
- user steering asks whether the real runtime, backend, VM, or requested system
  exists;
- prior review or research identified a false-green or weaker-substitute risk.

Use `diff_only_limited` only when the review is explicitly diff-only, no accepted
source artifact exists, and no risk trigger above is present.

## Packet Fields

```text
mode: implementation | diff | pr | commit | files | adversarial
review_class: source-backed | plan-backed | risk-triggered | diff_only_limited
source_backed_verdict_attempted: true | false
accepted_request
source_spec
source_plan
changed_files
proof_claims
known_deviations
implementation_scope
git_range
security_context
steering_anchors[]
```

Each source field is an inspectable artifact reference or an explicit absence
reason. For source-backed, plan-backed, or risk-triggered review, missing source
artifacts that block source trace make the review `not_ready` and set
`whole-source-trace: not_run_missing_source`.

`steering_anchors[]` entries use this shape:

```text
quote
source_reference
why_it_changes_ownership_or_review_focus
affected_source_obligation
```

Review lanes consume these bounded anchors. They do not mine raw session history
or broad transcript dumps.

## Source Precedence

```text
accepted_request
  -> source_spec
  -> source_plan
  -> proof_claims
  -> changed_files
```

Conflicts are classified instead of silently resolved:

- request or goal vs spec: `spec_ambiguity` or `human_decision_needed`;
- spec vs plan: `spec_plan_conflict`;
- plan weakens, omits, or misreads the spec: `plan_translation_error`;
- implementation contradicts accepted plan/spec: `implementation_defect`,
  `implementation_scope_underdelivery`, or `implementation_scope_overreach`;
- proof is lower than the claim: `proof_gap`.

## Lane Output Boundary

Lanes return candidate findings and may propose:

```text
candidate_deviation_bucket
candidate_route_target
```

Only the parent reducer attaches final deviation bucket and route target metadata
to accepted findings and the final report.

## Source Trace Ledger

`whole-source-trace` rows use this local ledger shape:

```text
source_obligation_id
source_anchor: accepted_request | source_spec | source_plan
source_requirement_or_boundary
plan_anchor
implementation_anchor
proof_anchor
reachability_status: live | partial | schema_only | docs_only | unreachable | absent | not_applicable
coverage_status: covered | deferred_unreachable | missing | contradicted | ambiguous
false_substitute_risk
candidate_deviation_bucket
candidate_route_target
notes
```

This ledger is local to `implementation-review-swarm`; it is not a repo-global
lane contract.

The parent reducer turns candidate ledger rows into accepted report rows with
this concrete source/spec/plan/code/proof matrix shape:

```text
source_obligation_id
source_anchor
plan_anchor
implementation_anchor
proof_anchor
reachability_status
coverage_status
false_substitute_risk
accepted_deviation_bucket
accepted_route_target
```

Do not replace the matrix with prose such as "source trace considered" or
"aligned overall." If source artifacts are missing, still print the matrix field
names with `missing`, `unknown`, `none`, or `not_applicable` values instead of
claiming readiness.

## Runtime Reachability

Runtime, authority, security, public-capability, plugin/MCP, agent/tool
execution, and architecture-cutover claims require:

```text
caller/front door
adapter or entrypoint
router or dispatch owner
backend/provider/executor
changed code/artifact
proof layer and evidence
reachability_status
```

`ready` requires `live` plus proof at the claim's layer. `partial`,
`schema_only`, `docs_only`, `unreachable`, or `absent` force `not_ready` unless
the accepted source explicitly marks the obligation contract-only or deferred
and the implementation proves it is not exported, registered, accepted by
runtime config, or reachable from the claimed caller. That state is
`deferred_unreachable`.

## Report Text Contract

This PR uses text-contract-first report validation. Schema expansion is a
follow-up unless text-contract proof cannot catch report drift.

Top-level verdict remains:

```text
ready | ready_with_fixes | not_ready
```

Explicit diff-only limited review is represented as:

```text
source_coverage_state: diff_only_limited
source_backed_verdict_attempted: false
```

The report must include:

- verdict and accepted findings first;
- source coverage: request/spec/plan/diff/proof;
- whole-source trace status;
- deviation bucket per accepted finding;
- route target per accepted finding;
- source/spec/plan/code/proof matrix rows using the concrete matrix fields
  above for source-backed or risk-triggered reviews;
- false-positive/substitute risks;
- proof gaps and weakened proof lanes;
- swarm coverage and lane receipts.

## Route Targets

Route by cause:

- bad implementation against an accepted plan: `implementation-execute-plan`;
- plan translation error or missing plan proof: `plan-creation-swarm`;
- plan needing adversarial validation before revision: `plan-review-swarm`;
- spec ambiguity, missing contract, or missing requirement:
  `spec-creation-swarm`;
- spec needing adversarial validation before revision: `spec-review-swarm`;
- unresolved user/product/design choice: `discuss-with-me` or direct user
  clarification;
- PR thread follow-through: `implementation-pr-wrapup`.
