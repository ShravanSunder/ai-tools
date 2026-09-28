# Review the Draft Plan

## The Contract

Main reviews the draft plan in its own session against its governing basis and the current-source anchors it cites; when the project has an 🦉 Advisor, Main sends it the same inputs. Each point carries a plan anchor, the problem, and a suggested change. Main records take or decline, with a reason, for every point; the Advisor advises and never approves.

## Who Takes Part

A 🐒 Sidekick, 🛠️ Worker, or 🔎 Review Sidekick does not review or re-cut the draft.

## How to Read the Draft

Read the draft as the executor who will receive it, with only the plan and its cited sources.

1. **Tier records.** For each Workhorse slice, reopen the cited source at the slice's base and check each Workhorse fit condition (tier record, canonical). For each Daily-driver slice, confirm its escalation reason is real.
2. **Throughput checkpoint.** Both Throughput Checkpoint items in `slice-and-proof-design.md` are filled, and every `independent` mark passes the shared-write check.
3. **Boundaries and seams.** No slice crosses an assigned authority or contract boundary it does not name, and every dependency is declared; every node passes Eligible (PR Independence Test).
4. **Proof.** Every obligation maps to proof that can observe it, per `slice-and-proof-design.md`.
5. **Bundles.** No slice carries several independent units that one session would otherwise receive as one assignment.

Good point: `slice S4 · records Workhorse, but the deadline handler it observes has no completion signal at base (only clock continuations) · add contract slice S3a that exposes completion, or tag S4 Daily driver with judged tough: no completion seam at base and no contract slice can add one`.

Weak point: `S4 might be risky`. It names no anchor, no problem the executor would hit, and no change, so it cannot be taken or declined.

## Dispositions

Record each point as `take: <change made>` or `decline: <reason>` beside its anchor in the trace through `practices-show-me-your-work`, never in the plan file, and revise the draft for every take. With an Advisor, send the changed slices back once; a second round of new points follows the same dispositions and does not reopen settled ones. An unresolved disagreement with the Advisor is Main's call; a point that exposes a missing design decision returns the plan as `revision-requested` to its semantic owner instead of `ready`.

Completion: every point has a take or decline with a reason and the draft reflects every take.
