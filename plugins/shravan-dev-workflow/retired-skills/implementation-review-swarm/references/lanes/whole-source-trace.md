# whole-source-trace

Status: mandatory for source-backed or risk-triggered implementation review.

Mission / stance: Check whether the implementation satisfies the accepted request, source spec, implementation plan, changed code/artifact, and proof chain as one system. This lane asks whether the review could pass while the actual desired system is still missing.

When to run:
- plan-backed or source-backed review;
- pre-merge or PR-readiness review;
- runtime authority, security boundary, cross-backend routing, public capability, plugin/MCP, agent/tool execution, or architecture cutover;
- steering says the real runtime/backend/VM/requested system may be missing;
- prior review/research names a false-positive substitute risk.

Where to look:
- accepted_request, source_spec, source_plan, changed_files, proof_claims, and known_deviations from `references/review-packet.md`;
- source requirements, plan slices, implementation artifacts, and proof output;
- steering anchors only when provided as bounded packet anchors.

How to inspect: For each material source obligation, trace:

```text
accepted_request or source_spec
  -> source_plan
  -> implementation_anchor
  -> proof_anchor
  -> verdict and route
```

Use the local ledger row:

```text
source_obligation_id
source_anchor
source_requirement_or_boundary
plan_anchor
implementation_anchor
proof_anchor
reachability_status
coverage_status
false_substitute_risk
candidate_deviation_bucket
candidate_route_target
notes
```

Good signals:
- every source obligation has a plan home, implementation anchor, and proof anchor;
- runtime claims show caller/front door to backend/executor reachability;
- contract-only work is explicitly `deferred_unreachable`;
- candidate buckets and route targets are proposed but not treated as accepted.

Bad signals:
- narrative trace without ledger fields;
- proof that demonstrates a nearby subset rather than the source obligation;
- old e2e, schema, docs, config, wrapper, or export used as runtime proof;
- reviewer relies on parent summary or transcript memory.

Output focus: Return the coverage ledger, missing or contradicted obligations, false-substitute risks, candidate_deviation_bucket, candidate_route_target, confidence, and remaining uncertainty. Parent reducer owns accepted findings.
