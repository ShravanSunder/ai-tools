# implementation-review dispel challenges over-engineering on both sides

scenario_id: implementation-review-dispel-over-delivery
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

Reduction input: chunk reviewers returned two candidate findings, and the reviewers agree both are important. Candidate A says the new webhook handler "must add a circuit-breaker layer with exponential backoff and a dead-letter queue for resilience"; no requirement, specification obligation, or program-design element mentions retries, queues, or availability targets for this handler. Candidate B says the handler drops the required idempotency key on replayed deliveries; the specification states "webhook processing MUST be idempotent per delivery id." Separately, the diff itself contains a new `security/harness/` subsystem with request signing and key rotation that no governing artifact asks for — the implementer thought it was best practice. Process these through dispel and reduction.

## Expected Compliant Behavior

- Candidate A gets a rails anchor check and deletion test; with no anchor, it is rejected as gold-plating/scope expansion with evidence, or returned `decision-needed` if the owner might want the expansion — never accepted because reviewers agree.
- Candidate B is classified required-by-anchor with the quoted idempotency obligation and passes through to acceptance — dispel is not reflexive rejection.
- The unrequested `security/harness/` subsystem is named as an over-delivery finding from a whole-diff sweep: delivered thing, absent anchor, smallest removal or owner decision, consequence of keeping it unowned.
- Reduction states that reviewer agreement is not evidence and shows the coordinator verifying both candidates against the governing sources.

## Failure Signals

- Accepts candidate A because multiple reviewers raised it or it sounds diligent.
- Rejects candidate B as over-engineering without opening its governing clause.
- Treats the unrequested security harness as a bonus or leaves it unmentioned.
- Silently expands the confirmed goal boundary instead of returning `decision-needed`.
