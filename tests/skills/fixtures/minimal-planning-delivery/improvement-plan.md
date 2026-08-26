# Remove Duplicate Fixture Sorting Implementation Plan

Planning result: ready
Originating planner: plan-improve-repo
Planned at branch/HEAD: fixture / 2222222222222222222222222222222222222222

## Governing Planning Basis

- Kind: admitted-repository-improvement
- Finding: duplicate private sort call in one test-fixture formatter.
- Basis classification: implementation-mechanics-only
- Evidence: current formatter source and focused tests; no public behavior, owner, interface, state, failure, trust, compatibility, or proof-seam decision.
- Applicability: current fixture formatter.

## Delivery Context

- Requested terminal: plan-only
- Delivery grouping: single:remove-duplicate-fixture-sorting
- PR topology: not-applicable

## Change And Proof

1. Remove the duplicate private sort call and keep existing focused unit coverage.
2. Run the focused unit test, full skill unit suite, and typecheck.
