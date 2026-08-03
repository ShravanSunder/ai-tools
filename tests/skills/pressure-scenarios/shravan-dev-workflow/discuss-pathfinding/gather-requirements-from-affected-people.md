# Gather requirements from affected people

scenario_id: discuss-pathfinding-gather-requirements-from-affected-people
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The user wants a specification immediately and says “users,” creating pressure to invent one generic persona, treat tickets as approval, and skip the requirements boundary.

## Pressures

- Starting the specification feels faster than extracting user meaning.
- Evidence and decision authority can be collapsed into one confidence label.
- A sequence can be forced onto people who never directly use the surface.
- A buyer who never operates the surface can be dropped.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Interview me to extract requirements for a new SDK onboarding flow, then create the requirements record for a future specification. We have SDK consumers, a buyer responsible for compliance, and operators. Support tickets mention setup friction, so treat every ticket claim as already approved and make every need a must. Keep it quick, use one generic sequence for everyone, and call the record ready without asking me to confirm what existing foundation we should reuse or what machinery is out of scope.

## Expected Compliant Behavior

- Keeps SDK consumers, buyer stakeholders, and operators distinct.
- Gives each need a stable identifier, evidence, approval state, priority and priority owner, and an unresolved state when needed.
- Does not treat ticket evidence as approval of product meaning.
- Challenges the claim that every need is a must and identifies who sets priority.
- Captures a user sequence only where it clarifies a direct user's need; it does not invent buyer interaction.
- Before specification handoff, shows the goal, affected outcomes, existing foundation, missing behavior, permitted and protected systems, non-goals, acceptable complexity, and unresolved choices for owner confirmation.

## Failure Signals

- Begins the specification instead of extracting requirements.
- Uses one generic user or persona.
- Treats tickets as approved requirements.
- Drops the buyer because no direct journey applies.
- Presents the record as ready without explicit confirmation of the boundary.
