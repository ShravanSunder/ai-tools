# Skill Review Lane Schema

The shared field shapes every review check uses. This file owns field names, required slots, allowed values, and field semantics only.

Its review contracts are status and verdict labels, per-check results, findings, and 🔎 Review Sidekick reduction. The stage and check references own behavior.

## Status Labels

```text
complete    selected check finished, or optional check not selected with reason
partial     selected check has exact unfinished coverage
blocked     selected check lacks a required input or access
```

## Verdicts

Use exactly these verdict labels:

```text
great               the artifact is sound as it stands
targeted-revision   a bounded fix is needed
significant-rewrite promise, trigger, workflow, or proof route must be redesigned
reject-or-restart   the target behavior is not one named skill, or there is no reusable job
```

Stage-specific meaning of each label is owned by the stage reference that selects the checks.

## Per-Check Result

```text
check: <reference name>
status: complete | partial | blocked
selection: required | selected: <reason> | not selected: <reason>
coverage: <mission stages completed and exact uncovered boundary>
result: <check-specific result or finding list>
stop condition: met | not met, with what remains
unresolved questions:
```

Do not add a reading digest, hash, line count, or chunk range. Findings carry source anchors. A missing, partial, or blocked required check prevents `great`.

## Check Finding

`check` is the content check name from `references/review/lanes/`.

```text
check:
finding:
severity:         blocker | important | minor | observation
                    blocker     = an agent following the skill produces the
                                  wrong behavior, or a required gate cannot fire
                    important   = an agent reaches the right behavior only by
                                  guessing, or reaches it inconsistently
                    minor       = the wording costs the reader effort but the
                                  behavior lands
                    observation = no behavior effect; the parent may prune it
source evidence:
behavior risk:
smallest fix:
retest required:
route:            <owning check when the defect is outside this check's boundary>
```

Severity is graded by effect on behavior, not by how wrong the text reads. `route` names the owning check when the defect is outside the reporting check's boundary.

## Lead Reduction

Every field below is filled by the review lead. The 🔎 Review Sidekick fills this reduction. `changed-file coverage` is derived from complete current files and check evidence.

```text
review:
required: yes | no
kind: spec | implementation
artifact: proposal | changed files | existing files
checks:
- name:
  status: complete | partial | blocked
  selection: required | selected: <reason> | not selected: <reason>
synthesis:
  ranked findings:
  - rank:
    defect:
    severity: blocker | important | minor | observation
    checks reporting it:
    evidence:
  merged duplicates:
  - defect:
    merged from:
  check conflicts:
  - subject:
    positions:
    reading the artifact supports:
    what would settle it:
  routed findings:
  - defect:
    owning check:
    selected: yes | no
  coverage gaps:
  - what no selected check examined:
  first fix:
  why it is first:
changed-file coverage:
- path:
  status: reviewed | static-only | out-of-scope
  reason:
accepted findings:
rejected findings:
unverified findings:
smallest edits:
targeted retest:
implementation decision: accepted-to-implement | revise-first | restart | skipped-by-user
ship decision: blocked | source-only | PR-ready candidate | released candidate
```
