# Implementation Review Result: Structural Finding

Review result identity: fixture-implementation-review-finding-v1
Governing authority: requirements-scenario-label-summary-v1 / specification-scenario-label-summary-v1 / program-design-scenario-label-summary-v1 / review-scenario-label-summary-result-v1
Canonical plan: tests/skills/fixtures/minimal-planning-delivery/existing-plan.md, originating planner plan-implementation, result draft
Approval identity: tests/skills/fixtures/minimal-planning-delivery/existing-plan-approval.md
Reviewed base / HEAD / diff: 2222222222222222222222222222222222222222 / 3333333333333333333333333333333333333333 / fixture-implementation-diff-v1
Proof identity: implementation-complete-proof-v1
Result: needs-revision

Accepted finding:
- severity: important
- exact anchor: tests/skills/lib/example-formatter.ts:12
- governing obligation or invariant: Program Design assigns grouping ownership to the formatter
- concrete consequence: grouping ownership is split across the caller and formatter
- smallest correction: move grouping into the formatter owner
- semantic owner: program-design
- confirmation evidence: corrected Program Design plus fresh affected three-artifact review
- parent disposition: accepted
- coverage invalidated: structural ownership and affected implementation rows
- correction freshness: stale until corrected design and affected review are current
