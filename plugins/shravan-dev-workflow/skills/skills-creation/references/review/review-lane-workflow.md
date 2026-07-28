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
Instance authority is the reviewer contract in `manage-agents`.
Return `<complete | partial | blocked receipt>`; parent verifies and reduces it.
```

MUST load `../../../manage-agents/SKILL.md` to select the reviewer runtime and return the reviewer history and workspace-access decision before dispatch.

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

A `complete` receipt lists every required item opened and meets the lane's stop condition. A `partial` receipt names what remains. A `blocked` receipt names the missing input. Record silence as `no-receipt`.

The parent collects every receipt, verifies candidate findings against source, merges duplicates, resolves conflicts, derives changed-file coverage, and fills the Parent Reduction shape from `lanes/lane-schema.md`.

A receipt expires when the reviewed text changes. Re-dispatch every lane whose reviewed text a fix touched before closing the review.

Complete when: every selected lane has a terminal state, every receipt has been parent-verified, and the Parent Reduction shape is complete.
