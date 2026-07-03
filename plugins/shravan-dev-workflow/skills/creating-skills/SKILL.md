---
name: creating-skills
description: Use when creating, updating, or evaluating one named skill or accepted draft; turning a repeated agent failure into a skill; designing skill invocation, references, pressure proof, metadata, or repo skill-authoring routing.
---

# Creating Skills

Create, update, or evaluate one named skill or accepted draft. Broad portfolio
inventory belongs elsewhere; defer it to `skill-audit` or ask for one named
target before authoring.

## What Makes A Great Skill

A great skill makes agent behavior more predictable without turning
`SKILL.md` into a manual. Keep these levers visible before writing:

- Reusable job: one durable job future agents should repeat.
- Invocation fit: model-invoked when the agent must discover it; routed or
  user-invoked when human choice should stay in control.
- Trigger surface: the description names when to load the skill, not the whole
  workflow.
- Information hierarchy: `SKILL.md` carries the workflow spine and all-branch
  rules; references carry branch-only depth.
- Context pointers: each branch says when to load it, what to carry in, and
  what must return.
- Completion criteria: every step has a checkable stop condition.
- Pressure proof: behavior-changing guidance needs RED/GREEN/REFACTOR evidence
  or an explicit proof gap.
- Pruning: delete no-op, duplicated, stale, or branch-only text that does not
  earn top-level space.

Load `references/glossary.md` when these terms need fuller meaning.

## Authoring Contract

- Work on one named skill or accepted draft.
- Treat `SKILL.md` as the operational workflow spine, not a link-only router and
  not a full manual.
- Keep all-branch state, proof posture, placement rules, and completion
  criteria in `SKILL.md`.
- Put branch-specific examples, rubrics, rationalization tables, and mechanics
  in `references/`.
- Adapt user-approved source ideas; do not copy upstream or local prose
  wholesale.
- Separate static validation from behavior proof.
- Defer installed-cache or home-level mutation unless release/refresh is
  explicitly scoped.

## Authoring State

Keep one small ledger and update it at branch returns. Use the compact form for
small chat-only runs; expand only fields that prevent ambiguity, scope drift, or
false proof.

```text
classification: create | update | evaluate
target skill/change:
owner plugin:
reusable job:
baseline failure/proof gap:
branches loaded:
changed resources:
security route/result: allowed | disallowed | blocked | deferred | not-applicable
proof status: RED | GREEN | REFACTOR | static validation | pressure scenario | proof gap
shipping/review status: source-only | PR-ready | released | installed-cache refreshed | blocked | deferred
```

## Main Workflow

When selecting branch references, use the exact `references/*.md` filename and
spell out `Carry in` and `Return with`; a filename list or paraphrased branch
name is not enough. Keep the filename adjacent to its carry/return contract:

```text
`references/example.md` - Carry in: ... Return with: ...
```

When showing the route, name what stays in `SKILL.md` for all branches and what
moves to references as branch-only depth.

Every branch returns through the parent Authoring State: branch loaded, decision
or finding, changed placement/proof/security status, next branch, and retest or
proof gap. Do not repeat a generic branch schema inside references unless that
branch needs unique labels.

1. Frame the authoring run.
   Completion: authoring receipt exists and broad inventory is deferred or
   narrowed to one target.
   - `references/authoring-intake.md` - Load when the reusable job, target
     behavior, baseline failure, or acceptance source is fuzzy. Carry in:
     proposed change, examples, failure hypothesis. Return with: authoring
     receipt and success criterion.

2. Choose invocation and trigger surface.
   Completion: invocation mode and trigger-only description are decided.
   - Load `references/invocation-and-description.md` when discoverability,
     model/user invocation, router handoff, keywords, or description wording is
     the crux. Carry in: invocation need and trigger examples. Return with:
     invocation decision and trigger-only description.

3. Shape the skill surface.
   Completion: workflow spine, reference routes, and placement audit are
   mapped; the placement audit classifies `all-branch` vs `branch-only` material.
   - Load `references/structure-and-progressive-disclosure.md` when `SKILL.md`
     is becoming a manual, link table, too branchy, or too thin. Carry in:
     draft outline, branches, reference candidates. Return with: workflow-spine
     outline and context-pointer plan.
   - Load `references/steering-and-wording.md` when wording must change agent
     behavior. Carry in: baseline failure, target behavior, current wording.
     Return with: leading words, completion criteria, failure-form choice.
   - Load `references/great-skill-evaluation.md` when judging an existing skill
     or draft. Carry in: skill files, intended trigger, source-adaptation
     concerns, proof evidence. Return with: verdict, scorecard, gaps, required
     revisions.

4. Write or edit.
   Completion: changed files match the receipt, placement audit, and any
   sensitive-resource decision.
   - Load `references/skill-security-review.md` before editing scripts, hooks,
     assets, package scripts, shell/network behavior, third-party source
     adoption, or installed-cache/home mutation. Carry in: resource, privileges,
     entry points, untrusted inputs, intended mutation. Return with: security
     route/result, allowed/disallowed actions, proof route, blocked/deferred
     status.
   - Load `references/platform-mechanics.md` only for scaffolding, metadata,
     validation, packaging, or platform-specific mechanics. Carry in: target
     platform, owning plugin, changed files. Return with: scaffold, metadata,
     validation, package requirements.

5. Prove behavior.
   Completion: static validation is not relabeled as behavior proof, and
   behavior-changing guidance has RED/GREEN/REFACTOR evidence or an explicit
   proof gap.
   - Load `references/pressure-testing.md` when the skill should prevent a
     shortcut, change behavior, or prove create/update/evaluate flow. Carry in:
     target behavior, scenario, changed skill files. Return with:
     RED/GREEN/REFACTOR evidence or proof gap.

6. Prune and package.
   Completion: duplicated all-branch material is removed, branch-only depth is
   behind references, source provenance is public-safe, and review/PR proof path
   is named when shipping.
   - Load `references/pruning-and-maintenance.md` when deleting, moving, or
     reconciling skill text is material. Carry in: current skill, usage
     evidence, test results. Return with: prune plan, retained source of truth,
     retest need.

Sensitive resources include scripts, hooks, assets, package scripts, shell or
network behavior, third-party skill/source adoption, and installed-cache or
home-level mutation.

## Authoring Receipt

Produce this before editing skill surfaces. Keep it useful, not ceremonial: one
line per field is enough unless the field changes the edit boundary or proof.

```text
target skill/change:
classification: create | update | evaluate
owner plugin:
reason / repeated failure:
existing-surface check:
user intent / acceptance source:
proof shape:
security-sensitive resource? yes | no
security route/result:
```

## Placement Audit

Before treating a skill surface as coherent, classify candidate instructions,
state fields, invariants, completion criteria, and proof rules:

```text
item:
classification: all-branch | branch-only
target location:
reason:
```

All-branch items belong in this `SKILL.md`. Branch-only items belong in exactly
one reference unless another source of truth already owns them.

For small edits, this can be a terse note naming only disputed or moved items.
Do not generate a large audit table when the placement is obvious.

## Completion Criteria

The authoring run is complete only when:

- receipt, branch choices, and placement audit exist;
- required references were loaded and returned their branch results into the
  Authoring State;
- changed skill files pass required platform static validation for every
  supported surface when applicable;
- behavior-changing guidance has pressure proof or an explicit proof gap;
- sensitive-resource routing is allowed, disallowed, blocked, deferred, or
  not-applicable with evidence;
- source adaptation is public-safe and not wholesale copying;
- docs, metadata, changelog, review, and PR proof are handled when shipping.
