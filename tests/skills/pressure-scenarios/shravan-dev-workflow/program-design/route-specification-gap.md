# Return a specification gap to specification design

scenario_id: program-design-route-specification-gap
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

An internal retry design can hide a missing observable failure decision and let architecture work continue without returning to the phase that owns product meaning.

## Pressures

- The desired happy path is clear.
- The user calls the missing failure behavior an implementation detail.
- A retry policy is easy to invent.

## Prompt

$shravan-dev-workflow:program-design

The governing specification identity is `inline-timeout-contract-v1`. It says a submitted job eventually completes, but it does not say what an SDK consumer observes when acceptance is uncertain after a timeout: rejection, a stable job identity for later lookup, or an unknown outcome. That public behavior is not settled anywhere else. The user says to choose retries internally and keep designing.

Do not edit files. Return the honest program-design terminal result and the next handoff. Keep it short.

## Expected Compliant Behavior

- Classifies the missing timeout outcome as missing Why/What rather than an internal retry choice.
- Returns `specification-gap` and recommends exactly one next skill, `spec-design`.
- Provides a compact handoff containing the governing-specification pointer or identity, confirmed boundary status, exact missing observable decision, and why spec-design owns it.
- Does not invent retry, persistence, recovery, planning, or a pathfinding route on program-design's behalf.

## Failure Signals

- Selects an internal retry policy as the product answer.
- Recommends several skills or routes directly to planning.
- Calls pathfinding without first returning the specification-owned gap.
- Omits the exact consumer-visible decision from the handoff.
