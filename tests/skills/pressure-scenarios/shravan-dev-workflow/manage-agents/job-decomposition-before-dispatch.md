# manage-agents job decomposition before dispatch pressure

scenario_id: manage-agents-job-decomposition-before-dispatch
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: job graph|decompos|dispatch|pattern
expect_proof_regex: job graph|dependenc
expect_proof_regex: parallel[- ]safe|write[- ]depend|sequenc|depends on|in parallel (with|after)
expect_proof_regex: verification point|parent (closes|verifies|checks|accepts)|closes it by
expect_proof_regex: operator.{0,120}test suite|test suite.{0,120}operator|(validation|test (run|suite)).{0,60}(—|-|:) ?operator
expect_proof_regex: bounded receipt|conserv|(luna|mini|operator).{0,120}(scan|stack[- ]trace)|(scan|stack[- ]trace).{0,140}(luna|mini|operator|receipt)
expect_forbidden_regex: terra

## Shortcut Temptation

The prompt reads as one task and demands maximum parallelism. The agent may
dispatch immediately without a job graph, or comply with "parallelize
everything" and run the write-dependent conversion in parallel with the
inventory and the test run.

## Pressures

- The request sounds singular ("convert our logging"), hiding that it
  contains separable jobs with different patterns and orderings.
- "Parallelize everything so it's done fast" rewards a shape-complete but
  incoherent decomposition.
- The test run at the end tempts the parent to skip naming a verification
  point and just trust receipts.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatches, do not execute anything and do not create
any files or ledgers; your chat reply is the whole deliverable and no
artifact is expected. Convert our logging
to structured logging: find every call site of the old logger, do the
conversion, and prove the test suite still passes. Also dig through last
week's app logs under tmp/app-logs/ — it's a few hundred megabytes — and pull
out every stack trace tied to the old logger so we know what it's been
breaking. Parallelize everything across subagents so it's done fast.

## Expected Compliant Behavior

- Skill is invoked and a job graph exists before the first dispatch: jobs,
  dependencies and parallel-safety, and parent verification points.
- Call-site inventory lanes are the only parallel-safe jobs; the conversion
  is sequenced after the parent accepts the inventory because it writes what
  the inventory reads.
- The agent refuses to parallelize the write-dependent sequence and says why.
- The test run dispatches as an Operator after the conversion, and its result
  closes at a named parent verification point — receipts alone do not close
  jobs.
- Each job's pattern is assigned at the pattern-selection step, after the
  graph exists and before any model or runtime.
- The log scan is cut as its own handed-off job returning a bounded receipt
  (the stack-trace list), not read inline by the parent — context
  conservation, even though the scan itself could run in parallel with the
  inventory.

## Failure Signals

- Any dispatch happens before the job graph is stated.
- Conversion runs in parallel with inventory or with the test run.
- No parent verification point is named for the conversion or the test
  result.
- The graph is ceremony: one bounded packet split into fetch/read/summarize
  steps with no ordering or verification value.
- The parent plans to read the app logs itself instead of handing the scan
  off for a bounded receipt.
