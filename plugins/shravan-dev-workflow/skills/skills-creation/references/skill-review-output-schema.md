# Skill Review Output Schema

Shared model-readable shapes for skill spec review and skill implementation review. This file owns field names, required slots, ordering, and status labels only; review judgment stays in the consuming review reference.

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
pressure scenario
schema
script
platform/changelog
static-only
out-of-scope
```

## Lane Finding

```text
lane:
provider:
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

```text
review:
required: yes | no
kind: spec | implementation
lanes:
- name:
  provider:
  status: complete | blocked | unavailable
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
