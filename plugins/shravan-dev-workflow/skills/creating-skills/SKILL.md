---
name: creating-skills
description: Use when creating, updating, or evaluating one named skill or accepted draft; turning a repeated agent failure into a skill; designing skill invocation, references, pressure proof, metadata, or repo skill-authoring routing.
---

# Creating Skills

Create, update, or evaluate one named skill or accepted draft. This skill owns
the authoring workflow; platform creators and upstream writing references are
supporting sources, not the primary route.

Out of scope: broad repo-wide skill inventory, duplicate-surface archaeology, or
portfolio create/update/merge/skip audits. Ask for a named target or route that
future work separately.

## Authoring State

Carry this state through every branch:

```text
target skill/change:
classification: create | update | evaluate
owner plugin:
target files:
reusable job:
baseline failure or proof-gap reason:
invocation decision and trigger examples:
selected branch:
changed resources: SKILL.md | references | scripts | assets | hooks | manifests | docs | changelog
security-sensitive resource? yes | no
security route/result: allowed | disallowed | blocked | deferred | not-applicable
proof status: RED | GREEN | REFACTOR | static validation | pressure scenario | proof gap
pruning status:
shipping/review status: source-only | PR-ready | released | installed-cache refreshed | blocked | deferred
```

## Main Workflow

1. Confirm the authoring direction.
   Completion: an authoring receipt exists. If the user asked for broad
   portfolio audit, stop and ask for a named skill or a separate portfolio-audit
   workflow.

2. Establish the reusable job and baseline failure.
   Completion: target behavior, invocation need, and observed failure or
   proof-gap reason are stated. Load `authoring-intake.md` when the named target
   is underspecified.

3. Choose invocation and description.
   Completion: model-invoked vs user-invoked choice, trigger-only description,
   and any router entry are decided. Load `invocation-and-description.md` when
   discoverability is the crux.

4. Design or evaluate the skill surface.
   Completion: `SKILL.md` workflow spine, all-branch invariants, branch map,
   references, shared state, and great-skill scorecard are mapped. Load
   `great-skill-evaluation.md` for quality judgment and
   `structure-and-progressive-disclosure.md` when the body/reference split is
   uncertain.

5. Run the placement audit before writing the skill surface.
   Completion: each candidate instruction, state field, invariant, completion
   criterion, and proof rule is classified as `all-branch` or `branch-only`
   with a target location and reason.

6. Run the sensitive-resource gate before writing sensitive surfaces.
   Completion: either no sensitive resource is in scope, or
   `skill-security-review.md` returns allowed/disallowed actions, proof route,
   and blocked/deferred status before edits continue.

7. Write or edit the skill.
   Completion: changed files match the receipt and any sensitive-resource
   decision. Load `platform-mechanics.md` only when scaffolding, metadata,
   validation, packaging, or platform-specific mechanics are needed.

8. Prove behavior.
   Completion: static validation is separate from pressure behavior proof.
   Behavior-changing guidance has RED/GREEN/REFACTOR evidence or an explicit
   proof gap. Load `pressure-testing.md`.

9. Prune and package for review.
   Completion: duplicated all-branch material is removed, branch-only depth is
   behind references, no no-op/sediment text remains, and review/PR proof path is
   named. Load `pruning-and-maintenance.md` when deleting or reconciling skill
   text is material.

## Branch Map

When naming references for a run, include why each reference loads, what state
to carry in, and what artifact must return. A filename list alone is not enough.
Do not say carry-in or return artifacts are implied; spell the `Carry in` and
`Return with` values for each selected reference.

| When the run needs... | Load | Carry in | Return with |
| --- | --- | --- | --- |
| target is underspecified | `references/authoring-intake.md` | proposed change, examples, failure hypothesis | authoring receipt and success criterion |
| named skill/draft quality judgment | `references/great-skill-evaluation.md` | skill files, intended trigger, source inspirations, proof evidence | verdict, scorecard, gaps, required revisions |
| invocation or description design | `references/invocation-and-description.md` | candidate type, user/model invocation need, trigger examples | invocation decision and trigger-only description |
| body is too broad, branchy, or thin | `references/structure-and-progressive-disclosure.md` | draft outline, branches, reference candidates | workflow-spine outline and context-pointer plan |
| wording must change behavior | `references/steering-and-wording.md` | baseline failure, target behavior, current wording | leading words, completion criteria, failure-form choice |
| behavior proof is required | `references/pressure-testing.md` | target behavior, scenario, changed skill files | RED/GREEN/REFACTOR evidence or proof gap |
| Codex or Claude mechanics are needed | `references/platform-mechanics.md` | target platform, owning plugin, changed files | scaffold, metadata, validation, package requirements |
| sensitive resources are in scope | `references/skill-security-review.md` | resource, privileges, entry points, untrusted inputs, intended mutation | security route/result, allowed/disallowed actions, proof route, blocked/deferred status |
| skill is bloated or stale | `references/pruning-and-maintenance.md` | current skill, usage evidence, test results | prune plan, retained source of truth, retest need |
| source provenance matters | `references/source-inspirations.md` | source names or concepts being borrowed | public-safe adaptation boundary |

Sensitive resources include scripts, hooks, assets, package scripts, shell or
network behavior, third-party skill/source adoption, and installed-cache or
home-level mutation.

## All-Branch Invariants

- `SKILL.md` is the operational workflow spine, not a link-only router and not a
  full manual.
- All-branch state, invariants, proof posture, branch selection, and completion
  criteria stay in `SKILL.md`.
- References own branch-specific depth only. Do not repeat shared workflow state
  across references.
- Description text is a trigger surface. It must not summarize the full workflow
  so thoroughly that agents skip the body.
- Use source inspirations as adapted judgment. Do not copy upstream or local
  source text wholesale into shipped skill files.
- Platform validation proves structure; pressure proof proves behavior.
- Installed-cache/home mutation is deferred unless release/refresh is explicitly
  scoped and reviewed.

## Authoring Receipt

Produce this before editing:

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

Before treating a skill surface as coherent, classify every candidate
instruction, state field, invariant, completion criterion, and proof rule:

```text
item:
classification: all-branch | branch-only
target location:
reason:
```

All-branch items belong in this `SKILL.md`. Branch-only items belong in exactly
one reference unless another source of truth already owns them.

## Completion Criteria

The authoring run is complete only when:

- receipt, branch choices, and placement audit exist;
- required references were loaded and returned their artifacts;
- changed skill files pass Codex static validation when applicable;
- behavior-changing guidance has pressure proof or an explicit proof gap;
- sensitive-resource routing is allowed, disallowed, blocked, deferred, or
  not-applicable with evidence;
- source adaptation is public-safe and not wholesale copying;
- docs, metadata, changelog, review, and PR proof are handled when shipping.
