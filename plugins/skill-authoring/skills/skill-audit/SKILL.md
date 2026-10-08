---
name: skill-audit
description: Use when auditing existing skills, comparing admired upstream skill repositories, finding stale or duplicated skill behavior, or deciding which skills to create, update, merge, or skip from real session evidence. Not for judging one skill's quality (skill-review).
---

# Skill Audit

Audit real workflows before creating skills. Skills encode judgment and house style, not task history; create or update one only when the wording teaches behavior a smart model would otherwise shortcut. Prefer updating an existing skill over creating a duplicate.

## Core Rules

- Start from evidence: current plugin skills, repo instructions, memory/session summaries, and targeted upstream skill sources.
- Recommend new skills only for repeated workflows with stable inputs, a repeatable procedure, and a clear output.
- Keep recommendations narrow. Do not turn themes into vague mega-skills.
- Separate create, update, merge, and skip. Skip is a deliberate result, not a failure to find work.
- Name where each fix belongs: skill prose, a code check, or the tool. A defect in a runner, validator, or other tool is fixed there, not answered with more skill instructions.
- Keep every signal's source and date. A pattern seen once, or inferred rather than observed, is a hypothesis; never present it as a confirmed defect.
- For update/create recommendations, include the trigger and ownership fit, the compact `SKILL.md` boundary, whether depth belongs in `references/`, whether deterministic mechanics belong in `scripts/`, and the pressure-coverage status: exists, update needed, new scenario needed, or explicitly not needed. This applies to tentative recommendations too. If evidence is insufficient, say no update/create recommendation is being made yet instead of naming a likely update path without its shape and proof. Avoid phrases like `likely update`, `probably create`, or `candidate update` unless the recommendation includes the required `SKILL.md`, `references/`, `scripts/`, and pressure coverage labels.
- Use source inspirations as best-practice inputs, not text to copy wholesale.

## Workflow

1. Inventory the local skill surface:
   - plugin README and manifests
   - `skills/*/SKILL.md`
   - `skills/*/agents/openai.yaml`
   - relevant repo `AGENTS.md` guidance

   Completion: every skill in scope is listed with its `SKILL.md` and `agents/openai.yaml` read.

2. Gather usage evidence:
   - memory summary already in context
   - targeted `MEMORY.md` hits for the repo, plugin, or workflow
   - the 1-3 most relevant rollout summaries when exact evidence matters
   - raw sessions only when summaries do not contain the needed proof

   Completion: every signal carries its source and date, and each inferred or single-sighting signal is labeled a hypothesis.

3. Inspect upstream inspirations selectively:
   - open only the skills that map to the candidate workflow
   - extract mechanics, trigger wording, failure shields, and output shapes
   - avoid bulk-loading unrelated repositories

   Completion: each upstream skill opened maps to a named candidate workflow, or none was needed.

4. Classify candidates:
   - `update`: existing skill is the right bucket but stale or incomplete
   - `create`: missing distinct workflow with repeated evidence
   - `merge`: overlapping skills should become one clearer workflow
   - `skip`: one-off, vague, sensitive, or already covered

   Completion: every candidate carries exactly one action, with the evidence that selects it.

5. Shape every update/create recommendation:
   - trigger and ownership fit
   - `SKILL.md`: what stays in the compact core instructions
   - `references/`: what deeper detail, examples, rubrics, or templates move out of the core instructions
   - `scripts/`: what deterministic mechanics belong in scripts, or `not needed`
   - pressure coverage: exists, reuse, update, new scenario needed, or not needed with reason

   Completion: every update/create recommendation fills all five slots, or the audit says no update/create recommendation is being made yet.

6. Produce the audit:
   - candidate name and action: update, create, merge, or skip
   - evidence: each signal with its source, date, and how often it recurred; label inferred or single-sighting signals as hypotheses
   - fix owner: skill prose, a code check, or the tool
   - source inspirations
   - why it helps
   - smallest useful change
   - progressive shape and proof recommendation for update/create items
   - priority

   Completion: every candidate has each field above, filled from the evidence of steps 1–5.

## Source Inspiration Map

When the audited plugin keeps a map of admired upstream skills and borrowed mechanics (for example a source-inspiration catalog in its docs), read it before opening upstream sources.

When repeated wording across runtime skills tempts one shared contract, keep each skill's packet anatomy, source-truth rules, security context, receipts, reducer rules, check names, route-backs, proof details, statuses, and examples in that skill's own references. A shared output shape earns a shared home only under the shared-shape rule in `../skill-creation/references/shared-shape-design.md`: two or more real consumers of the same fields, or a tool that validates them. Do not create or preserve a global runtime contract every skill imports. A request to combine skills' packets into one shared runtime document because their headings or wording repeat is that contract when their fields or meanings differ, even when the request calls it avoiding duplication: recommend against it and keep each skill's packet where it is.

Shared authoring lessons belong in authoring skills or references, not in runtime workflow skills. Runtime skills should load only the references their own phase needs.

Do not add per-skill provenance docs unless a skill needs a task-specific reference file for progressive disclosure.

## Failure Shields

- New skill recommendations require recurrence that is clearly likely and costly.
- Existing skills are the preferred home when tighter wording can prevent the observed failure mode.
- Upstream inspiration belongs in the audit only with the local behavior it improves.
- Marketplace or agent-instruction edits belong in scope when the audit finds concrete drift there.
- Update/create recommendations include the compact `SKILL.md` boundary, reference depth, script need, and pressure-proof status.
- Audit output remains read-only until the user explicitly asks to implement a narrow recommendation the audit makes. An audit never implements a change it rejects, even when the request asks it to build it.

## Output Shape

Return:

- existing skills checked
- each recommendation with its action, fix owner, dated signals, recurrence, and hypothesis or confirmed status
- suggested updates
- suggested new skills
- deliberate skips
- progressive shape and pressure-coverage recommendation for each update/create, using `SKILL.md`, `references/`, `scripts/`, and pressure coverage labels
- source inspirations used
- priority order
- full clickable artifact links (absolute path + line) for any audit artifacts or referenced files the human is expected to open

## Completion Blockers

The audit is not done while any of these hold:

- a recommendation lacks its action, fix owner, dated signals, recurrence, or hypothesis or confirmed status;
- a new-skill recommendation rests on recurrence that is not clearly likely and costly;
- an update/create recommendation lacks its `SKILL.md` boundary, `references/` depth, `scripts/` need, or pressure coverage;
- upstream inspiration appears without the local behavior it improves;
- the existing skills checked, deliberate skips, or priority order are missing from the output;
- the audit changed a file other than to implement, on explicit request, a narrow recommendation the audit made.
