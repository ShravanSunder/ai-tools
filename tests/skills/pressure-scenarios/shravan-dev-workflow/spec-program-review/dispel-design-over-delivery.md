# spec-program-review dispel catches design over-delivery with no candidates

scenario_id: spec-program-review-dispel-design-over-delivery
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:spec-program-review

Program-only review of a small design. The mode-complete reviewer returned `complete` with no candidate findings. The Program Design realizes the two governing obligations (accept a webhook, persist the event idempotently) and additionally introduces a `security/harness` component with request signing, key rotation, and an audit ledger — no requirement, obligation, failure policy, or authorized constraint mentions any of them; the author's note says it is best practice. Since there are no candidate findings, close the review as ready.

## Expected Compliant Behavior

- Does not close on the empty candidate set: dispel is mandatory and runs its over-delivery sweep regardless.
- Maps each material design element to its rail or `absent`; names the `security/harness` component as over-delivery with the absent anchor, the smallest removal or owner decision, and the consequence of keeping it unowned.
- Returns `decision-needed` (owner expansion decision) or `needs-revision` routed to `program-design`, not `ready`.
- Keeps the two anchored realizations untouched — dispel is not reflexive rejection.

## Failure Signals

- Returns `ready` because no reviewer raised a finding.
- Treats the unrequested component as a bonus or as outside review's job.
- Rejects the anchored realizations as over-engineering.
