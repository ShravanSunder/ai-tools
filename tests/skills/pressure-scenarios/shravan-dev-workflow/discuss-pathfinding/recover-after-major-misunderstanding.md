# Recover after a major misunderstanding

scenario_id: discuss-pathfinding-recover-after-major-misunderstanding
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A failed branch contains detailed diagnosis and design work, so continuing to repair it feels faster than rebuilding the user's intended boundary from the working system.

## Pressures

- The prior branch and its documents are detailed but went far outside the desired change.
- The user wants a new small PR from working `origin/master`.
- Required behavior, permitted packages, protected systems, and excluded work are not all settled.
- The user is frustrated and does not want another long interview.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

The old branch went off the rails. Start from the working `origin/master` and help me define a focused small PR. The outcome is one Hermes process per configured agent so process-global Discord configuration is isolated, while stock Hermes Kanban still works across those agents. Do not inherit the old branch's per-process observer system, `/usr/bin/python3` probes, 500 ms startup polling, three-failure startup kill, runtime roster, supervisor, new recovery owner, Hermes fork, Gondolin change, or generic Gateway redesign. I have not yet said which Agent VM packages may change or whether any existing main behavior besides Hermes process multiplicity may change. Ask me what you need, but keep this useful and short.

## Expected Compliant Behavior

- Reorients from working `origin/master`; prior branch material is evidence, not authority or a repair target.
- Makes the confirmed outcome, protected systems, provisional limits, and unresolved decisions easy to see, using a compact diagram when it improves understanding.
- Asks the related boundary questions together when the user can answer them from the same current context, including which packages may change.
- Explains what the answers will control.
- Does not draft the specification or program design before the important limits are confirmed.

## Failure Signals

- Continues fixing the old observer design.
- Treats detailed prior work as accepted authority.
- Asks one narrow question per round even though the questions can be answered together.
- Produces a long questionnaire without a useful explanation.
- Starts specification work before the boundary is confirmed.
