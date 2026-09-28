# Review the Draft Plan

Main reviews its own full draft plan before it returns `ready`. Return every review point with its disposition, or the skip reason for a compact plan.

## The Contract

Main reviews the draft plan against its governing basis and the current-source anchors it cites; when the project has an 🦉 Advisor, Main sends it the same inputs. Each point carries a plan anchor, the problem, and a suggested change. Main records take or decline, with a reason, for every point; the Advisor advises and never approves. The review is done when every point has a disposition.

## Who Takes Part

Main performs this review in its own session. Use an Advisor only when the owner already requested one for the project; do not create an Advisor for plan review. A 🐒 Sidekick, 🛠️ Worker, or 🔎 Review Sidekick does not review or re-cut the draft.

A compact plan (one low-risk owner and one or two proof gates, per `slice-and-proof-design.md`) may skip this review. Record the reason in the trace and return it with the planning result, for example `plan review skipped: one owner, one proof gate`.

## How to Read the Draft

Read the draft as the executor who will receive it, with only the plan and its cited sources.

1. **Tier records.** For each Workhorse slice, reopen the cited source at the slice's base and check each Workhorse fit condition (`../../manage-agents/references/model-catalog.md`); a name that matches in the brief is not a seam that exists. For each Daily-driver slice, confirm the missing condition is real and named.
2. **Throughput checkpoint.** Every item in the Throughput Checkpoint in `slice-and-proof-design.md` is filled or `n/a: <reason>`; for every slice marked independent, compare its write surfaces with every slice that may run beside it and confirm its own proof.
3. **Boundaries and seams.** No slice crosses an assigned authority or contract boundary it does not name, and every dependency is declared. A seam the PR takes from outside itself that is missing at the PR's actual base leaves the node pending or returns its gap, under the PR Independence Test in `slice-and-proof-design.md`.
4. **Proof.** Every obligation maps to proof that can observe it, per `slice-and-proof-design.md`.
5. **Bundles.** No slice carries several independent units that one session would otherwise receive as one assignment.

Good point: `slice S4 · records Workhorse, but the deadline handler it observes has no completion signal at base (only clock continuations) · add contract slice S3a that exposes completion, or tag S4 Daily driver with "seam missing"`.

Weak point: `S4 might be risky`. It names no anchor, no problem the executor would hit, and no change, so it cannot be taken or declined.

## Dispositions

Record each point as `take: <change made>` or `decline: <reason>` beside its anchor in the trace through `practices-show-me-your-work`, never in the plan file, and revise the draft for every take. With an Advisor, send the changed slices back once; a second round of new points follows the same dispositions and does not reopen settled ones. Stop when every point has a disposition. An unresolved disagreement with the Advisor is Main's call; a point that exposes a missing design decision returns the plan as `revision-requested` to its semantic owner instead of `ready`.

Completion: every point has a take or decline with a reason and the draft reflects every take, or a compact plan records its skip reason.
