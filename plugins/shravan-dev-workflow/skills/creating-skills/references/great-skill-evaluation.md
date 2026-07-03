# Great Skill Evaluation

Judge whether a skill or draft is great enough to trust, using deterministic
verdicts instead of vibes.

Load this when an existing skill or draft needs a verdict, when the user
asks whether a skill is "great," or when a review needs the first required
revision instead of a rewrite dump.

## Deterministic Verdicts

Allowed verdicts: `great`, `targeted-revision`, `significant-rewrite`,
`reject-or-restart`.

Blocker overrides: a skill cannot receive `great` when it has the wrong
invocation trigger, a missing workflow spine, a link-only router body, no
pressure proof for behavior-changing guidance, unsafe sensitive-resource
behavior, or all-branch obligations hidden only in references. Apply blocker
overrides before scoring anything else.

## Evidence Checklist

Cover each item with real evidence, not a number. There is no point total;
the checklist itself is the gate.

- reusable job is clear
- invocation tradeoff is deliberate (context load vs cognitive load)
- description is trigger-only and searchable
- predictable workflow spine and information hierarchy
- all-branch placement is correct -- nothing branch-only sits in `SKILL.md`
- branch disclosure and progressive references are explicit
- steps have checkable completion criteria
- wording uses leading words or strong contracts, not prohibition lists
- pressure proof and structural proof are both present
- platform validation is named or explicitly not applicable
- source adaptation and pruning quality are high

## Reporting

Report, in order: verdict, a `blocker overrides:` line naming which ones
apply or stating `none`, evidence against the checklist above, highest risk,
first required revision, and a retest requirement. The first required
revision is the smallest useful change -- never "rewrite it all."

When the first required revision changes wording, output shape, an omitted
slot, conditional behavior, invocation, reference retrieval, or a completion
criterion, also name the failure-form choice by citing the matching row of
the guidance-form table in the target skill's `SKILL.md` step 3 ("Design the
surface").
