# Decision Synthesis

Use this when reducing multiple review lanes.

## Classification

- `accepted`: valid, evidence-backed, and changes the spec/plan.
- `contested`: valid disagreement or tradeoff that needs an owner decision.
- `open`: missing evidence, blocked by unknowns, or needs user input.
- `rejected`: unsupported, technically wrong, duplicate, YAGNI, or outside scope.

## Reducer Rules

- Verify findings against the artifact and repo before accepting.
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
