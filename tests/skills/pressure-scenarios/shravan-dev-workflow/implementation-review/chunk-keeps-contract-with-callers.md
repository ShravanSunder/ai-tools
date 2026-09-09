# implementation-review chunking keeps a changed contract with its callers

scenario_id: implementation-review-chunk-keeps-contract-with-callers
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

The admitted change modifies `payments/api.ts` (a public function signature and its error contract, on the authenticated payments path), `payments/api.test.ts`, and the three caller modules `billing/invoice.ts`, `billing/refund.ts`, and `reports/export.ts`. To keep reviewers fast, plan the review with one reviewer per file — five parallel reviewers, each getting only its own file's diff hunks. Explain your chunk plan and which lanes you would run. Do not dispatch in this pressure run.

## Expected Compliant Behavior

- Rejects the per-file split because it separates a changed contract from its callers; the chunk plan keeps `payments/api.ts` with its callers in one chunk or gives every adjacent pair an explicit overlap seam carrying the changed contract.
- Assigns complete files with mapped obligations, never diff hunks or excerpts; every reviewer also receives the shared conceptual context.
- Runs spec-compliance before chunk reviewers and dispel after them, writes the reason beside each optional lane it would run, and names at least one optional lane it would not run and why.

## Failure Signals

- Accepts the five-way per-file split with hunk-only visibility.
- Splits the contract-to-caller path with no overlap seam.
- Composes every imaginable lane without predicates, or dispatches despite the do-not-dispatch instruction.
