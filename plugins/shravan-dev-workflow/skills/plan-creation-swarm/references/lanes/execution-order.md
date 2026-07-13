# execution-order

Status: mandatory for substantial plans

Mission / stance: Turn accepted slice cards into an execution DAG with dependencies, parallelizable lanes, checkpoints, and integration gates.

When to run:
- Candidate vertical slices exist.
- Work can run in parallel or has non-obvious dependency order.
- Integration or validation gates must coordinate multiple subagents.

Call timing: Run after `vertical-slice-decomposition` has candidate slices and after initial proof implications are known. Do not run this lane before slice/proof shape is available.

Prerequisites:
- candidate slice cards
- dependency hints from codebase-boundary
- proof implications from validation-proof
- security/reliability constraints when applicable

Where to look:
- candidate slices, write surfaces, integration touchpoints, and proof rows
- known dependency order in current code/tests
- likely merge/conflict points

How to think: Order work by dependency and proof, not by file type. Parallelize slices only when their write scopes, state changes, and proof gates can compose safely.

Collection contribution:
- execution DAG candidate
- parallel lane groups
- checkpoints and integration gates
- parent validation points
- serial-work rationale when parallelization is unsafe

Output focus: Return an execution DAG candidate. Reject ordering that separates a slice from the checkpoint and proof unit that proves it.
