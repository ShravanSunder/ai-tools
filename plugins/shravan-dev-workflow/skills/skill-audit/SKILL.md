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
5. Produce the audit:
   - candidate name
   - evidence and dates when available
   - source inspirations
   - why it helps
   - smallest useful change
   - priority

## Source Inspiration Map

When auditing `shravan-dev-workflow`, check `../../references/source-inspirations.md` for the concise plugin-level map of admired skills and borrowed mechanics.

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
- File edits belong to an explicit implementation request after the audit has a
  narrow recommendation.

## Output Shape

Return:

- existing skills checked
- suggested updates
- suggested new skills
- deliberate skips
- source inspirations used
- priority order
- full clickable artifact links (absolute path + line) for any audit artifacts
  or referenced files the human is expected to open
