# Skill Review Lane Schema

The shared field shapes every `references/review/lanes/*.md` review lane uses. This file owns field names, required slots, ordering, allowed values, and field semantics only.

Its review contracts are: status and verdict labels, the review packet, each lane's receipt, each lane finding, and the parent's reduction. Review-stage and lane references own the behavior that produces and consumes these shapes.

## Status Labels

```text
complete    every required item was opened and inspected, and the lane's stop condition is met
partial     at least one required item was not completed; the receipt names what remains
blocked     the lane could not start; the receipt names the missing input
no-receipt  a dispatched lane returned nothing
```

## Verdicts

Use exactly these verdict labels:

```text
great               the artifact is sound as it stands
targeted-revision   a bounded fix is needed
significant-rewrite promise, trigger, workflow, or proof route must be redesigned
reject-or-restart   the target behavior is not one named skill, or there is no reusable job
```

What each means depends on the stage: at spec review `great` means accepted to implement; at implementation review it means the changed files are sound; evaluating an existing skill it means the shipped skill is sound as it stands.

## Review Packet

```text
review target:
review kind: spec | implementation
artifact: proposal | changed files | existing files
changed files:
- <path>: <surface>
diff or proposal summary:
user constraints:
source standards:
- <standard or reference path>
proof evidence:
- <RED, GREEN, static validation, proof gap, scenario id, or command>
non-goals:
- <boundary>
requested lane focus:
```

The `artifact` value sets the lane's scope. `proposal` is conversation only, `changed files` scopes the lane to the diff, and `existing files` scopes the lane to whole files when there is no diff.

Allowed `surface` labels. This schema owns the label set, and each stage rubric maps these labels to lanes. Classify a reference, lane, or schema file as `reference text`; record review depth in `status:`:

```text
SKILL.md body
reference text
frontmatter or description
a behavior-proof claim
a sensitive surface
```

## Receipt

Every lane opens its return with this block:

```text
receipt: complete | partial | blocked
items opened:
- <each `Where to look` item, with the anchor that proves it was opened>
stop condition: met | not met, with what remains
unresolved questions:
```

## Lane Finding

`lane` is the content lane name from `references/review/lanes/`.

```text
lane:
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
route:            <owning lane when the defect is outside this lane's boundary>
```

Severity is graded by effect on behavior, not by how wrong the text reads. `route` names the owning lane when the defect is outside the reporting lane's boundary.

## Parent Reduction

Every field below is filled by the parent. `changed-file coverage` is derived from the review packet's changed-file list and parent-verified lane evidence.

```text
review:
required: yes | no
kind: spec | implementation
artifact: proposal | changed files | existing files
lanes:
- name:
  status: complete | partial | blocked | no-receipt | not dispatched
  reason: <why, when the lane contributed no accepted finding>
synthesis:
  ranked findings:
  - rank:
    defect:
    severity: blocker | important | minor | observation
    lanes reporting it:
    evidence:
  merged duplicates:
  - defect:
    merged from:
  lane conflicts:
  - subject:
    positions:
    reading the artifact supports:
    what would settle it:
  routed findings:
  - defect:
    owning lane:
    dispatched: yes | no
  coverage gaps:
  - what no dispatched lane examined:
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
