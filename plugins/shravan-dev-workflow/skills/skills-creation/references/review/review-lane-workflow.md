# Review Lane Workflow

This reference owns the dispatch and receipt lifecycle shared by spec and implementation review lanes. Stage references select lanes, lane references own their missions, and `manage-agents` owns reviewer runtime policy.

`lanes/lane-schema.md` owns the exact data contracts exchanged during review: status and verdict labels, the packet given to each reviewer, the receipt and finding returned by each reviewer, and the reduction filled by the parent. This workflow owns dispatch and parent receipt handling; stage references own lane selection; lane references own reviewer missions and rubrics.

Return the dispatch contract and the terminal receipt state for every selected lane.

## Dispatch Contract

Apply this contract to each lane selected by the calling review stage:

```text
MUST dispatch `<lane>` to a subagent using `<review packet>`.
Subagent loads `lane-schema.md` and `<lane>.md`.
Parallel-safe after the reviewed artifact exists; actual scheduling may serialize.
Instance authority follows the reviewer contract in `manage-agents` and stays equal to or narrower than the maximum authority in `<lane>.md`.
Return `<complete | partial | blocked receipt>`; parent verifies and reduces it.
```

MUST load the `manage-agents` skill to resolve the reviewer runtime and return the exact model and dispatch route before dispatch. Reviewers run as single-assignment Delegates in fresh context; per the reviewer contract in `manage-agents`, parent conversation history is `none` and workspace access is `read-only`. Any model outside the Delegate table — caller-directed or parent-chosen — is reported as a reviewer-runtime deviation in the run summary, not treated as a new pattern.

Each lane reads only its packet and named sources, so ready lanes may run in parallel.

## Receipt Lifecycle

```text
selected
  -> dispatched
  -> complete | partial | blocked | no-receipt
  -> parent verified
  -> accepted | rejected | unverified
  -> closed
```

Apply the status semantics from `lanes/lane-schema.md`; record silence as `no-receipt`.

The parent collects every receipt, verifies candidate findings against source, merges duplicates, resolves conflicts, derives changed-file coverage, and fills the Parent Reduction shape from `lanes/lane-schema.md`.

For proposal/design review, one permitted remediation is closed by parent verification against the original findings; this stage-specific rule overrides generic changed-text receipt invalidation, so do not redispatch lanes automatically. Text outside the accepted correction or with uncertain semantic effect stops for permission. For implementation review, changed text makes affected receipts stale and may select the next bounded review only while fewer than three remediation passes have completed. After remediation three, stop before another dispatch unless the user explicitly authorizes continuation.

Complete when: every selected lane has a terminal state, every receipt has been parent-verified, and the Parent Reduction shape is complete.
