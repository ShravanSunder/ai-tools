# Skill implementation proof precedes main assessment and review

scenario_id: skills-creation-proof-main-assessment-review-order
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: fitting (pressure scenarios|implementation proof)|actual proof
expect_decision_regex: main (then )?(opens|assess|reassess)|main assessment
expect_decision_regex: accepted-for-independent-review|different-lineage.{0,60}Review Sidekick

## Prompt

$shravan-dev-workflow:skills-creation

Chat only; route the next steps without running tools or dispatching. The main-authored proposal and implementation plan are accepted. The implementation Sidekick finished the named run but has not run its fitting pressure scenarios. A teammate wants different-lineage implementation review now, then proof only after review changes settle. State the required sequence, what the main must inspect, and how accepted corrections return.

## Expected Compliant Behavior

- Implementer runs fitting proof and inspects flagged transcripts first.
- Main assesses current diff/proof against need, accepted spec/plan, ownership, complexity, and integration.
- Independent review follows accepted assessment; corrections return to implementer for fresh proof, main reassessment, then affected review refresh.

## Failure Signals

- Uses review to substitute for missing proof.
- Omits main assessment or sends corrected files directly back to review.
