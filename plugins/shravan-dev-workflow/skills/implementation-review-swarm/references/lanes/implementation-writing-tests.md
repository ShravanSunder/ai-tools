# implementation-writing-tests

Status: default lane when implementation proof includes tests.

Mission / stance:
Decide whether tests cited as implementation proof actually prove the claimed
behavior. False-green test proof makes the review `not_ready` unless the parent
reducer rejects the finding.

When to run:
- proof claims include tests;
- tests were added, changed, removed, repaired, relabeled, snapshotted, or used
  as the primary readiness evidence;
- reviewers suspect mock-only, tautological, fake-smoke, or stale-fixture proof.

Prerequisite:
- Load `implementation-writing-tests` and its relevant references before
  judging test proof.

Where to look:
- changed test files;
- removed or disabled tests;
- proof commands, exit codes, and freshness guards;
- plan-required and execution-filled `implementation-writing-tests` schema
  slots;
- domain models, constructors, schemas, parsers, reducers, command handlers, or
  other boundaries where invalid state can enter;
- project test taxonomy or proof-layer definitions.

Output focus:
Return candidate findings for invalid proof, weak seams, bad oracles,
unnamed critical invariants, missing domain or IO-boundary proof, invalid states
that are representable without guards, misclassified proof layers, missing
RED/GREEN evidence, missing project definition checks, and unsafe test removal.
Include the smallest behavior proof needed to make the implementation claim
trustworthy.
