# Great Skill Evaluation

Load trigger: an existing skill or draft needs a quality verdict, scorecard, or
first required revision.

Carry in: skill files, intended trigger, authoring receipt, source inspirations,
pressure/static proof, and known user acceptance criteria.

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
| all-branch placement is correct | 4 |
| branch disclosure and progressive references are explicit | 4 |
| steps have checkable completion criteria | 4 |
| steering uses leading words or strong contracts | 4 |
| pressure/static proof is appropriate and separated | 5 |
| platform validation is named or explicitly not applicable | 3 |
| source adaptation and pruning quality are high | 4 |

Each dimension needs evidence. Do not hide required gates in side notes:
predictable workflow, all-branch placement, branch disclosure, source
adaptation, platform validation, and proof separation must each appear in the
structured scorecard or in blocker overrides.

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
reference has not been loaded, use the failure-form names from the main
workflow and mark `steering-and-wording.md` as the next branch.

## Return Artifact

```text
verdict:
score:
blocker overrides:
evidence by dimension:
required gate evidence:
  predictable workflow:
  all-branch placement:
  branch disclosure:
  source adaptation:
  platform validation:
  proof separation:
highest risk:
first required revision:
failure-form choice:
retest requirement:
next branch:
```

Completion criterion: the verdict is one allowed value, evidence supports each
dimension, the highest risk is named, and the next revision is the first
smallest change instead of a vague rewrite command.

Source material adapted: Matt's predictability and hierarchy vocabulary; the
local SOP scorecard thresholds; Superpowers' pressure-proof requirement.
Rejected: subjective praise without verdict semantics. This branch does not
duplicate all-branch workflow state from `SKILL.md`.
