# Reviewing Implementation

This reference owns the complete independent reconstruction method used by every reviewer lane that inspects source.

Expected inputs: the shared review packet, the assigned chunk when there is one, lane authority, and the lane-specific mission.

Return: source-to-proof coverage, normal and failure-path inspection, proof and reachability judgments, weaker-substitute risks, the riskiest-assumption result, candidate findings, and the uncovered boundary.

## Reconstruct the Changed System

Read every governing artifact, repository instruction, and assigned target file completely — the whole file, top to bottom, before substantive findings. "Completely enough," sampling changed hunks, or trusting a summary is a skipped read; a judgment about a file the reviewer did not finish reading is unsupported. Inspect the exact base-to-reviewed diff, changed files, callers, owners, interfaces, tests, proof artifacts, and commands rather than trusting the implementer, parent, PR body, or prior reviewer.

Build one coverage row for every normative governing obligation and every behavior, owner, boundary, interface, state transition, failure path, and proof gate promised or touched by the diff. A file is accounted for only when every top-level behavior, owner, boundary, state, failure, and proof region in it — changed or not — appears in a coverage row or an anchored exclusion row; that accounting cannot be written from a partial read, and completion binds to it. Coverage rows are obligation accounting, not a reading receipt: do not add digests, hashes, line counts, chunk-range reports, or per-file "read" attestations beside them. Anything excluded as non-applicable gets its own anchored exclusion row and reason:

```text
obligation -> plan -> implementation -> proof
obligation identity and source anchor:
plan slice and authorized write/proof boundary:
implementation anchor and real caller:
proof layer, evidence, and freshness:
coverage: covered | missing | contradicted | ambiguous | deferred-unreachable
weaker-substitute risk:
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

The method is complete when every requested stage has returned its result: coverage or anchored-exclusion rows accounting for every assigned file whole, normal and applicable failure paths inspected, proof layers and source freshness checked, applicable runtime claims carrying reachability status, weaker substitutes and the riskiest assumption tested, candidate findings meeting the standard, and the uncovered boundary named. Each lane's own reference owns which stages it requests and when the lane stops.
