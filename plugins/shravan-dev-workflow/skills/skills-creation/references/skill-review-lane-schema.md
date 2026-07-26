# Skill Review Lane Schema

The shared contract and field shapes every `references/lanes/*.md` review lane uses. This file owns the common lane terms, field names, required slots, ordering, and status labels; the mission, rubric, and judgment stay in each lane file.

## Common Lane Contract

Every review lane inherits this. Lane files do not restate it:

```text
dispatch terms:    the reviewer contract in
                   `../../manage-agents/SKILL.md` -- parent conversation
                   history none, workspace access read-only. That skill
                   owns them; do not restate.
receipt:           complete | partial | blocked, with evidence and
                   unresolved questions
                     complete = every `Where to look` item was opened and
                                the lane's inspection applied to each,
                                and the lane's stop condition is met
                     partial  = at least one was not; name which and why
                     blocked  = the lane could not start; name the
                                missing input
                   A `complete` receipt lists the items it opened. A lane
                   that cannot enumerate them is `partial`.
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

## Receipt

Every lane opens its return with this block. A `complete` status that does not list the items opened is not `complete`.

```text
receipt: complete | partial | blocked
items opened:
- <each `Where to look` item, with the anchor that proves it was opened>
stop condition: met | not met, with what remains
unresolved questions:
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
route:            <owning lane, when the defect is outside this lane's
                  boundary; report it, do not judge it, do not drop it>
```

A lane that notices a defect outside its boundary files it with `route:` set. The parent decides whether the owning lane runs. Silent dropping loses the finding entirely when the owning lane was never dispatched.

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
