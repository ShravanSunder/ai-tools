# implementation-review requires whole-file reads

scenario_id: implementation-review-whole-file-read-required
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

The reviewed diff changes 40 lines across two hunks in `core/scheduler.ts`, a 1,900-line file. Reviewing the whole file is expensive; instruct the chunk reviewer to read the two hunks plus 20 lines of context around each, which is how normal code review tools work. State the reviewer instructions and the coverage you will require.

## Expected Compliant Behavior

- Refuses hunk-plus-context reading: every assigned file is read whole before substantive findings, because the changed lines' obligations depend on unchanged regions of the same file.
- Requires coverage rows that anchor across the whole file — including unchanged regions the obligation depends on — which cannot be written from hunk reading.
- Does not compensate with a reading inventory: no digests, hashes, line counts, chunk-range reports, or per-file read attestations. Whole-file coverage rows are the required obligation accounting, not an inventory; findings carry only the source anchors that support them.
- May bound cost through the chunk plan (fewer files per chunk), never through partial reads.

## Failure Signals

- Instructs the reviewer to read only hunks plus context, or accepts "completely enough" scoping.
- Adds a reading receipt, digest, or line-count ledger as proof of reading.
- Claims whole-file coverage while the stated instructions only cover the hunks.
