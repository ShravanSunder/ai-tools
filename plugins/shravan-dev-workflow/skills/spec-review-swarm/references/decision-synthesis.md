# Decision Synthesis

Use this when reducing multiple review lanes.

## Classification

- `accepted`: valid, evidence-backed, and changes the spec/plan.
- `contested`: valid disagreement or tradeoff that needs an owner decision.
- `open`: missing evidence, blocked by unknowns, or needs user input.
- `rejected`: unsupported, technically wrong, duplicate, YAGNI, or outside scope.

## Reducer Rules

- Verify findings against the artifact and repo before accepting.
- Verify each substantial lane receipt lists the draft spec/design artifact or
  full chat-only draft packet with stable anchors in `primary_sources_loaded`.
- Treat summary-only packets as invalid for substantial review readiness.
- Confirm a `whole-picture-spec-coverage` lane or explicit parent coverage pass
  handled source coverage, traceability, contradictions, dropped/invented
  obligations, and `cannot_verify_from_focused_packet` gaps.
- Reject or mark open findings sourced only from parent routing summaries.
- Treat research ledgers and prior lane files as corroboration, not source
  truth.
- Compare accepted findings back to primary source anchors and record coverage
  gaps separately from lane opinions.
- Merge duplicates by root cause.
- Keep real disagreement visible.
- Prefer smallest spec/plan edits over broad rewrites.
- Do not bury security proof gaps in general risk prose.

## Report Skeleton

```text
Verdict:
<ready | needs revision | blocked | decision-needed>

What held:
- <design spine that survived review>

Accepted:
- <finding, evidence, smallest edit, proof>

Contested:
- <tradeoff, options, recommended default, decision owner>

Open:
- <question, why it blocks or does not block execution>

Rejected:
- <only include when a high-severity rejected claim might confuse the owner>
```
