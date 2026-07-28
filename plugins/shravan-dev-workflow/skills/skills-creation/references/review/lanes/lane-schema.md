# Skill Review Lane Schema

The shared contract and field shapes every `references/review/lanes/*.md` review lane uses. This file owns the common lane terms, field names, required slots, ordering, and status labels; the mission, rubric, and judgment stay in each lane file.

## Common Lane Contract

Every review lane inherits this. Lane files do not restate it:

```text
dispatch terms:    the reviewer contract in
                   `../../../../manage-agents/SKILL.md`. That skill owns the
                   reviewer history and access values; do not restate them.
receipt:           complete | partial | blocked, with evidence and
                   unresolved questions
                     complete = every `Where to look` item for the artifact under
                                review was opened and
                                the lane's inspection applied to each,
                                and the lane's stop condition is met
                     partial  = at least one was not; name which and why
                     blocked  = the lane could not start; name the
                                missing input
                   A dispatched lane that returns nothing is `no-receipt`.
                   The parent collects receipts; silence is not `complete`.
                   A `complete` receipt lists the items it opened. A lane
                   that cannot enumerate them is `partial`.
finding shape:     the Lane Finding block below
parent handling:   receipts are candidate findings; the parent verifies
                   them against source, merges duplicates across lanes,
                   resolves conflicts, names coverage gaps, and reduces
```

A lane file adds only its own stop condition, which is local to its mission.

## Verdicts

Both stages return one of these exact labels. Do not replace one with a free-form phrase such as "not great yet."

```text
great               the artifact is sound as it stands
targeted-revision   a bounded fix is needed
significant-rewrite promise, trigger, workflow, or proof route must be redesigned
reject-or-restart   the target behavior is not one named skill, or there is no reusable job
```

What each means depends on the stage: at spec review `great` means accepted to implement; at implementation review it means the changed files are sound; evaluating an existing skill it means the shipped skill is sound as it stands.

## Dispatch Contract

Both review stages dispatch under this. Applied to each selected lane:

```text
MUST dispatch `<lane>` to a subagent using `<review packet>`.
Subagent loads `lane-schema.md` and `<lane>.md`.
Parallel-safe after the reviewed artifact exists; actual scheduling may serialize.
Instance authority is the reviewer contract in `manage-agents`.
Return `<complete | partial | blocked receipt>`; parent verifies and reduces it.
```

Dispatch every lane through `manage-agents` as a reviewer. Its `Context And Access` section (`../../../../manage-agents/SKILL.md`) sets `parent conversation history: none` and `workspace access: read-only`. A reviewer carrying the authoring session's history inherits its rationalizations, which is the one thing review exists to avoid.

Prefer native dispatch in the parent host's own lineage. When the runtime can reach another lineage, give at least one lane a different-lineage reviewer, because a second model family fails differently than the one that wrote the text.

No lane reads another lane's receipt, so nothing waits.

The parent collects every receipt explicitly. A dispatched lane that returns nothing is `no-receipt`, not `complete` — silence is never a clean review. Await one terminal receipt per dispatched lane, and ask for it if the lane goes quiet. While any dispatched lane is `partial`, `blocked`, or `no-receipt`, the run may not advance to `PR-ready` or `released` unless the parent closes that exact gap itself and records how. Synthesis is the parent's: merge duplicate findings across lanes, resolve conflicts against the artifact, name what no lane examined, and rank.

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

The `artifact` value sets the lane's scope. `proposal` is conversation only, nothing on disk. `changed files` scopes the lane to the diff. `existing files` is an already-shipped skill with no diff: read whole files and apply the lane to all of their text. A stop condition worded around a diff is satisfied vacuously against zero changed lines, so a lane that reads nothing returns a false `complete` — the one failure a review system cannot detect from its own output.

Allowed `surface` labels. These are the reviewed-surface rows in `../implementation-review.md`; a reference, lane, or schema file is `reference text`. Review depth belongs in `status:`, not here:

```text
SKILL.md body
reference text
frontmatter or description
a behavior-proof claim
a sensitive surface
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

`lane` is the content lane name from `references/review/lanes/`. Runtime facts such as
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
artifact: proposal | changed files | existing files
lanes:
- name:
  status: complete | partial | blocked | no-receipt | not dispatched
  reason: <why, when the lane contributed no accepted finding>
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
