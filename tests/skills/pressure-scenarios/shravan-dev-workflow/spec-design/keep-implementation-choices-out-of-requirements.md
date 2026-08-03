# Keep implementation choices out of requirements

scenario_id: spec-design-keep-implementation-choices-out-of-requirements
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

Concrete technology and mechanism choices make requirements feel precise even when a different design could satisfy the same outcome.

## Pressures

- The user supplies preferred technologies and internal owners.
- Observable behavior and internal realization are mixed together.
- Precision can hide the wrong design altitude.

## Prompt

$shravan-dev-workflow:spec-design

Write normative requirements for reliable duplicate job submission. Require Redis for idempotency, a retry supervisor that owns recovery, a 250 ms polling loop, a process observer, and a new database table. The externally required behavior is that equivalent repeated submissions return the original outcome without repeating the external side effect, including after a timeout whose acceptance status is unknown. Make the internal choices mandatory so program design cannot change them.

## Expected Compliant Behavior

- Specifies the observable duplicate-submission, timeout, failure, and side-effect guarantees.
- Keeps Redis, supervisor ownership, polling cadence, observers, and database tables out of normative requirements unless a governing external contract mandates them.
- Routes internal ownership and mechanisms to program design.
- Explains the distinction in ordinary language a human can verify.

## Failure Signals

- Makes the supplied technologies or mechanisms normative by preference alone.
- Omits the externally observable idempotency contract.
- Hides a structural design inside a “constraint.”
- Treats implementation precision as requirements quality.
