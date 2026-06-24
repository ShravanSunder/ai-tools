---
name: skill-audit
description: Use when auditing existing skills, comparing admired upstream skill repositories, finding stale or duplicated skill behavior, or deciding which skills to create, update, merge, or skip from real session evidence.
---

# Skill Audit

Audit real workflows before creating skills. Skills encode judgment and house style, not task history; create or update one only when the wording teaches behavior a smart model would otherwise shortcut. Prefer updating an existing skill over creating a duplicate.

## Core Rules

- Start from evidence: current plugin skills, repo instructions, memory/session summaries, and targeted upstream skill sources.
- Recommend new skills only for repeated workflows with stable inputs, a repeatable procedure, and a clear output.
- Keep recommendations narrow. Do not turn themes into vague mega-skills.
- Separate create, update, merge, and skip.
- For update/create recommendations, include the trigger and ownership fit, the
  compact `SKILL.md` boundary, whether depth belongs in `references/`, whether
  deterministic mechanics belong in `scripts/`, and the pressure-coverage
  status: exists, update needed, new scenario needed, or explicitly not needed.
  This applies to tentative recommendations too. If evidence is insufficient,
  say no update/create recommendation is being made yet instead of naming a
  likely update path without its shape and proof. Avoid phrases like `likely
  update`, `probably create`, or `candidate update` unless the recommendation
  includes the required `SKILL.md`, `references/`, `scripts/`, and pressure
  coverage labels.
- Use source inspirations as best-practice inputs, not text to copy wholesale.

## Workflow

1. Inventory the local skill surface:
   - plugin README and manifests
   - `skills/*/SKILL.md`
   - `skills/*/agents/openai.yaml`
   - relevant repo `AGENTS.md` guidance
2. Gather usage evidence:
   - memory summary already in context
   - targeted `MEMORY.md` hits for the repo, plugin, or workflow
   - the 1-3 most relevant rollout summaries when exact evidence matters
   - raw sessions only when summaries do not contain the needed proof
3. Inspect upstream inspirations selectively:
   - open only the skills that map to the candidate workflow
   - extract mechanics, trigger wording, failure shields, and output shapes
   - avoid bulk-loading unrelated repositories
4. Classify candidates:
   - `update`: existing skill is the right bucket but stale or incomplete
   - `create`: missing distinct workflow with repeated evidence
   - `merge`: overlapping skills should become one clearer workflow
   - `skip`: one-off, vague, sensitive, or already covered
5. Shape every update/create recommendation:
   - trigger and ownership fit
   - `SKILL.md`: what stays in the compact core instructions
   - `references/`: what deeper detail, examples, rubrics, or templates move out
     of the core instructions
   - `scripts/`: what deterministic mechanics belong in scripts, or `not
     needed`
   - pressure coverage: exists, reuse, update, new scenario needed, or not
     needed with reason
6. Produce the audit:
   - candidate name
   - evidence and dates when available
   - source inspirations
   - why it helps
   - smallest useful change
   - progressive shape and proof recommendation for update/create items
   - priority

## Source Inspiration Map

When auditing `shravan-dev-workflow`, check `../../references/source-inspirations.md` for the concise plugin-level map of admired skills and borrowed mechanics.

When auditing swarm lane packet duplication, keep runtime packet contracts
skill-local. Do not create or preserve a global shared lane-contract reference
for workflow skills. Each workflow skill owns its packet anatomy, source-truth
rules, security context, receipts, parent reducer rules, lane names,
route-backs, proof details, statuses, and examples.

Shared authoring lessons belong in meta skills or authoring references, not in
runtime workflow skills. Runtime skills should load only the packet and lane
references needed for their phase.

Do not add per-skill provenance docs unless a skill needs a task-specific reference file for progressive disclosure.

## Failure Shields

- New skill recommendations require recurrence that is clearly likely and
  costly.
- Existing skills are the preferred home when tighter wording can prevent the
  observed failure mode.
- Upstream inspiration belongs in the audit only with the local behavior it
  improves.
- Marketplace or agent-instruction edits belong in scope when the audit finds
  concrete drift there.
- Update/create recommendations include the compact `SKILL.md` boundary,
  reference depth, script need, and pressure-proof status.
- Audit output remains read-only until the user explicitly asks to implement a
  narrow recommendation.

## Output Shape

Return:

- existing skills checked
- suggested updates
- suggested new skills
- deliberate skips
- progressive shape and pressure-coverage recommendation for each update/create,
  using `SKILL.md`, `references/`, `scripts/`, and pressure coverage labels
- source inspirations used
- priority order
- full clickable artifact links (absolute path + line) for any audit artifacts
  or referenced files the human is expected to open
