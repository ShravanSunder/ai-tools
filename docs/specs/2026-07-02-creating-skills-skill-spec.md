# Creating Skills Skill Spec

## Product Intent

`shravan-dev-workflow:creating-skills` is the owned skill-authoring and
skill-quality workflow for this repo. It turns a user-requested skill create,
update, or review into a small, tested, maintainable skill. Its `SKILL.md` is
the operational workflow spine: it tells the agent what to do, when to branch,
what context to carry into each branch, and what must return before the main
path can continue.

The frontmatter is for discovery and invocation: why this skill exists and when
Codex should load it. The body is the workflow system. References hold branch
depth, not the shared authoring workflow.

The skill should absorb the useful judgment from:

- the local great-skills SOP package at
  `tmp/great skills/great-skills-sop/`
- Obra / Superpowers `writing-skills`
- Matt Pocock `writing-great-skills`
- pstack's router/playbook model
- Codex and Claude skill-creator mechanics
- this repo's `tests/skills/` pressure-test harness

It must not make upstream `superpowers:writing-skills` the owner of our authoring
discipline. Upstream material is source inspiration and prior art; the
Shravan-owned skill is the operating contract.

## Current-State Evidence

- `AGENTS.md` currently routes skill work through multiple pieces; this spec
  defines the new owned authoring center for create, update, and quality review.
- `skill-creator` owns Codex-specific skill anatomy, `agents/openai.yaml`,
  initialization, generated metadata, and `quick_validate.py`.
- Claude's skill creator reference owns Claude-oriented anatomy and packaging
  mechanics.
- `tests/skills/README.md` and `tests/skills/pressure-scenarios/README.md` own
  the repo-local pressure-test harness contract.
- The great-skills SOP package contains useful source material, but it is too
  linear and broad to become `SKILL.md` directly.

Source precedence for this spec:

1. This spec and the current user corrections own the contract.
2. `tmp/spec-review-swarm/2026-07-02-creating-skills/review-packet.md` and
   `review-report.md` are historical review inputs. They do not override this
   spec where they mention old line counts, `candidate-intake.md`, or a
   `skill-audit` acceptance gate.
3. Local source paths under `tmp/` and `/Users/...` are source-only inputs for
   this design run. Runtime skill files, changelogs, and public plugin docs must
   be self-contained and must not depend on those paths.

## Problem

The repo has the right pieces, but ownership is muddy:

- existing skill-work routing is easy to misunderstand as the skill-writing
  workflow.
- `superpowers:writing-skills` currently owns too much of the mental model.
- Codex and Claude creator mechanics are platform-specific, not authoring
  philosophy.
- The great-skills SOP package is useful, but if copied into a skill body it
  would create a large, branch-heavy `SKILL.md`.

The failure mode is skill-authoring sprawl in one direction and useless
link-table routing in the other. Agents either add instructions, examples, and
process history until `SKILL.md` becomes a manual, or they shrink the body until
it only points at files and no longer tells the next agent how to work.

## Goals

1. Add a Shravan-owned `creating-skills` skill under
   `plugins/shravan-dev-workflow/skills/creating-skills/`.
2. Keep `SKILL.md` compact but operational: it must run the authoring workflow
   and route branch depth to references.
3. Move branch-specific material into `references/` while keeping all
   all-branch workflow obligations in `SKILL.md`.
4. Make `creating-skills` sufficient to author a good skill and evaluate whether
   an existing or drafted skill is great.
5. Integrate pressure-first authoring from Obra without copying it wholesale.
6. Integrate Matt Pocock's predictability/invocation/hierarchy vocabulary.
7. Integrate pstack's router/playbook idea as structure, not as style.
8. Integrate Codex and Claude creator mechanics as platform references.
9. Require repo-local pressure proof for behavior-changing skill changes.

## Non-Goals

- Do not build a broad portfolio/inventory audit workflow in this first skill.
  This skill may evaluate one named skill or accepted draft; repo-wide cleanup
  and duplicate-surface archaeology can be retrofitted elsewhere later.
- Do not keep `superpowers:writing-skills` as the primary owner after this skill
  exists.
- Do not copy the entire great-skills SOP package into the new skill.
- Do not add README files inside the new skill folder unless a consuming tool
  requires them.
- Do not create a global shared runtime lane-contract reference.
- Do not refresh installed Codex or Claude plugin caches as part of the initial
  design/spec step.

## Requirements

### R1. Operational Workflow Spine

`creating-skills/SKILL.md` must be small enough that the main path is visible in
one scan, but complete enough that an agent can run the authoring workflow
without loading every reference. It should contain:

- frontmatter with a trigger-focused description
- one-sentence purpose and discovery boundary
- scope boundary: author/evaluate one named skill or accepted draft, not a
  broad repo-wide skill portfolio audit
- main authoring path with phase completion criteria
- branch reference map with load conditions
- branch state: what to carry into the branch and what must return
- all-branch invariants that every path must preserve
- shared authoring-state contract
- proof expectations
- completion criteria

The `SKILL.md` should not inline the full SOP package, long upstream quotes,
platform packaging details, or extensive examples.

It must still include enough context for agents to take the next correct action
without guessing. Compact does not mean vague: each branch pointer needs an
observable trigger, the reference file to load, the branch input, and the
completion criterion for returning to the main path.

### R1a. Reference Use In The Workflow

The final `SKILL.md` must include a compact branch-use table that supports the
workflow steps. The table is not the workflow; it is the branch map the workflow
uses when a phase needs depth.

The table should use these columns:

| When the run needs... | Load | Carry in | Return with |
| --- | --- | --- | --- |
| authoring target is underspecified | `authoring-intake.md` | proposed skill/change, examples, failure hypothesis | authoring receipt and success criterion |
| drafted or existing skill needs quality judgment | `great-skill-evaluation.md` | skill files, intended trigger, source inspirations, proof evidence | scorecard, gaps, and required revisions |
| trigger or discoverability design | `invocation-and-description.md` | candidate type, user/model invocation need, trigger examples | invocation decision and trigger-only description |
| body is too broad, branchy, or reference-heavy | `structure-and-progressive-disclosure.md` | draft outline, branches, reference candidates | compact operational `SKILL.md` outline and context-pointer plan |
| wording must change agent behavior | `steering-and-wording.md` | baseline failure, target behavior, current wording | leading words, completion criteria, and failure-form choice |
| behavior proof is required | `pressure-testing.md` | target behavior, scenario, changed skill files | RED/GREEN/REFACTOR evidence or explicit proof gap |
| Codex or Claude packaging is needed | `platform-mechanics.md` | target platform, owning plugin, changed files | scaffold/metadata/validation/package requirements |
| scripts, hooks, assets, package scripts, shell/network behavior, third-party skill/source adoption, or home/cache mutation are in scope | `skill-security-review.md` | sensitive surface, privileges, entry points, untrusted inputs, intended mutation | allowed/disallowed actions, proof/review route, or blocked/deferred status |
| existing skill is bloated or stale | `pruning-and-maintenance.md` | current skill, usage evidence, test results | prune plan, retest need, and retained source of truth |
| source provenance matters | `source-inspirations.md` | source names or concepts being borrowed | terse provenance and local adaptation boundary |

The table should be short enough to live in `SKILL.md`. Detailed instructions,
examples, and checklists belong in the referenced files.

### R1b. All-Branch Material Belongs In `SKILL.md`

If every branch needs a rule, state object, invariant, completion criterion, or
handoff contract, it belongs in `SKILL.md`, not repeated across references.

References are for branch-specific `what` depth. `SKILL.md` owns the shared
`how`: the main path, branch selection, common proof posture, common pruning
posture, and the state each branch must preserve.

This is the progressive-disclosure rule from the source material: inline what
every branch needs; disclose what only some branches reach.

The final `SKILL.md` must carry this shared authoring state through every
branch:

- authoring direction: `create`, `update`, or `evaluate`
- target skill or skill change
- owning plugin and target file path
- reusable job the future agent must perform
- baseline failure or explicit proof-gap reason
- invocation decision and trigger examples
- branch map and selected branch
- changed resources: `SKILL.md`, `references/`, `scripts/`, `assets/`, hooks,
  manifests, docs, or changelog
- security-sensitive-resource flag and route
- proof status: RED, GREEN, REFACTOR, static validation, pressure scenario, or
  proof gap
- pruning status: duplicated all-branch material removed or retained with reason
- shipping/review status: source-only, PR-ready, released, installed-cache
  refreshed, blocked, or explicitly deferred

The implementation must include a placement audit: every candidate instruction,
state field, invariant, completion criterion, and proof rule is classified as
`all-branch` or `branch-only`, with its target location and reason.

### R2. Authoring Intake Boundary

The new skill must say:

- Use `creating-skills` when the user asks to create a skill, update a skill,
  review whether a skill is good/great, or turn a known repeated failure into a
  skill.
- If the request is only a broad inventory question such as "which skills in
  this repo should exist?", mark it out of scope for this first skill and ask
  for a named target or a separate portfolio-audit workflow.
- If the user gives a direct authoring instruction, do not require a separate
  pre-authoring skill. Form an authoring receipt and continue.

Before authoring, `creating-skills` must produce an authoring-direction receipt:

```text
target skill/change:
classification: create | update | evaluate
owner plugin:
reason / repeated failure:
existing-surface check:
user intent / acceptance source:
proof shape:
```

`authoring-intake.md` may refine a fuzzy named target into this receipt. It must
not grow into a repo-wide skill portfolio audit.

### R3. Branch References

Branch-heavy material must live under `creating-skills/references/`.

Required reference branches:

| Reference | Owns |
| --- | --- |
| `authoring-intake.md` | authoring receipt, reusable job, automation-first check, baseline failure hypothesis |
| `great-skill-evaluation.md` | scorecard for whether a skill is great: predictable workflow, correct invocation, information hierarchy, all-branch placement, pressure proof, pruning, and source adaptation; allowed verdicts and required revisions |
| `invocation-and-description.md` | model/user invocation, context/cognitive load, trigger-only descriptions, router entries |
| `structure-and-progressive-disclosure.md` | compact operational `SKILL.md`, branch map, context pointers, steps vs reference |
| `steering-and-wording.md` | leading words, completion criteria, failure-form matching, rationalization counters |
| `pressure-testing.md` | choosing, recording, and interpreting RED/GREEN/REFACTOR pressure proof; the `tests/skills/` harness remains the runner and scenario-matrix source of truth |
| `platform-mechanics.md` | Codex and Claude creator mechanics, `agents/openai.yaml`, validation, packaging notes |
| `pruning-and-maintenance.md` | duplication, sediment, sprawl, no-op tests, changelog and retest expectations |
| `source-inspirations.md` | public-safe local adaptation notes for great-skills SOP, Obra, Matt Pocock, pstack, Codex, Claude; not a broad source catalog |
| `skill-security-review.md` | sensitive-resource gate for executable resources, third-party skill/source adoption, shell/network behavior, hooks, assets, package scripts, and home/cache mutation |

Every reference branch must include:

- load trigger
- carry-in state
- branch procedure
- return artifact
- completion criterion
- source material adapted, rejected, or intentionally not loaded
- note confirming it does not duplicate all-branch workflow material from
  `SKILL.md`

`great-skill-evaluation.md` must include deterministic verdict semantics, not
only a checklist. It should adapt the local SOP scorecard while staying
repo-native:

- Required dimensions: reusable job, invocation, trigger-only description,
  information hierarchy, completion criteria, steering/wording, pressure
  evidence, pruning, source adaptation, all-branch placement, branch disclosure,
  and platform validation.
- Allowed verdicts: `great`, `targeted-revision`, `significant-rewrite`, and
  `reject-or-restart`.
- If using points, use the SOP-compatible thresholds: `26-30 = great`,
  `20-25 = targeted-revision`, `14-19 = significant-rewrite`, and
  `0-13 = reject-or-restart`.
- Blocker criteria override points: wrong invocation trigger, missing workflow
  spine, link-only router, no pressure proof for behavior-changing guidance,
  unsafe sensitive-resource behavior, or all-branch obligations hidden only in
  references cannot receive `great`.
- Return artifact: verdict, score or ordinal rationale, evidence per dimension,
  highest risk, first required revision, and retest requirement.

### R4. Pressure-First Authoring

For behavior-changing skills, the new workflow must require evidence that the
skill changes behavior:

- RED: baseline failure observed without the skill, or a recorded reason why a
  baseline cannot be safely run.
- GREEN: skill-present run shows the target behavior.
- REFACTOR: new rationalizations or gaps are addressed with the smallest
  wording/structure change.

The skill must also distinguish pressure proof from static validation. A valid
frontmatter file is not proof that the skill works.

### R5. Failure-Form Matching

The new workflow must preserve the Obra distinction:

| Observed failure | Preferred guidance form |
| --- | --- |
| known rule skipped under pressure | bright-line rule plus rationalization table |
| wrong output shape | positive output contract or template |
| omitted element | required slot near the output |
| conditional behavior mistake | observable predicate plus action |
| shallow legwork | stronger completion criterion |
| wrong invocation | sharper description or user-invoked route |
| reference retrieval gap | stronger context pointer or inline material |

This prevents using prohibition-heavy wording for shape problems where a
positive recipe is clearer.

### R6. Platform Mechanics Stay Separate

Codex-specific mechanics belong in `platform-mechanics.md`, including:

- generated `agents/openai.yaml`
- `scripts/init_skill.py`
- `scripts/generate_openai_yaml.py`
- `scripts/quick_validate.py`
- plugin location under `plugins/<plugin>/skills/<skill>/`

Claude-specific mechanics belong in the same reference or a clearly named
subsection, including:

- Claude skill anatomy
- packaging/validation expectations when distributed through Claude plugin
  surfaces
- frontmatter and description differences that matter for Claude

`SKILL.md` should only route to this reference when platform mechanics are
needed.

Cross-harness proof belongs in `platform-mechanics.md` and the implementation
plan, but the spec must require the surface list: Codex skill validation, Codex
plugin/manifest validation, Codex pressure behavior proof, Claude plugin
validation when the plugin supports Claude, marketplace/README/changelog
updates, and installed-cache refresh or explicit deferred status.

The proof modes must stay separate:

- Codex pressure behavior proof is the default behavior proof path for the first
  implementation because `tests/skills/` is Codex-backed.
- Codex static validation and plugin/manifest validation prove packaging shape,
  not skill behavior.
- Claude plugin validation proves Claude packaging/static loading shape, not
  Claude behavior, unless a separate Claude behavior harness or manual behavior
  proof is explicitly scoped.
- Installed-cache refresh is a release/refresh proof step only when explicitly
  in scope; normal source validation must report it as deferred, not perform
  home/cache mutation.

### R7. AGENTS.md Routing

After the skill exists, `AGENTS.md` should route skill work as:

```text
Need to create, update, or evaluate one named skill or accepted draft?
  -> shravan-dev-workflow:creating-skills

Need to ask which skills should exist across the repo?
  -> out of scope for creating-skills; use a future portfolio-audit workflow
     or ask for a named target

Need platform scaffolding/validation?
  -> creating-skills references platform-mechanics plus Codex/Claude creator
     mechanics

Need final implementation review and PR lifecycle proof?
  -> implementation-review-swarm, then implementation-pr-wrapup
```

`AGENTS.md` may still mention upstream inspirations, but it must not route
normal repo skill work to `superpowers:writing-skills` as the primary owner.

Post-cutover allowed edges:

```text
create/update/evaluate one named skill or accepted draft
  -> shravan-dev-workflow:creating-skills

quality judgment for a named skill or draft
  -> creating-skills/references/great-skill-evaluation.md

platform mechanics during skill authoring
  -> creating-skills/references/platform-mechanics.md

pressure discipline during skill authoring
  -> creating-skills/references/pressure-testing.md
```

Post-cutover forbidden edges:

```text
normal repo skill authoring
  -/-> superpowers:writing-skills as primary owner

normal repo skill authoring
  -/-> skill-creator as primary workflow owner

creating-skills
  -/-> broad repo-wide portfolio audit or duplicate-surface archaeology

authoring-intake.md
  -/-> broad repo-wide create/update/merge/skip inventory
```

### R8. Pstack Integration

The skill should borrow pstack's entry-point/playbook architecture:

- one entry point owns the workflow spine
- branch points choose the needed deeper file
- narrow references own the heavy guidance
- the main skill does not expose every branch in full detail

The skill should not adopt pstack's style wholesale or its "no planning" stance.
In this repo, specs and plans remain first-class contracts.

## Spec Boundary / Separability Map

```text
AGENTS.md
  owns: repo routing and table-of-contents guidance
  exposes: which skill owns which phase

creating-skills/SKILL.md
  owns: operational workflow spine, branch selection, all-branch invariants,
        shared authoring state, placement audit, named-skill quality
        evaluation, branch carry-in state, and reference return criteria
  exposes: main authoring/evaluation path, reference-use map, proof
           expectations, and completion criteria

creating-skills/references/*
  owns: branch-specific authoring depth
  exposes: authoring intake, great-skill evaluation, invocation, structure,
           steering, pressure, platform, pruning, security, and
           source-inspiration guidance

future portfolio-audit workflow
  owns: repo-wide skill inventory, duplicate-surface archaeology, and broad
        create/update/merge/skip recommendations
  exposes: named target or accepted draft when authoring should begin

tmp/workflow-state/2026-07-02-creating-skills/
  owns: goal-backed workflow state for this effort
  exposes: expanded context in details.md and official transition history in
           events.jsonl
  write authority: orchestrator-goal only for official transitions; phase
                   skills return receipts and recommendations, not direct
                   state mutations

tests/skills/
  owns: repo-local pressure-test harness and scenario matrix
  exposes: behavior proof artifacts and scenario contracts

skill-creator / Claude creator mechanics
  owns: platform-specific scaffolding, validation, packaging
  exposes: commands and constraints consumed from platform-mechanics.md
```

## Proposed `SKILL.md` Main Path

The final `creating-skills/SKILL.md` should roughly follow this path:

```text
1. Confirm the authoring direction.
   Completion: authoring-direction receipt exists for create, update, or
   evaluate. If the user asks for broad repo-wide inventory, stop and ask for a
   named target or future portfolio-audit workflow.

2. Establish the reusable job and baseline failure.
   Completion: target behavior, user/model invocation need, and observed or
   hypothesized failure are stated; route to authoring-intake if the named
   target is underspecified.

3. Choose invocation and description.
   Completion: model-invoked vs user-invoked choice, trigger-only discovery
   wording, and any router entry are decided.

4. Evaluate or design the skill surface and branch map.
   Completion: SKILL.md workflow spine, all-branch invariants, branch pointers,
   reference files, shared authoring state, placement audit, and great-skill
   scorecard are mapped without duplicating branch manuals.

5. Run sensitive-resource gate before writing sensitive surfaces.
   Completion: no sensitive resource is in scope, or skill-security-review
   returns assets, privileges, entry points, untrusted inputs, third-party
   license or permission state, copy-vs-adapt decision, allowed/disallowed
   actions, public-safe changelog constraints, and proof/review route.

6. Write or edit the skill.
   Completion: changed files match the authoring direction and any
   sensitive-resource decision; platform mechanics are loaded only when
   scaffolding, metadata, validation, or packaging is needed.

7. Prove behavior.
   Completion: static validation plus RED/GREEN/REFACTOR pressure proof, or an
   explicit proof gap with reason.

8. Prune and package for review.
   Completion: no duplicated all-branch material, no sediment/no-op wording, and
   review/PR proof path named when shipping.
```

## Reference Use In Workflow

```text
target or authoring direction is underspecified
  -> authoring-intake.md
  -> return with refined authoring receipt and observable success criterion

drafted or existing skill needs quality judgment
  -> great-skill-evaluation.md
  -> return with scorecard, gaps, required revisions, and pass/fail judgment

invocation or description is the crux
  -> invocation-and-description.md
  -> return with invocation mode, trigger-only description, and router entry if needed

SKILL.md is getting large or branchy
  -> structure-and-progressive-disclosure.md
  -> return with main-path outline, branch map, and context pointers

agent keeps shortcutting or output shape drifts
  -> steering-and-wording.md
  -> return with failure-form choice, leading words, and completion criteria

behavior proof is required
  -> pressure-testing.md
  -> return with RED/GREEN/REFACTOR evidence or explicit proof gap

Codex/Claude metadata, scaffolding, validation, or packaging needed
  -> platform-mechanics.md
  -> return with exact platform mechanics and validation commands

scripts, hooks, assets, package scripts, shell/network behavior, third-party
skill/source adoption, or home/cache mutation are in scope
  -> skill-security-review.md
  -> return with sensitive-surface inventory, allowed/disallowed actions, and
     proof/review route

skill already exists and is bloated or stale
  -> pruning-and-maintenance.md
  -> return with deletion/pruning decisions and retest requirement

need source provenance
  -> source-inspirations.md
  -> return with adapted source idea and what not to copy
```

## Security Context

This design touches agent skill execution and plugin packaging. Risks include:

- malicious or unsafe scripts in `scripts/`
- prompt injection in third-party skill references
- accidental home-level plugin/cache mutation
- stale installed plugin cache behavior after repo edits
- leaking local/private source paths or secrets into public changelogs

The initial `creating-skills` skill does not need a full security scanner, but
it must require heightened review when a skill adds scripts, hooks, assets,
network calls, shell commands, package scripts, or home-level writes.

First slice decision: include `skill-security-review.md` as a required reference
branch. If implementation cannot include it, executable resources, hooks,
third-party skill/source adoption, shell/network behavior, package scripts, and
home/cache mutation are out of scope until the branch exists.

## Proof Expectations

An implementation of this spec should prove:

- `creating-skills/SKILL.md` is compact but operational: it can run the
  authoring workflow and route branch depth to references.
- `creating-skills/SKILL.md` includes observable branch triggers, reference
  filenames, branch inputs, and branch return criteria so agents can choose the
  right reference file without relying on memory or broad guessing.
- All-branch workflow obligations live in `SKILL.md`, not duplicated across
  references.
- Each required reference exists and has a clear load condition.
- Each required reference satisfies the branch-reference contract: load trigger,
  carry-in state, branch procedure, return artifact, completion criterion, and
  source-adaptation boundary.
- `great-skill-evaluation.md` can evaluate an existing or drafted named skill
  and return a scorecard, gaps, required revisions, and pass/fail judgment.
- The scorecard covers at least: correct invocation, predictable workflow,
  information hierarchy, all-branch placement, reference branch disclosure,
  completion criteria, pressure proof, pruning, source adaptation, and platform
  validation.
- The scorecard has deterministic verdict semantics: allowed verdicts, blocker
  criteria, evidence per dimension, highest risk, first required revision, and
  retest requirement.
- `AGENTS.md` routes named skill create/update/evaluate requests to
  `creating-skills`.
- `AGENTS.md` does not preserve `superpowers:writing-skills` or `skill-creator`
  as co-equal primary owners for normal repo skill authoring.
- `AGENTS.md` treats broad repo-wide skill inventory and duplicate-surface
  archaeology as out of scope for `creating-skills` until a future
  portfolio-audit workflow exists.
- The new skill validates with the Codex skill creator validation path.
- Behavior proof includes RED baseline evidence or explicit proof-gap reason,
  GREEN skill-present evidence, and REFACTOR disposition for rationalizations or
  newly discovered gaps.
- Focused pressure scenarios exist for the new skill and include hidden
  expected behavior/failure signals plus independent assertions for:
  - main authoring path
  - branch trigger/load/carry-in/return criteria
  - all-branch material in `SKILL.md`
  - placement audit present
  - no full manual dump in `SKILL.md`
  - no link-only router
  - evaluation of an existing poor or draft skill with scorecard and revisions
  - `create`, `update`, and `evaluate` classification paths
  - broad repo-wide inventory prompt rejected or routed out of authoring
  - `skill-security-review.md` selected for scripts, hooks, assets, package
    scripts, shell/network behavior, third-party source adoption, or home/cache
    mutation
  - no installed-cache or home-level mutation unless release/refresh is
    explicitly in scope
- The pressure scenario passes through the repo-local harness. Exact regexes and
  command sequencing belong in the implementation plan.
- Sensitive-resource changes route through `skill-security-review.md`, or are
  explicitly blocked until that branch exists.
- User-visible plugin behavior proof covers AGENTS routing/inventory, plugin
  README, plugins README, plugin manifests/interface metadata, changelog/index,
  version bump, Codex validation, Claude validation or explicit deferral, and
  installed-cache/source-vs-runtime status when refresh is in scope.
- Cross-harness proof names Codex behavior pressure separately from Codex static
  validation, Claude plugin/static validation, and any explicitly deferred
  Claude behavior proof.
- Source provenance is public-safe: shipped references do not depend on
  `tmp/great skills/...` or absolute local paths.

Exact command sequencing belongs in the implementation plan, but the proof
layers must include static validation and focused pressure behavior proof.

## Goal Orchestration Contract

This spec is the requirement source for the long-horizon goal to ship
`shravan-dev-workflow:creating-skills`.

```text
Objective:
Ship a Shravan-owned creating-skills workflow skill that can create, update,
and evaluate one named skill or accepted draft, using a compact operational
SKILL.md plus branch references, pressure proof, platform validation, docs, and
PR-ready proof.

Goal id:
2026-07-02-creating-skills

Required workflow skill:
shravan-dev-workflow:orchestrator-goal

Required reading:
docs/specs/2026-07-02-creating-skills-skill-spec.md
Historical review inputs, source-only:
- tmp/spec-review-swarm/2026-07-02-creating-skills/review-packet.md
- tmp/spec-review-swarm/2026-07-02-creating-skills/review-report.md
Source inspirations, source-only and non-runtime:
- tmp/great skills/great-skills-sop/
- local Matt Pocock `writing-great-skills` source copy
- local pstack source copy
- installed Superpowers `writing-skills`
- installed Codex `skill-creator`

Source precedence:
Current spec and user corrections override old review-packet/review-report
language. Old skill-audit acceptance-gate wording and old line counts are
historical only.

Requirement/spec source:
this spec plus the user corrections in the current design discussion

Current workflow:
spec revision in current session

Next workflow:
shravan-dev-workflow:spec-review-swarm

Terminal condition:
PR created or updated and proven ready for the creating-skills implementation,
with required proof gates captured, accepted implementation-review findings
addressed or explicitly rejected, current PR checks/review-thread/mergeability
state reported, and merge not performed unless explicitly authorized.

Orchestration rules applied:
default implementation terminal; mutable starting point; pr-ready non-merge
boundary; full proof loop; checkpoint commit rule

State details:
tmp/workflow-state/2026-07-02-creating-skills/details.md

Transition log:
tmp/workflow-state/2026-07-02-creating-skills/events.jsonl

Allowed write scope:
docs/specs/2026-07-02-creating-skills-skill-spec.md during spec revision;
implementation scope must be defined by plan-creation-swarm before code,
plugin, pressure-test, changelog, README, or AGENTS.md edits.

Stop condition:
Stop this spec-revision phase when the revised spec is ready for spec review.
Stop the full goal only at the terminal condition above.

Blocked condition:
Blocked only if required source material is missing, the user rejects the scope
boundary between creating-skills and future portfolio audit, or proof gates
cannot be defined without changing the agreed skill architecture.

Checkpoint rhythm:
After this revision is ready, run spec-review-swarm. After accepted review, run
plan-creation-swarm. Commit only at verified lifecycle checkpoints when scoped
files changed and repo policy permits.
```

Requirements/proof matrix seed:

| Requirement / claim | Proof source | evidence source: | freshness guard: |
| --- | --- | --- | --- |
| `creating-skills` owns create/update/evaluate for one named skill or accepted draft | spec-review-swarm review of this spec, then implementation review of changed skill and AGENTS routing | parent-run check plus review swarm | current spec file and current diff |
| Broad repo-wide portfolio audit is out of scope for this skill | spec review and pressure scenario where broad inventory prompt must not route into authoring | spec-review-swarm plus pressure harness | current user correction and current pressure scenario |
| `SKILL.md` is a workflow system, not only a router | pressure scenario assertions for main path, branch carry-in, return criteria, all-branch invariants, completion criteria, create/update/evaluate classification, and broad-inventory rejection | repo-local pressure harness | scenario committed with changed skill |
| All-branch material lives in `SKILL.md`; branch-only depth lives in references | placement audit artifact and implementation review | parent-run check plus implementation-review-swarm | current changed files |
| Matt, Superpowers, pstack, Codex, and Claude sources are adapted without runtime dependence on local paths | `source-inspirations.md` review and public-safe provenance check | parent-run check plus implementation review | current source references and shipped files |
| Great-skill evaluation is built into the workflow | `great-skill-evaluation.md` scorecard with deterministic verdict semantics and pressure scenario against a weak or draft skill | pressure harness plus implementation review | current pressure scenario output |
| Platform mechanics stay separate from authoring philosophy | `platform-mechanics.md`, Codex behavior pressure proof, static skill validation, plugin manifest validation, Claude static/plugin validation or explicit deferral | parent-run commands defined by plan-creation-swarm | current plugin manifests and changed files |
| Sensitive resources route through a security branch | `skill-security-review.md`, pressure assertion for sensitive-resource routing, no premature home/cache mutation, and implementation review of scripts, hooks, assets, package scripts, shell/network behavior, and home/cache mutation | pressure harness plus implementation-review-swarm plus targeted parent checks | current changed files |
| User-visible behavior is release-ready | changelog/index, plugin version metadata, README/AGENTS updates, validation results, installed-cache refresh or explicit deferral | implementation-pr-wrapup | current PR state |

## Open Decisions For Planning

| Decision | Status | Default |
| --- | --- | --- |
| public skill name | resolved | `creating-skills` |
| security first slice | resolved | include `skill-security-review.md`; if omitted, sensitive resources are out of scope until it exists |
| source provenance | resolved | shipped references are public-safe and self-contained; temporary SOP paths stay out of runtime skill references |
| `superpowers:writing-skills` in `AGENTS.md` | resolved | not a normal workflow route after cutover; source inspiration may be mentioned through `creating-skills` |
| installed-cache refresh | plan-owned | source validation is required; installed-cache refresh/readback is required only if release/refresh is in scope, otherwise explicitly deferred |

## Recommended Next Workflow

Use `spec-review-swarm` when this revised spec is ready for another adversarial
pass. Use `plan-creation-swarm` only after the spec is accepted. The plan should
define the vertical implementation slices, file edits, pressure scenario,
placement audit, validation commands, security branch, changelog/version
changes, and review/PR proof gates.
