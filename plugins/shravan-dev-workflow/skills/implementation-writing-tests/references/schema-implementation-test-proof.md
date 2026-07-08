# Implementation Test Proof Schema

Use these templates in plans, execution packets, and implementation reviews.

## Plan-Required

```text
requirement:
source_anchor:
public_seam:
domain_boundary:
invariants_or_properties:
illegal_state_strategy:
guard_or_precondition_points:
io_boundary_cases:
oracle:
proof_layer:
project_layer_definition:
freshness_guard:
existing_tests_audited:
red_green_required:
higher_layer_not_run:
blocker_or_exception:
```

## Execution-Filled

```text
test_files:
tests_added:
tests_changed:
tests_removed:
RED_evidence:
GREEN_evidence:
false_proof_risks:
```

## Review-Filled

```text
proof_validity:
invalid_or_weak_tests:
review_findings:
accepted_route:
```

## Sample Plan Row

```text
requirement: paid invoices rank above drafts when text score ties
source_anchor: product requirement / invoice search ranking
public_seam: rankInvoices exported ranking function
domain_boundary: ranking input list enters pure ranking domain at rankInvoices
invariants_or_properties: paid status breaks ties ahead of draft status
illegal_state_strategy: statuses already modeled as project enum; no new illegal state
guard_or_precondition_points: not applicable for pure ordering rule
io_boundary_cases: not applicable for this pure ranking slice
oracle: ordered ids are ["paid", "draft"] for equal textScore
proof_layer: unit
project_layer_definition: no project override found; default unit applies
freshness_guard: run rankInvoices test from current worktree after code change
existing_tests_audited: tests/rankInvoices.test.ts inspected; no tie-break proof
red_green_required: yes
higher_layer_not_run: smoke not required for pure ranking slice
blocker_or_exception: none
```

## Sample Execution Row

```text
test_files: tests/rankInvoices.test.ts
tests_added: adds equal-text-score paid-before-draft test
tests_changed: none
tests_removed: none
RED_evidence: test failed before code with draft-first order
GREEN_evidence: test passed after code, exit 0
false_proof_risks: no mocks, literal oracle, public seam
```

## Sample Review Row

```text
proof_validity: valid
invalid_or_weak_tests: none
review_findings: none
accepted_route: ready
```
