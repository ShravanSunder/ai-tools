---
name: docs-maintain
description: Use when the user asks to update, clean up, reconcile, audit, purge, archive, promote, or maintain project docs, AGENTS.md, README.md, changelogs, runbooks, architecture docs, or existing spec/plan/debug artifacts.
---

# Docs Maintain

Maintain docs as durable working memory for humans and agents. This skill owns document lifecycle: keeping repo docs, `AGENTS.md`, `README.md`, changelogs, runbooks, architecture docs, and existing workflow artifacts aligned with current code and decisions.

Core pipeline:

```text
docs request
  -> inventory doc roles
  -> inspect current code/docs/session evidence
  -> classify create/update/cleanup/drift
  -> decide what drives: code, docs, plan, or user intent
  -> propose purge/update when destructive or ambiguous
  -> edit narrow docs
  -> verify references and stale links
```

## Core Rules

- Treat docs as claims. Verify important claims against current code, config, tests, release artifacts, or accepted plans.
- Separate docs for agents from docs for humans:
   - `AGENTS.md` is durable operating guidance for agents.
   - `README.md` is the human-facing advertisement and quick orientation.
   - architecture docs, runbooks, and changelogs carry durable working context.
   - specs, plans, debug notes, research packets, and handoffs are stage artifacts until this skill classifies them as durable, archived, or disposable.
- Keep `AGENTS.md` short. Move runbook detail to docs and link it.
- Do not let old plans/specs/debug notes displace current source-of-truth docs by inertia.
- Do not replace phase skills for active artifact work: `spec-creation-swarm`,
  `spec-review-swarm`, `spec-handoff`, `plan-creation-swarm`, `plan-review-swarm`,
  `plan-handoff`, `implementation-execute-plan`, `implementation-handoff`, and
  `debug-investigation` own their lanes.
- Before purging or rewriting docs, propose the change and say what will be preserved.
- When code and docs disagree, identify the driver and ask the user if it is not obvious.
- Use subagents for bounded inventory or stale-doc research in large repos, but the parent owns final edits.
- Use progressive disclosure: load only the workflow reference that matches the docs job.

## Workflow

1. Resolve scope:
   - repo path
   - requested docs
   - whether edits are allowed
   - whether stale-doc purge is in scope
2. Inventory doc roles:
   - `AGENTS.md`
   - `README.md`
   - `docs/architecture`
   - `docs/specs` or `docs/superpowers/specs`
   - `docs/plans` or `docs/superpowers/plans`
   - `docs/wip`
   - `tmp/*-workflows`
   - `docs/changelog`
3. Classify the job:
   - create new docs
   - update existing docs
   - clean up/purge stale docs
   - classify workflow artifacts as current, historical, disposable, or promotion candidates
   - reconcile discrepancies
   - add changelog/runbook references
4. Verify source-of-truth:
   - code/config/test reality
   - accepted spec/plan
   - release or PR state
   - user decision
5. Edit narrowly:
   - concise `AGENTS.md`
   - clear `README.md`
   - detailed docs under the appropriate docs folder
   - changelog entries when meta-instructions or workflows change
6. Validate:
   - no broken obvious links
   - no stale source-of-truth claims
   - no duplicated long detail in `AGENTS.md` and README
   - no unrelated docs churn

## Progressive Disclosure

- Load `references/doc-roles.md` before deciding where content belongs.
- Load `references/workflows.md` for create, update, cleanup, and discrepancy workflows.
- Load `references/staleness-and-purge.md` before deleting, archiving, or rewriting stale plans/specs.
- Load `references/changelog-runbooks.md` when adding `docs/changelog` or reference excerpts.
- Load `../../references/source-inspirations.md` when updating this skill or explaining source practices.

## Output Shape

Return:

- docs inspected
- source-of-truth driver
- changes made or proposed
- stale docs preserved, moved, or left alone
- links/references updated
- full clickable artifact links (absolute path + line) for docs or artifacts
  the human is expected to open
- validation performed
