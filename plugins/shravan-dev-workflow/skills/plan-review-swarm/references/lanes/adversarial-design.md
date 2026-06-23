# adversarial-design

Status: default focused lane for substantial plan review.

Mission / stance:
Break confidence in the plan's assumptions, tradeoffs, contradictions, and
omitted alternatives before implementation starts. This lane looks for the few
cruxes that could invalidate the plan, not a long list of nits.

Trigger examples:
- The plan chooses one path among plausible alternatives.
- The plan depends on assumptions, deferred decisions, tradeoffs, or optimistic
  sequencing.
- Reviewers are likely to rubber-stamp because other lanes found local coverage.

Why this lane matters:
Focused lanes can each pass while the plan is still fragile because the chosen
approach rests on an untested assumption or avoidable tradeoff.

Default scope:
Accepted source artifact, produced plan, assumptions, non-goals, risks,
tradeoffs, rejected alternatives, human-decision points, proof gaps, and route
backs.

Parent packet requirements:
- accepted source artifact path and source constraints
- produced plan path and assumptions/tradeoff sections
- known alternatives or rejected approaches
- unresolved user decisions
- parent routing summary marked as non-evidence

Evidence priority:
1. Plan assumptions, tradeoffs, non-goals, and route-back notes.
2. Accepted source constraints that make an assumption load-bearing.
3. Live repo evidence only when it falsifies or supports a crux assumption.
4. Other lane outputs only as candidate contradictions.

Analysis method:
Identify one to three crux assumptions. For each, ask what would falsify it, how
implementation would fail if false, whether a simpler safer plan exists, and
what smallest plan edit or proof step would reduce the risk.

Prioritized smells / failure signals:
- plan confidence depends on an unstated assumption;
- source constraint and plan tradeoff point in different directions;
- simpler or safer path is omitted without cost explanation;
- proof gate cannot falsify the risk it is supposed to cover;
- human decision hidden as implementation detail;
- many local findings obscure one global crux.

Escalation / materiality bar:
- blocker: a crux assumption could invalidate the plan and has no falsifier,
  decision, or route-back.
- important: tradeoff may be acceptable but the plan hides its cost or proof
  burden.
- question: human choice is required because multiple valid paths remain.

Overlap boundary:
Do not duplicate `spec-compliance`, `execution-scope`, or
`testability-validation` unless the issue is a plan-level crux. Route local
source, execution, architecture, proof, or security defects to the owning lane.

Cannot-verify boundary:
Return `cannot_verify_from_focused_packet` for whole-plan readiness or detailed
implementation feasibility that requires code changes or full execution.

Output extras:
Include a crux row: assumption -> falsifier -> failure path -> simpler option
or smallest proof step -> route-back.

Advisory boundary:
This lane does not choose the final plan. It identifies decision-critical risks
for parent reduction.

Parent handoff notes:
Parent-accepted crux findings route to `plan-creation-swarm` unless the crux is
caused by missing source intent, in which case route to `spec-creation-swarm`.
