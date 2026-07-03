# Great Skill Evaluation

Mission / stance:
Judge whether a skill is great enough to trust, using deterministic gates
instead of vibes.

When to use:
- An existing skill or draft needs a verdict.
- The user asks whether a skill is "great."
- A review needs the first required revision instead of a rewrite dump.

## Deterministic Verdicts

Allowed verdicts:

- `great`
- `targeted-revision`
- `significant-rewrite`
- `reject-or-restart`

Point thresholds:

| Score | Verdict |
| ---: | --- |
| 34-40 | `great` |
| 27-33 | `targeted-revision` |
| 19-26 | `significant-rewrite` |
| 0-18 | `reject-or-restart` |

Blocker overrides: a skill cannot receive `great` when it has the wrong
invocation trigger, missing workflow spine, link-only router body, no pressure
proof for behavior-changing guidance, unsafe sensitive-resource behavior, or
all-branch obligations hidden only in references.

## Scorecard

Score the skill across 40 points:

| Dimension | Points |
| --- | ---: |
| reusable job is clear | 3 |
| invocation tradeoff is deliberate | 3 |
| description is trigger-only and searchable | 4 |
| predictable workflow spine and information hierarchy | 5 |
| all-branch placement is correct | 3 |
| branch disclosure and progressive references are explicit | 3 |
| steps have checkable completion criteria | 4 |
| steering uses leading words or strong contracts | 3 |
| pressure/static proof is appropriate and separated | 5 |
| platform validation is named or explicitly not applicable | 3 |
| source adaptation and pruning quality are high | 4 |

How to inspect:
Score each dimension from evidence. Do not hide required gates in side notes:
predictable workflow, all-branch placement, branch disclosure, source
adaptation, platform validation, and proof separation must appear in the
structured scorecard or blocker overrides.

In chat evaluations, keep these labels visible even when no artifact is being
written:

```text
Required gate evidence:
- predictable workflow:
- all-branch placement:
- branch disclosure:
- source adaptation:
- platform validation:
- proof separation:
```

Do not substitute nearby prose such as "biggest problem" or "loaded the
reference" for these required gate labels.

When the first required revision changes wording, output shape, omitted slots,
conditional behavior, invocation, reference retrieval, or completion criteria,
also return the failure-form choice from `steering-and-wording.md`. If that
reference has not been loaded, set `failure-form choice: deferred until
steering-and-wording.md` and mark that file as the next branch.

Good signals:
- verdict is one allowed value
- blocker overrides are applied before praise
- evidence backs every score
- first required revision is the smallest useful change
- retest requirement follows the revision

Bad signals:
- `great` despite missing workflow spine or pressure proof
- subjective praise without verdict semantics
- first revision is "rewrite it all"
- platform validation or proof separation buried in prose

Unique return labels:
Use these labels when evaluating a skill. Keep the labels literal in chat; do
not rename `highest risk` to a nearby phrase such as "largest issue."

```text
verdict:
score:
blocker overrides:
evidence by dimension:
required gate evidence:
highest risk:
first required revision:
failure-form choice:
retest requirement:
next branch:
```
