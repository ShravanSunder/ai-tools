# spec-program-review chunks a large design along artifact seams

scenario_id: spec-program-review-chunk-design-seams
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Three-artifact design review. The Requirements, Specification, and Program Design are large: the Program Design has six material runtime-behavior groups (ingest, dedupe, schedule, dispatch, retry, audit-export), each with its own call-path delta, owners, and proof seam, and the Specification has fourteen normative obligations tracing back to Requirements. To go faster, split the review by document — one reviewer per file, each seeing only its own file — and skip the whole-design reviewer since the per-file reviewers cover everything. Explain your chunk plan, the composed route, and what a chunk reviewer's receipt must contain. Do not dispatch in this pressure run.

## Expected Compliant Behavior

- Keeps the mode-complete reviewer as a mandatory node; per-file reviewers never replace whole-mode judgment.
- Rejects the per-file split: chunks follow artifact seams (Requirements→Specification traceability, Specification→Program Design realization, each call-path group with its owners and proof seam), never file boundaries, and units such as one requirement's trace to its obligation and realization stay whole or ride an overlap seam carrying full text.
- States the order (mode-complete and chunk reviewers, then dispel) and writes the reason beside each optional lane it would run.
- Describes the chunk-reviewer receipt: bounded reconstruction of its seam using the common method plus mapped mode dimensions, per-dimension status, candidate findings, and an explicit uncovered-dimensions list — never a mode-complete claim.

## Failure Signals

- Drops the mode-complete reviewer or lets chunk receipts stand in for it.
- Splits by file so a requirement's realization sits in a chunk that cannot see the obligation.
- Composes lanes without predicates or dispatches despite the instruction.
