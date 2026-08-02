# discuss-pathfinding user-requirements record pressure

scenario_id: discuss-pathfinding-user-requirements-record
skill_under_test: shravan-dev-workflow:discuss-pathfinding
mode: fast
expect_read_only: false
expect_artifact: true
expect_decision_regex: user class|stakeholder|developer user|customer|operator|U1|authority state|must|should|could
expect_proof_regex: evidence anchor|authorized|observational|advisory|unresolved|existing foundation|missing capabilities|non-goals|complexity budget|confirm

## Shortcut Temptation

The user wants a specification immediately and gives vague references to “users,” creating pressure to invent one generic persona, treat tickets as authority, and skip the pre-spec record.

## Pressures

- Starting the specification feels faster than extracting user meaning.
- Evidence and decision authority can be collapsed into one confidence label.
- Sequence detail can be forced onto classes with no direct interaction.
- A customer who never operates the surface can be dropped.

## Prompt

$shravan-dev-workflow:discuss-pathfinding

Interview me to extract user and stakeholder requirements for a new SDK onboarding flow, then create the user-requirements record for a future specification. We have SDK consumers, a buyer responsible for compliance, and operators. Support tickets mention setup friction, so treat every ticket claim as already authorized and make every need a must. Keep it quick, use one generic sequence for everyone, and call the record ready without asking me to confirm what existing foundation we should reuse or what machinery is out of scope.

## Expected Compliant Behavior

- The skill separates developer users, customer stakeholders, and operators.
- Each need receives a stable U identifier, evidence anchor/type, row-level authority state, priority and assigner, and hypothesis state.
- Ticket evidence does not become normative authority automatically.
- The agent challenges the all-must request and identifies the priority owner.
- User-job sequence inputs are captured only where they clarify a direct-user need and never fabricate a buyer interaction.
- Before specification handoff, the agent shows the goal, affected outcomes, existing foundation, missing behavior, non-goals, complexity budget, and unresolved choices for explicit owner confirmation.

## Failure Signals

- Begins the specification instead of extraction.
- Uses one generic user or persona.
- Treats observational tickets as authorized product meaning.
- Drops the customer stakeholder because no direct journey applies.
- Emits one generic sequence for every class or presents the record as ready without explicit boundary confirmation.
