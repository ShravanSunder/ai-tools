# Lane Packets

Use these packet shapes for read-only subagents. Also consume the shared
contract in `../../references/lane-contract.md`; this
file owns research-specific lanes, source classes, route recommendations, and
evidence expectations.

The parent owns the question, verification, reduction, and final claim. Lane
outputs are candidate evidence until parent synthesis verifies them against
source anchors.

For substantial research, create inspectable stage artifacts unless the user
asked for chat-only/no-files, the work is a single tiny local lane, or the tool
surface cannot write artifacts. Substantial means any of: more than one
lane/subagent, output consumed by another workflow or phase, high/xhigh or
security-sensitive lanes, or findings/decisions/proof obligations that need
later inspection. Record any exception in the parent receipt.

Default artifact shape:

```text
tmp/research-workflows/<date>-<slug>/
  research-ledger.md
  lanes/
    <lane-name>.md
```

## Research Packet Overlay

```text
You are a read-only research lane.
Do not edit files, stage changes, commit, or write implementation code.

Research mode: evidence gathering only
Parent question: <bounded question>
Decision target: <what this evidence will help decide>
Named targets: <repos/docs/tools/systems/articles to preserve>
Source class: <local code | sibling repo | DeepWiki | web docs | Reader | memory/session>
Security context: applicable | not applicable
- not applicable: <reason>
- applicable: <pointer to parent security context plus lane deltas, or assets,
  entry points, untrusted inputs, trust boundaries, sensitive data, privileged
  actions, and security non-goals>

Inspect:
- <path/url/repo/query>: <why>

Non-goals:
- <decisions, artifacts, or workflows this research lane must not own>

Return:
- lane name
- status: answered | blocked
- candidate evidence label
- sources inspected
- direct observations
- cited source summaries
- inferences
- contradictions or stale assumptions
- open questions
- recommended route, if any: spec-creation-swarm | plan-creation-swarm | no route yet
- proposed artifact path and candidate lane-file content, when artifacts are expected
- completion receipt: answered | blocked, with source anchors and proposed
  artifact paths; parent writes lane files for read-only lanes
- confidence: high | medium | low
```

## Parent Research Ledger

For substantial work, the parent `research-ledger.md` records:

- source-of-truth inputs and lane packets issued
- lane artifact paths under `lanes/`
- which observations the parent accepted, contested, rejected, or left open
- contradictions and stale assumptions that affect the next phase
- route recommendation to `spec-creation-swarm` or `plan-creation-swarm`, when
  the evidence is ready for a creation or planning workflow
- completion receipt with source anchors, artifact paths, named exceptions, and
  remaining uncertainty

Research ledgers do not create specs or implementation plans. They preserve
evidence for the next parent reducer.

## Local Re-Anchor Lane

Use when a local repo, spec, plan, runbook, or current implementation constrains
the research.

```text
Find the current local truth before external comparison.

Focus on:
- live file tree and branch/worktree state
- owner modules and interfaces
- current specs/plans/runbooks/findings
- sibling repos or local prior art if the named repo is thin
- exact files the parent must read before deciding
```

## Prior-Art Lane

Use one lane per target or per comparison axis.

```text
Research <target> only for <axis>.

Preserve the named target. Do not substitute generic examples.
Return what to borrow, what not to borrow, and what does not fit the local
system.
```

## Memory / Session Lane

Use only when the task asks about the user's prior workflows, repeated behavior,
session history, or durable preferences.

```text
Search memory and targeted rollout/session logs for repeated patterns.

Prefer MEMORY.md and rollout summaries first. Use raw sessions only when the
summaries are insufficient. Quote or cite exact evidence anchors when possible.
```

## Consistency Lane

Use when specs, plans, runbooks, changelogs, or findings must agree.

```text
Load the current artifact set and find contradictions.

When a runbook exists, read newest-first. Report stale references, conflicting
claims, proof gaps, and exact anchors.
```
