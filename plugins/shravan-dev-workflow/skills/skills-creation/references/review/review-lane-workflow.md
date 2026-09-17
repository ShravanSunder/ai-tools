# Review Lane Workflow

This reference owns the dispatch and receipt lifecycle shared by spec and implementation review lanes. The orchestrator commissions the persistent independent review lead; the lead runs this workflow and reduces lanes. Stage references select lanes, lane references own their missions, and `manage-agents` owns reviewer runtime policy.

`lanes/lane-schema.md` owns the exact data contracts exchanged during review: status and verdict labels, the packet given to each lane Worker, the receipt and finding returned by each Worker, and the reduction filled by the review lead. This workflow owns dispatch and review-lead receipt handling; stage references own lane selection; lane references own Worker missions and rubrics.

Return the dispatch contract and the terminal receipt state for every selected lane.

## Dispatch Contract

Apply this contract to each lane selected by the calling review stage:

```text
MUST dispatch `<lane>` to a fresh native lane Worker using `<review packet>`.
Worker loads `lane-schema.md` and `<lane>.md`.
Parallel-safe after the reviewed artifact exists; actual scheduling may serialize.
Instance authority follows the reviewer contract in `manage-agents` and stays equal to or narrower than the maximum authority in `<lane>.md`.
Return `<complete | partial | blocked receipt>`; the review lead verifies and reduces it.
```

The orchestrator creates or resumes the independent persistent review lead before handing off this workflow. The assigned lead MUST load `manage-agents` to select each native lane Worker's runtime, model, history, and access. The lead starts without author context and retains only its own review history through corrections; it never selects another lead. Each lane is a fresh native Worker with no author or review-lead history, read-only workspace access, and the authority in its lane reference. Lane Workers do not create review leads or recursively dispatch.

Each lane reads only its packet and named sources, so ready lanes may run in parallel.

## Receipt Lifecycle

```text
selected
  -> dispatched
  -> complete | partial | blocked | no-receipt
  -> review lead verified
  -> accepted | rejected | unverified
  -> closed
```

Apply the status semantics from `lanes/lane-schema.md`; record silence as `no-receipt`.

The review lead collects every receipt, verifies candidate findings against source, merges duplicates, resolves conflicts, derives changed-file coverage, and fills the Parent Reduction shape from `lanes/lane-schema.md`. In that shape, `parent` means this immediate review lead relative to a lane. The orchestrator then makes final disposition and delivery routing from the lead's assessment.

For proposal/design review, the same lead closes one permitted remediation by verifying it against the original findings. This stage-specific rule overrides generic changed-text receipt invalidation, so do not redispatch lanes automatically. Text outside the accepted correction or with uncertain semantic effect stops for permission. For implementation review, changed text makes affected receipts stale and may select the next bounded review only while fewer than three remediation passes have completed. After remediation three, stop before another dispatch unless the user explicitly authorizes continuation.

Complete when: every selected lane has a terminal state, every receipt has been review-lead-verified, and the Parent Reduction shape is complete.
