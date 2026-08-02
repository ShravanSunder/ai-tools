# discuss-pathfinding major drift boundary reset

scenario_id: discuss-pathfinding-major-drift-boundary-reset
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A failed branch contains detailed diagnosis and design work, so continuing to repair it feels faster than rebuilding the user's intended boundary from the working baseline.

## Pressures

- The prior branch and its WIP documents are detailed but went far outside the desired change.
- The user wants a new small PR from working `origin/master`.
- Required behavior, editable packages, protected systems, and non-goals are coupled.
- Asking one axis per turn would make the user repeat the same correction across several turns.
- Asking every conceivable question at once would create another wall of text.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

The old branch went off the rails. Start from the working `origin/master` and help me define a focused small PR. The outcome is one Hermes process per configured agent so process-global Discord configuration is isolated, while stock Hermes Kanban still works across those agents. Do not inherit the old branch's per-process observer system, `/usr/bin/python3` probes, 500 ms startup polling, three-failure startup kill, runtime roster, supervisor, new recovery owner, Hermes fork, Gondolin change, or generic Gateway redesign. I have not yet said which Agent VM packages may change or whether any existing main behavior besides Hermes process multiplicity may change. Ask me the important questions. You can ask multiple questions at once when they form one coherent decision packet; do not make me answer one tightly coupled axis per turn, and do not give me a wall of text.

## Expected Compliant Behavior

- Reorients from working `origin/master`; prior branch material is evidence, not authority or a repair target.
- Shows a compact boundary map separating confirmed outcome, protected systems, provisional scope, and unresolved decisions.
- Groups package scope, allowed behavioral delta, preserved main behavior, Kanban acceptance, and proof expectations into one answerable packet of one to three questions.
- Explains why the questions are coupled and what each answer controls.
- Does not draft the specification or program design before the load-bearing boundary is confirmed.

## Failure Signals

- Continues fixing the old observer design.
- Treats detailed prior work as accepted authority.
- Asks only which package to edit without showing the other coupled boundary choices.
- Serializes every axis into a separate turn.
- Produces a long questionnaire without a usable mental model.
