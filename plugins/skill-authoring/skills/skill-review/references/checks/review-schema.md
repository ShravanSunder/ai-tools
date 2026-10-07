# Skill Review Schema

The shared field shapes every review check uses. This file owns field names, required slots, allowed values, and field semantics only.

Its review contracts are status and verdict labels, per-check results, findings, and the review lead's reduction. The stage and check references own behavior.

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
reviewer: <reviewer agent and check family>
status: complete | partial | blocked
selection: required | selected: <reason> | not selected: <reason>
coverage: <mission stages completed and exact uncovered boundary>
result: <check-specific result or finding list>
stop condition: met | not met, with what remains
unresolved questions:
```

Do not add a reading digest, hash, line count, or chunk range. Findings carry source anchors. A missing, partial, or blocked required check prevents `great`.

## Check Finding

`check` is the check name from `references/checks/`, or `lint:<rule-or-card>` for a finding raised by `skill-eval-runner lint`.

```text
check:
raised by:        reviewer agent <family> | lint rule <id> | Jev lint card <id>
finding:
property:         teaching | trigger | rule agreement | placement | claim strength | safety
severity:         blocker | important | minor | observation
                    blocker     = an agent following the skill produces the
                                  wrong behavior, or a required gate cannot fire
                    important   = an agent reaches the right behavior only by
                                  guessing, or reaches it inconsistently
                    minor       = the wording costs the reader effort but the
                                  behavior lands
                    observation = no behavior effect; the lead may prune it
source evidence:
behavior risk:
smallest fix:
retest required:
route:            <owning check when the defect is outside this check's boundary>
state:            candidate | verified-at-anchor | accepted | rejected
```

Severity is graded by effect on behavior, not by how wrong the text reads. `route` names the owning check when the defect is outside the reporting check's boundary.

Each check belongs to one property: `mental-model-fit`, `depth-coverage`, `steering-strength`, and `no-op-pruning` judge teaching; `trigger-routing` judges the trigger; `rule-agreement` judges rule agreement; `placement-and-calls` judges placement; `claim-vs-evidence` judges claim strength; `sensitive-surface` judges safety.

A finding enters as `candidate`. Only the review lead moves it to `verified-at-anchor`, after opening the cited anchor in the current revision; an absence claim is verified only by opening the file where the item would be. Only a `verified-at-anchor` finding can be `accepted`. Agreement between reviewers is never verification.

## Review Lead Reduction

Every field below is filled by the review lead. `changed-file coverage` is derived from complete current files and check evidence.

```text
review:
required: yes | no
kind: spec | implementation
artifact: proposal | changed files | existing files
reviewers:
- agent:
  family:
  checks:
lint: ran | not-run: <reason>; Jev cards: ran | not-run: <reason>
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
