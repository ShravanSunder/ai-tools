# 2026-07-26 Skills Creation Review Lanes

Plugin: `shravan-dev-workflow` 1.6.63

## User-visible behavior change

`skills-creation` review changed from two vague perspective gates to named
content lanes dispatched in proportion to what changed.

Before, both review steps said "use two read-only perspectives:
`fresh-perspective` plus a second independent local perspective." That named
*who* reviews, which `manage-agents` already owns, and never named *what to
check*. Reviews checked contract conformance thoroughly and skill quality
barely.

Now `SKILL.md` carries a `Review Lanes` section that selects lanes by changed
surface and dispatches each to a fresh-context subagent:

```text
mechanical: typo, version, metadata  -> none; static validation only
reference text only                  -> consistency, pruning
SKILL.md body                        -> + structure-and-constraints, steering,
                                          mental-model
frontmatter or description           -> + trigger
a behavior-proof claim exists        -> + proof-claim
scripts, hooks, assets, manifests    -> + sensitive-surface
two or more lanes returned receipts  -> + collector
```

The mechanical row is exclusive; the rest accumulate.

Reviewers are `Delegate`s per `manage-agents`: one bounded assignment, no
session history, discarded after the receipt. Reviews are never forked from the
authoring session, because a forked reviewer inherits the author's
rationalizations.

Workflow steps 9-11 became one review-then-prove loop. Proof now runs after
review rather than between the two review gates, so a proof run is not spent on
text the review is about to change.

## Changed surfaces

- Added `skills/skills-creation/references/lanes/` with nine lane contracts:
  `consistency`, `pruning`, `structure-and-constraints`, `steering`,
  `mental-model`, `trigger`, `proof-claim`, `sensitive-surface`, `collector`.
  Each states a stable maximum authority of read-only, per
  `reference-lanes-design.md`.
- `skills/skills-creation/SKILL.md`: added `Review Lanes`; rewrote steps 9-11
  as review -> collector -> parent reduce -> fix -> prove -> re-review. Step 6
  now owns writing call sites, including dispatch sites and the shared-contract
  option.
- Completion Blockers went from 15 to 17. The dispatch blocker was amended to
  accept a named shared dispatch contract instead of requiring six fields at
  every call site. Two were added: review running outside the Review Lanes
  contract (wrong lane set, a forked reviewer, or a reused stale receipt), and
  implementation deviating from the accepted spec without naming it.
- `Scaled Run Note` gained `review lanes dispatched:` and `lane receipts:`.
- Renamed `references/skill-review-output-schema.md` to
  `references/skill-review-lane-schema.md` to match the shared-shape naming in
  `reference-lanes-design.md`. Added a `Collector Synthesis` block so the
  collector's output has slots; removed the `provider` field, which conflated
  content-lane identity with model provider (runtime facts belong to
  `manage-agents`); added `lane` to the allowed surface labels.
- `references/skill-spec-review.md` and `references/skill-implementation-review.md`:
  removed the provider-axis perspective lists and the rubric lines that
  restated lane qualification, caller forms, authority, and shape families.
  Those checks now have one owner each. Both references keep verdicts, blocker
  overrides, coverage, and reduction.
- `references/reference-design.md`: added `references/lanes/<lane>.md` to the
  placement ladder.
- `references/glossary.md`: removed five entries now explained in `SKILL.md`.
- `tests/skills/pressure-scenarios/skills-creation-spec-review-gate.md`:
  updated to the lane vocabulary; its `RED before edit` assertion was replaced
  with authoring-basis assertions, because it contradicted the reproduction
  gate this skill adopted.
- Added `tests/skills/pressure-scenarios/skills-creation-review-lane-scaling.md`.

## Validation

- `claude plugin validate .` passed.
- All `references/` pointers in `skills-creation` resolve; no dangling paths.
- Markdown tables aligned and code fences balanced across `SKILL.md` and all
  references and lanes.
- Consistency check: the nine lane qualifications now have one home
  (`reference-lanes-design.md`), down from three.
- Behavior proof is **not** yet established. The pressure suite has not been
  run for this change; shipping status is `source-only` with a named proof gap.

## Proof gap

`tests/skills/run-skill-pressure-tests.sh --fast` has not been run against this
change. The two scenarios most likely to contest it are
`skills-creation-review-lane-scaling` (new) and
`skills-creation-spec-review-gate` (updated).
