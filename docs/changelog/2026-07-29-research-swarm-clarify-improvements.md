# 2026-07-29 Research Swarm Epistemics And Mental-Model Repair Improvements

Plugin: `shravan-dev-workflow` 1.6.72 (same unreleased version as the discuss-pathfinding entry)

## User-visible behavior

- `research-swarm` adopts evidence epistemics from admired sources (luna research pass over pstack/why, mattpocock research, addyosmani source-driven and doubt-driven development):
  - citations sit at the claim; a load-bearing conclusion enters `supported` only with a primary anchor or an explicitly labeled gap;
  - null results are first-class evidence — verbatim queries recorded for what was searched (including nothing found) and reasons for what was not searched;
  - competing hypotheses presented side by side with evidence for and against; no forced winner;
  - findings carry states: `lead → investigated → accepted | refuted | unresolved`; zero accepted findings is a valid result;
  - optional bounded fresh-context countercheck before synthesis when a conclusion is load-bearing or embeds the user's own hypothesis;
  - `evidence-ledger.md` owns the full parent ledger shape (coverage, states, hypotheses, parent disposition); lane-packets' duplicate section is now a pointer. One prune overruled deliberately: tool-routing's per-tool bullets stay — no owning tool skills exist for those routes.
- `discuss-clarify-mental-models` (name kept by user decision) narrows and sharpens as repair:
  - stance names the boundary: a map that was never built cannot be repaired — extraction belongs to `discuss-pathfinding`;
  - the `model` field now names a falsifiable repair target every later field answers to;
  - `countercase` reconciles every challenge into one of four dispositions (repair the model / bounded evidence gap / enrich the model / dismiss as preference) — a countercase with no disposition is a hedge;
  - `rebuilt_model` carries each changed canonical term and the old interpretation it replaces;
  - IF the repaired map gates a spec, plan, or irreversible decision: one bounded fresh-context divergent reviewer asks what the repaired map still fails to explain.

- `skills-creation` gains the depth-teaching gate, completing the pipeline its step 2 supplies: `Place the depth` requires every promised stage to name a teaching owner (what to inspect, what good and bad look like, when to stop — written from the step-2 sourcing records or a named source; shape-only references are ceremony with a named consumer, never a stage's owner); a new `depth-coverage` review lane runs at both spec review (proposals carry the promised stages and planned tree) and implementation review (both the body and reference-text rows), with reciprocal overlap boundaries in placement-and-calls, no-op-pruning, and steering-strength; a Completion Blocker backstops the run. This re-lands the lesson from the recorded schema-only-references failure, without the discarded attempt's inventory bureaucracy.

## Parked recommendations (recorded, not implemented — user decisions)

- Artifactization (settled discussion → PRD/spec → vertical-slice issues; from mattpocock to-prd/to-issues): planning territory, later effort.
- Domain-modeling as a standalone skill: no — its home is the program-design half of the future spec-design workflow.
- Prototype-to-decide (smallest throwaway experiment answers a named design question; mattpocock prototype + pstack poteto playbook): separate skill, later.
- Wayfinder-style multi-session map: skip until the existing goal/handoff model proves insufficient.

## Changed surfaces

- `skills/research-swarm/SKILL.md`, `references/evidence-ledger.md`, `references/lane-packets.md`
- `skills/discuss-clarify-mental-models/SKILL.md`

## Validation

- Sourced from three luna research lanes over the admired collections (session evidence; verdict-level reductions in the discuss-pathfinding evidence file's shaping records).
- `claude plugin validate .`: passed at commit.
- Proof route: proof gap, user-accepted — no pressure testing per user direction; behavior not evaluated.
