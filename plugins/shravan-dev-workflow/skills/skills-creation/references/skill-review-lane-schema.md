# Skill Review Lane Schema

The shared contract and field shapes every `references/lanes/*.md` review lane uses. This file owns the common lane terms, field names, required slots, ordering, and status labels; the mission, rubric, and judgment stay in each lane file.

## Common Lane Contract

Every review lane inherits this. Lane files do not restate it:

```text
maximum authority: read-only; propose edits, never apply them
receipt:           complete | partial | blocked, with evidence and
                   unresolved questions
finding shape:     the Lane Finding block below
parent handling:   receipts are candidate findings; the parent verifies
                   them against source, merges duplicates across lanes,
                   resolves conflicts, names coverage gaps, and reduces
```

A lane file adds only its own stop condition, which is local to its mission.

## Review Packet

```text
review target:
review kind: spec | implementation
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

Allowed `surface` labels:

```text
SKILL.md
reference
lane
pressure scenario
schema
script
platform/changelog
static-only
out-of-scope
```

## Lane Finding

`lane` is the content lane name from `references/lanes/`. Runtime facts such as
model, provider, and reasoning effort are owned by `manage-agents` and recorded
there, not in the finding.

```text
lane:
finding:
severity: blocker | important | minor | observation
source evidence:
behavior risk:
smallest fix:
retest required:
```

## Changed-File Coverage

```text
changed-file coverage:
- path:
  surface:
  status: reviewed | static-only | out-of-scope
  evidence:
```

## Parent Reduction

The parent owns synthesis. No lane sees another lane's receipt, so merging
duplicates, resolving conflicts, and ranking happen only here.

```text
review:
required: yes | no
kind: spec | implementation
artifact: proposal | changed files
lanes:
- name:
  status: complete | partial | blocked | not dispatched
synthesis:
  ranked findings:
  - rank:
    defect:
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
