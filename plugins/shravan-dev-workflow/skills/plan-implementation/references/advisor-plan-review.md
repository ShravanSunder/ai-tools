# Review the Draft Plan

Main reviews its own full draft plan before it returns `ready`, because a ready plan is immutable and the next reader is an executor who follows it literally. Return every review point with its disposition, or the skip reason for a compact plan.

## The Contract

Main reviews the draft plan against its governing basis and the current-source anchors it cites; when the project has an 🦉 Advisor, Main sends it the same inputs. Each review returns points, each with a plan anchor, the problem, and a suggested change. It checks: every Workhorse slice passes Workhorse fit and every other slice names the condition it misses; the throughput checkpoint is filled and each slice marked independent really has disjoint writes and its own proof; no slice crosses a boundary or needs a seam the plan does not name; every obligation has fitting proof; no slice bundles independent units. Main records take or decline, with a reason, for every point and revises the draft; with an Advisor, changed slices go back to it once. The Advisor's agreement is not required to proceed; Main owns the plan and its `ready` result. The review is done when every point has a disposition.

Workhorse fit lives in `../../manage-agents/references/model-catalog.md`; the executor record lives in `../../../shared-references/canonical-implementation-plan.md`.

## Who Takes Part

Main performs this review in its own session. Use an Advisor only when the owner already requested one for the project; do not create an Advisor for plan review. The Advisor advises and never approves. A 🐒 Sidekick, 🛠️ Worker, or 🔎 Review Sidekick does not review or re-cut the draft.

A compact plan (one low-risk owner and one or two proof gates, per `slice-and-proof-design.md`) may skip this review. Record the reason in the trace and return it with the planning result, for example `plan review skipped: one owner, one proof gate`. The plan file carries no reviewer status, per the canonical contract.

## How to Read the Draft

Read the draft as the executor who will receive it, with only the plan and its cited sources.

1. **Executor records.** For each Workhorse slice, reopen the cited source at the slice's base. Confirm the inputs are pinned, the output is checkable, the stop is named, and every seam, signal, event, or API the slice relies on exists there and supports the observation the slice needs. A name that matches in the brief is not a seam that exists. For each Daily-driver slice, confirm the missing condition is real and named.
2. **Throughput checkpoint.** All five items are present, and every choice a later slice depends on is either written in the plan or named as left to an Opus Sidekick with its reason, each filled or `n/a: <reason>`. For every slice marked independent, compare its write surfaces with every slice that may run beside it (files, fixtures, generated artifacts, state) and confirm it has its own proof.
3. **Boundaries and seams.** No slice crosses an owner or domain boundary it does not name, and no slice depends on a seam that neither exists at base nor is added by an earlier contract slice.
4. **Proof.** Every obligation maps to proof that can observe it, per `slice-and-proof-design.md`.
5. **Bundles.** No slice carries several independent units that one session would otherwise receive as one assignment.

Good point: `slice S4 · records Workhorse, but the deadline handler it observes has no completion signal at base (only clock continuations) · add contract slice S3a that exposes completion, or tag S4 Daily driver with "seam missing"`.

Weak point: `S4 might be risky`. It names no anchor, no problem the executor would hit, and no change, so it cannot be taken or declined.

## Dispositions

Record each point as `take: <change made>` or `decline: <reason>` beside its anchor in the trace through `practices-show-me-your-work`, never in the plan file, and revise the draft for every take. With an Advisor, send the changed slices back once; a second round of new points follows the same dispositions and does not reopen settled ones. Stop when every point has a disposition. An unresolved disagreement with the Advisor is Main's call; a point that exposes a missing design decision returns the plan as `revision-requested` to its semantic owner instead of `ready`.

Completion: every point has a take or decline with a reason and the draft reflects every take, or a compact plan records its skip reason.
