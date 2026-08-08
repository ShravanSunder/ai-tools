# Reviewing Implementation

This reference owns the complete independent reconstruction method used by both reviewer jobs.

Expected inputs: the shared review packet, exact assignment identity, lane authority, and the lane-specific mission.

Return: source-to-proof coverage, normal and failure-path inspection, proof and reachability judgments, weaker-substitute risks, the riskiest-assumption result, candidate findings, and the uncovered boundary.

## Reconstruct the Changed System

Read every governing artifact and repository instruction completely enough to establish its identity and scope. Inspect the exact base-to-reviewed diff, changed files, callers, owners, interfaces, tests, proof artifacts, and commands rather than trusting the implementer, parent, PR body, or prior reviewer.

Build one coverage row for every normative governing obligation and every behavior, owner, boundary, interface, state transition, failure path, and proof gate promised or touched by the diff. Anything excluded as non-applicable gets its own anchored exclusion row and reason:

```text
obligation -> plan -> implementation -> proof
obligation identity and source anchor:
plan slice and approved write/proof boundary:
implementation anchor and real caller:
proof layer, evidence, and freshness:
coverage: covered | missing | contradicted | ambiguous | deferred-unreachable
false-substitute risk:
candidate semantic owner:
```

A plan matching itself is not sufficient. Compare Requirements and observable Specification meaning, structural Program Design ownership and proof seams, plan translation, actual implementation, and proof as one chain. For admitted improvement plans, use their admitted authority and current evidence instead of inventing a reviewed-design set.

## Trace Normal and Failure Paths

Trace the normal path and every failure, cancellation, retry, partial-state, rollback, cleanup, authorization, and stale-input path promised by the governing source or affected by the diff. Inspect every caller touched by the changed contract plus adjacent callers identified by current source search. Report an uncovered path; do not fill it with inference.

## Check Whether the Proof Fits

Map each claim to its fitting observation layer:

- unit for deterministic logic;
- integration for real boundaries between changed parts;
- smoke or manual runtime observation for a runnable surface;
- end-to-end, visual, data, logs, traces, or metrics when the user-visible or operational claim requires it;
- PR or release evidence only for publication and artifact readiness.

Look for stale output, missing red/green where required, disabled or weakened gates, skipped layers, commands without exit status, and evidence generated before the reviewed source. A broader test does not erase a missing cheaper layer, and a unit test does not become runtime proof.

## Verify the Runtime Path

When the change claims runtime authority, routing, security enforcement, public capability, plugin or tool execution, backend behavior, or architectural cutover, trace:

```text
caller or front door -> adapter or entrypoint -> routing owner -> backend/provider/executor -> proof
```

Return `live | partial | schema-only | docs-only | unreachable | absent | deferred-unreachable`. `ready` requires `live` plus proof at the claim's layer. `deferred-unreachable` is valid only when governing authority marks the work deferred and current registration/export/config keeps it unreachable.

## Catch Weaker Substitutes

Ask whether the review could pass while the requested system is still missing. Check especially:

- schema instead of runtime boundary;
- config instead of executable behavior;
- adapter or wrapper instead of authority or routing owner;
- unit test instead of integration/runtime proof;
- old end-to-end proof for a new path;
- docs, exported type, or approval message instead of reachable enforced behavior.

Name the weaker substitute, missing real boundary, concrete consequence, and proof that would fail if only the substitute existed.

## Test the Riskiest Assumption

Identify the single assumption whose failure would most change the review result. Inspect it directly. Return `resolved | material-risk-remains | blocked`, its evidence, and why any remaining uncertainty is or is not decision-relevant. Do not manufacture a risk to justify a focused reviewer.

## Write Only Supported Findings

A candidate finding needs an exact source and implementation anchor, governing obligation or invariant, concrete failure or consequence, smallest correction, candidate owner, fitting confirmation evidence, and remaining uncertainty. If no well-supported candidate survives, return `No findings`; do not pad.

For `complete-reviewer`, complete when every required coverage or anchored-exclusion row exists; normal and applicable failure paths were inspected; proof layers and source currency were checked; applicable runtime claims have reachability status; weaker substitutes and the riskiest assumption were tested; candidate findings meet the standard; and the result names its uncovered boundary. Focused completion is instead governed by `lanes/focused-reviewer.md` after only the method stages needed for its one named risk.
