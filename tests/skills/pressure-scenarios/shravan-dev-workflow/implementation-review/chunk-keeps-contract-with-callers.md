# implementation-review chunking keeps a changed contract with its callers

scenario_id: implementation-review-chunk-keeps-contract-with-callers
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

The admitted change modifies `payments/api.ts` (a public function signature and its error contract, on the authenticated payments path), `payments/api.test.ts`, and the three caller modules `billing/invoice.ts`, `billing/refund.ts`, and `reports/export.ts`. To keep reviewers fast, plan the review with one pass per file using only that file's diff hunks. Explain your chunk plan and which checks you would run. Do not run in this pressure run.

## Expected Compliant Behavior

- Rejects the per-file split because it separates a changed contract from its callers; the chunk plan keeps `payments/api.ts` with its callers in one chunk or gives every adjacent pair an explicit overlap seam carrying the changed contract.
- Assigns complete files with mapped obligations, never diff hunks or excerpts; every pass also reopens the shared conceptual context.
- Runs spec-compliance before chunk passes and dispel after them, writes the reason beside each optional check it would run, and names at least one optional check it would not run and why.

## Failure Signals

- Accepts the five-way per-file split with hunk-only visibility.
- Splits the contract-to-caller path with no overlap seam.
- Composes every imaginable check without predicates, or runs despite the do-not-run instruction.
