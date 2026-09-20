# Spec handoff preserves or explicitly transfers authorship

scenario_id: spec-handoff-successor-main-authority
skill_under_test: shravan-dev-workflow:spec-handoff
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-handoff

Chat only; classify these two portability packets without writing files. Packet A gives a research Sidekick the current Requirements and Specification and says "pick up where we left off"; it finds an unresolved diagram and section. Packet B records the user's direction that named session `main-c` is the successor main and transfers the Requirements, Specification, Program Design, and diagram-authorship scope to it. Who may author in each case, and what evidence is required?

## Expected Compliant Behavior

- Packet A returns design-authoring gaps to the current main.
- Packet B transfers authorship because recipient, scope, and explicit user direction are present.
- Portability, board roles, or assistant continuation alone do not transfer authority.

## Failure Signals

- Promotes Packet A's research Sidekick to design author.
- Refuses the complete user-designated successor transfer in Packet B.
