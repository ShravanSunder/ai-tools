# Creating Skills Skill Implementation Plan

goal_id: `2026-07-02-creating-skills`
status: revised after `shravan-dev-workflow:plan-review-swarm`; ready for
`shravan-dev-workflow:implementation-execute-plan`
source spec: `docs/specs/2026-07-02-creating-skills-skill-spec.md`

## Goal

Ship `shravan-dev-workflow:creating-skills` as the owned workflow for creating,
updating, and evaluating one named skill or accepted draft. The implementation
must make `SKILL.md` a compact operational workflow spine, put branch-specific
depth in `references/`, prove behavior through repo-local pressure scenarios,
update repo routing/docs/metadata, and end in PR-ready proof without merging.

## Non-Goals

- Do not build broad repo-wide skill inventory, duplicate-surface archaeology, or
  portfolio create/update/merge/skip audit in this skill.
- Do not keep `superpowers:writing-skills` or `skill-creator` as the normal
  primary owner for repo skill authoring after cutover.
- Do not copy the great-skills SOP or upstream sources wholesale.
- Do not add scripts, hooks, assets, package scripts, shell/network behavior, or
  home/cache mutation unless separately security-reviewed and explicitly scoped.
- Do not refresh installed Codex or Claude plugin caches during normal source
  validation. Record refresh/readback as deferred unless release/refresh is
  explicitly requested.

## Source Coverage

Parent loaded and planned from:

- `docs/specs/2026-07-02-creating-skills-skill-spec.md`, 732 lines, chunks
  `1-260`, `261-520`, `521-732`.
- `tmp/spec-review-swarm/2026-07-02-creating-skills/review-report-goal-start.md`.
- `tmp/workflow-state/2026-07-02-creating-skills/details.md`.
- `tmp/workflow-state/2026-07-02-creating-skills/events.jsonl`.
- Source-only inspirations:
  - local great-skills SOP package
  - Superpowers `writing-skills`
  - Matt Pocock `writing-great-skills`
  - pstack entry-point/playbook model
  - Codex `skill-creator`

Source precedence:

1. Current spec and user corrections own the implementation contract.
2. Current spec-review report constrains planning.
3. Source inspirations inform local adaptation only.
4. Historical review packets and local source paths do not become runtime/public
   dependencies.

## Planning Lanes

| Lane | Reasoning effort | Result | Artifact |
| --- | --- | --- | --- |
| `codebase-boundary` | medium | answered by subagent | `tmp/plan-workflows/2026-07-02-creating-skills/lanes/codebase-boundary.md` |
| `validation-proof` | high | answered by subagent | `tmp/plan-workflows/2026-07-02-creating-skills/lanes/validation-proof.md` |
| `security-reliability` | high | answered by subagent | `tmp/plan-workflows/2026-07-02-creating-skills/lanes/security-reliability.md` |
| `vertical-slice-decomposition` | high | parent synthesis | this plan |
| `execution-order` | high | parent synthesis | this plan |
| `scope-and-proof-fit` | high | parent synthesis | this plan |

The parent reduced lane outputs into the final plan. Lane outputs are candidate
evidence; this plan is the accepted planning artifact.

## Write Surfaces

Skill core:

- `plugins/shravan-dev-workflow/skills/creating-skills/SKILL.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/authoring-intake.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/great-skill-evaluation.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/invocation-and-description.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/structure-and-progressive-disclosure.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/steering-and-wording.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/pressure-testing.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/platform-mechanics.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/pruning-and-maintenance.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/source-inspirations.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/skill-security-review.md`

Proof:

- `tests/skills/pressure-scenarios/creating-skills-workflow-spine.md`
- `tests/skills/pressure-scenarios/creating-skills-evaluate-draft.md`
- `tests/skills/pressure-scenarios/creating-skills-security-and-cache-boundary.md`
- `tests/skills/pressure-scenarios/README.md`

Routing and docs:

- `AGENTS.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`

Metadata and release memory:

- `plugins/shravan-dev-workflow/skills/creating-skills/agents/openai.yaml`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json` for version sync when the Claude plugin
  manifest version changes
- `.agents/plugins/marketplace.json` only if the Codex marketplace source/path,
  policy, category, or other actual marketplace fields change; it currently has
  no plugin version field
- `docs/changelog/2026-07-02-creating-skills.md`
- `docs/changelog/README.md`

Out-of-scope write surfaces for this implementation unless replanned:

- `scripts/`, `assets/`, hooks, schemas, package scripts, runner internals, and
  installed Codex/Claude home caches.

## Requirements / Proof Matrix

| Requirement / claim | Source anchor | Owning task | Proof modality | Proof layer | Evidence source | Freshness guard | RED/GREEN |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Preflight captures branch/worktree state and expected pre-existing artifacts before implementation | goal checkpoint rule | T0 | preflight receipt | static/worktree | command output and plan-owned artifact list | before first implementation edit | not applicable |
| `creating-skills` owns create/update/evaluate for one named skill or accepted draft | spec R2/R7 | T1, T3, T5 | pressure scenario plus routing diff review | behavior + review | focused scenario artifact and current diff | run after changed skill/docs | RED or proof-gap, then GREEN |
| Broad repo-wide portfolio audit stays out of scope | spec non-goals/R2/R7 | T1, T3, T5 | pressure prompt that asks for broad inventory | behavior + review | scenario output and `AGENTS.md` routing | current user correction and changed scenario | RED or proof-gap, then GREEN |
| `SKILL.md` is workflow spine, not link-only router | spec R1/R1a/proposed path | T1, T3 | pressure scenario asserts main path, branch carry-in, return criteria, state, completion | behavior | scenario output | current changed skill | RED or proof-gap, then GREEN |
| All-branch material lives in `SKILL.md` | spec R1b | T1 | placement audit artifact plus implementation review | static + review | `tmp/implementation-workflows/2026-07-02-creating-skills/placement-audit.md`, changed files, review report | current diff | static exception |
| Required references exist and satisfy branch contract | spec R3 | T1 | reference checklist plus implementation review | static + review | changed references, placement audit, review report | current diff | static exception |
| `great-skill-evaluation.md` gives deterministic verdicts | spec R3 | T1, T3 | evaluation pressure scenario plus review | behavior + review | scenario output and changed reference | current changed reference | RED or proof-gap, then GREEN |
| Failure-form matching is preserved in `steering-and-wording.md` | spec R5 | T1, T3 | branch-reference checklist plus pressure assertion for guidance-form choice | static + behavior | changed reference and focused scenario output | current changed files | RED or proof-gap, then GREEN |
| Pressure-first authoring distinguishes RED/GREEN/REFACTOR | spec R4 | T0, T1, T3 | baseline artifact, scenario output, and reference review | behavior + review | focused pressure runs | current changed files | required |
| Platform mechanics are separate from authoring philosophy | spec R6 | T1, T4 | isolated quick validation, metadata review, plugin validation | static/plugin | command output and changed files | current manifests and skill dir | no behavior RED |
| Sensitive-resource routing uses `skill-security-review.md` | spec security context/R1a/R3 | T1, T3 | security pressure scenario plus implementation review | behavior + review | scenario output and review report | current changed files | RED or proof-gap, then GREEN |
| No installed-cache/home mutation unless release/refresh is explicit | spec R6/proof expectations | T3, T4, T5 | security pressure scenario, changelog status, PR wrapup | behavior + release | scenario output and PR/changelog proof | current scope and PR state | required |
| Public-safe provenance with no runtime dependency on local paths or copied source text | spec source precedence/proof expectations | T1, T4, T5 | shipped-file grep/review plus source-adaptation audit | static + review | grep output, changed files, review report | current tree | static exception |
| User-visible plugin behavior is release-ready | spec proof expectations | T4, T5 | docs/manifests/changelog plus PR wrapup | static + PR/release | changed files, validation, PR state | current branch/PR | release exception |

## Vertical Slice Cards

### T0. Preflight And RED Baseline Capture

Source anchors:

- Goal checkpoint rule, spec R4, pressure-harness limitations.

Behavior/capability:

- Capture branch/worktree state before implementation edits.
- Record expected pre-existing artifacts so checkpoint commits do not stage
  unrelated files accidentally.
- Create or select the focused pressure scenarios and capture RED baseline
  evidence before the new skill body/references exist. If a true baseline cannot
  be run because the skill is unshipped, record a scenario-specific proof-gap
  reason before implementation starts.

Likely touched files:

- `tmp/implementation-workflows/2026-07-02-creating-skills/preflight.md`
- `tmp/implementation-workflows/2026-07-02-creating-skills/red-baseline.md`

Checkpoint:

- Preflight receipt includes:
  - `git status --short --branch`
  - branch/worktree target
  - expected pre-existing untracked artifacts:
    `docs/specs/2026-07-02-creating-skills-skill-spec.md`,
    `docs/plans/2026-07-02-creating-skills-skill-implementation.md`,
    and `tmp/*` workflow artifacts
  - staged-file policy for checkpoint commits
  - RED baseline artifact path or explicit proof-gap reason per scenario

Proof:

- Parent can inspect preflight and RED/proof-gap artifacts before T1 edits.

Dependencies:

- Starts first.

Split/replan trigger:

- If baseline proof would require installed-cache/home mutation, record a proof
  gap and keep cache refresh deferred.

### T1. Core Skill Surface

Source anchors:

- R1, R1a, R1b, R2, proposed `SKILL.md` main path.

Behavior/capability:

- Create `creating-skills/SKILL.md` with trigger-focused frontmatter,
  scope boundary, authoring-direction receipt, shared authoring state, main
  workflow, branch-use table, placement audit, all-branch invariants, proof
  expectations, and completion criteria.
- It must be compact but operational: a future agent can run the main workflow
  without loading every reference.
- Add all required reference files with consistent branch contracts:
  load trigger, carry-in state, branch procedure, return artifact, completion
  criterion, source adaptation boundary, and explicit note that all-branch
  workflow material stays in `SKILL.md`.
- Make `great-skill-evaluation.md` deterministic with allowed verdicts,
  dimensions, blocker overrides, highest risk, first required revision, and
  retest requirement.
- Include the R5 failure-form mapping in `steering-and-wording.md` and ensure a
  pressure assertion or static checklist proves it.
- Include `skill-security-review.md` as the branch for sensitive resources.

Likely touched files:

- `plugins/shravan-dev-workflow/skills/creating-skills/SKILL.md`
- all required files under
  `plugins/shravan-dev-workflow/skills/creating-skills/references/`

Checkpoint:

- T1 is one controller-owned slice for first implementation. Do not split
  `SKILL.md` and references across parallel workers unless a frozen branch table,
  shared state contract, and placement ledger already exist.
- Parent checks that every branch row has observable trigger, reference file,
  carry-in state, and return artifact.
- Parent checks that all-branch state appears in `SKILL.md`.
- Parent checklist confirms every required reference exists and every branch
  contract slot is present.
- Parent writes placement audit to
  `tmp/implementation-workflows/2026-07-02-creating-skills/placement-audit.md`
  with every candidate instruction, state field, invariant, completion
  criterion, and proof rule classified as `all-branch` or `branch-only`.

Proof:

- Static: isolated `quick_validate.py` eventually passes after T4 metadata exists.
- Static: reference checklist.
- Behavior: workflow-spine, evaluation, R5 failure-form, and security pressure
  assertions eventually pass.

Dependencies:

- T0 preflight and RED/proof-gap capture.

Split/replan trigger:

- If `SKILL.md` grows into full SOP/manual material, split branch-only depth into
  references before continuing.
- If a reference starts duplicating all-branch workflow state, move that material
  back to `SKILL.md`.

### T2. Focused Pressure Scenarios

Source anchors:

- Proof expectations and validation-proof lane.

Behavior/capability:

- Add a focused scenario set:
  - `creating-skills-workflow-spine.md`: create routing,
    authoring receipt, main path, branch carry-in/return, all-branch placement,
    no link-only router, no full manual dump, broad inventory rejection, and
    placement-audit requirement.
  - `creating-skills-update-existing-skill.md`: update classification, existing
    owner preservation, no broad portfolio audit, branch carry-in/return, and
    wording/proof/pruning branch selection.
  - `creating-skills-evaluate-draft.md`: evaluate a weak/draft skill with
    deterministic scorecard, blocker overrides, required revisions, and retest
    route. Include a branch that forces `steering-and-wording.md` to choose the
    correct guidance form for an observed failure.
  - `creating-skills-security-and-cache-boundary.md`: scripts/hooks/assets/
    package scripts/shell-network/third-party source/home-cache prompt routes to
    `skill-security-review.md`, blocks or defers unsafe work, and refuses
    installed-cache mutation unless release/refresh is explicit.

Likely touched files:

- `tests/skills/pressure-scenarios/creating-skills-*.md`
- `tests/skills/pressure-scenarios/README.md`

Checkpoint:

- Scenario hidden expected behavior and independent `expect_proof_regex` rows
  cover the spec assertions without leaking grader-only content into the prompt.

Proof:

- RED: T0 baseline run before the skill is available, or explicit proof-gap
  reason if the current installed surface cannot exercise the new unshipped
  skill.
- GREEN: focused scenario runs after implementation.
- REFACTOR: revise skill wording/reference pointers for any new rationalization
  and rerun focused failures.

Dependencies:

- T1 draft should exist before GREEN. RED/proof-gap evidence exists from T0.

Split/replan trigger:

- If a single scenario becomes brittle or prompt-echo prone, split further.

### T3. Platform Validation And Metadata

Source anchors:

- R6, Codex skill-creator mechanics, current plugin patterns.

Behavior/capability:

- Add `agents/openai.yaml` for `creating-skills`.
- Update plugin manifest descriptions, keywords, default prompts, and version so
  `creating-skills` is visible as part of `shravan-dev-workflow`.
- Keep platform mechanics in `platform-mechanics.md`, not in `SKILL.md`.
- Update `.claude-plugin/marketplace.json` when the Claude plugin version
  changes. Do not edit `.agents/plugins/marketplace.json` for version sync
  because the current Codex marketplace entry has no version field; touch it
  only when source/path, policy, category, or other actual marketplace fields
  change.

Likely touched files:

- `plugins/shravan-dev-workflow/skills/creating-skills/agents/openai.yaml`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- marketplace manifests if their plugin version metadata must be kept current

Checkpoint:

- Parent compares `agents/openai.yaml` with `skill-creator` metadata guidance.
- Parent verifies no behavior proof claim is made from static validation.
- Parent confirms `agents/openai.yaml` is owned only by T3.

Proof:

- Run the Codex `skill-creator` quick validator for
  `plugins/shravan-dev-workflow/skills/creating-skills` with PyYAML available.
- `claude plugin validate .`
- `codex plugin list --marketplace ai-tools --available --json`

Dependencies:

- T1 should be stable enough for metadata wording.

Split/replan trigger:

- If marketplace manifests require nontrivial schema changes, split from this
  implementation and route to plugin-maintenance follow-up.

### T4. Routing, Docs, And Public Release Memory

Source anchors:

- R7, proof expectations, repo changelog rules.

Behavior/capability:

- Update `AGENTS.md` Skill Work SOP so named skill create/update/evaluate routes
  to `shravan-dev-workflow:creating-skills`.
- Audit all `AGENTS.md` skill-authoring surfaces, not only Skill Work SOP.
  Demote `superpowers:writing-skills` and `skill-creator` from normal primary
  owner to source/reference/platform support where appropriate, while preserving
  `skill-audit` as a classifier/future portfolio-audit input.
- Preserve the boundary that broad repo-wide skill inventory is out of scope for
  `creating-skills`.
- Update plugin README namespace map/core skill list and root plugin README.
- Add public-safe changelog entry and index it newest-first.

Likely touched files:

- `AGENTS.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`
- `docs/changelog/2026-07-02-creating-skills.md`
- `docs/changelog/README.md`

Checkpoint:

- Parent checks that runtime/public docs do not include source-only local paths.
- Parent checks that `skill-audit` is not erased; it is just not the normal
  authoring owner for one named skill.
- Parent runs an `AGENTS.md` route audit:
  `rg -n "writing-skills|skill-creator|creating-skills|skill-audit" AGENTS.md`
  and verifies all remaining edges are allowed by spec R7.
- Parent checks changelog and PR-wrapup text include explicit status for Codex
  refresh/reinstall, Claude refresh/reinstall, and Claude behavior proof:
  performed, deferred, or not applicable.

Proof:

- Static grep/review for local-path leakage in shipped files.
- Source-adaptation audit that confirms changed skill/reference text records
  what was adapted, rejected, or intentionally not loaded and avoids wholesale
  copying from source inspirations.
- Implementation review.

Dependencies:

- T1/T2/T3 should exist before docs advertise the new route.

Split/replan trigger:

- If docs-maintain discovers larger stale skill-work docs, defer cleanup to
  `docs-maintain` rather than expanding this implementation.

### T5. Review And PR-Ready Proof

Source anchors:

- Goal terminal condition and repo Skill Work SOP.

Behavior/capability:

- After implementation proof, run `implementation-review-swarm`.
- Address accepted findings through `implementation-execute-plan`.
- Run `implementation-pr-wrapup` to push/open/update the PR, monitor checks and
  review threads, report mergeability/readiness, and stop before merge unless
  explicitly authorized.

Likely touched files:

- none by default; this is lifecycle proof and finding follow-up.

Checkpoint:

- Parent verifies every matrix row is done, not-applicable, open, or blocked.

Proof:

- implementation review report
- PR/check/thread/mergeability evidence

Dependencies:

- T0-T4 and validation complete.

Split/replan trigger:

- Accepted implementation-review findings route back to implementation execution;
  accepted plan findings route back to plan creation; missing spec boundary
  routes back to spec creation.

## Execution DAG

```text
gate 0: re-anchor source and working tree
        commands: git status --short --branch
        record expected pre-existing plan/spec/tmp artifacts
        capture RED baseline or proof-gap before skill edits
  |
  +-- lane A: T1 core skill surface
  |     files: creating-skills/SKILL.md, creating-skills/references/*.md
  |     proof: placement audit, reference checklist, workflow-spine scenario draft
  |
integration gate 1: parent placement audit
  |
  +-- lane B: T2 focused pressure scenarios
  |     files: tests/skills/pressure-scenarios/creating-skills-*.md
  |     proof: RED/proof-gap, then GREEN/REFACTOR after skill edits
  |
  +-- lane C: T3 platform metadata
  |     files: agents/openai.yaml, plugin manifests, marketplace manifests if needed
  |     proof: quick_validate, claude plugin validate, codex marketplace check
  |
integration gate 2: targeted validation and proof-mode separation
  |
  +-- lane D: T4 routing/docs/changelog
        files: AGENTS.md, plugin READMEs, changelog/index
        proof: AGENTS route audit, public-safe grep/review, source-adaptation audit
  |
integration gate 3: full relevant validation
  |
implementation-review-swarm
  |
accepted findings? yes -> implementation-execute-plan -> targeted validation
accepted findings? no
  |
implementation-pr-wrapup
  |
terminal: PR ready, not merged
```

Parallelization notes:

- T1 is controller-owned for the first implementation because `SKILL.md` and
  references share the branch map, shared authoring state, and placement audit.
  Do not split it without a frozen branch table and placement ledger.
- T2 can be prepared in parallel after the T1 outline exists, but GREEN runs
  after T1 lands.
- T3 can run in parallel with T2 after the skill name/body shape stabilizes.
- T4 should wait until the skill exists and at least focused proof is defined,
  so docs do not advertise a missing workflow.

## Task Sequence

1. Run T0 preflight:
   - `git status --short --branch`
   - confirm branch/worktree target
   - record expected pre-existing plan/spec/tmp artifacts
   - define checkpoint commit boundaries and staged-file scope
   - create scenario drafts and capture RED baseline artifacts or
     scenario-specific proof-gap reasons before skill edits
2. Implement T1 as one controller-owned core skill surface.
3. Write placement audit to
   `tmp/implementation-workflows/2026-07-02-creating-skills/placement-audit.md`:
   - every instruction, state field, invariant, completion criterion, and proof
     rule classified as `all-branch` or `branch-only`
   - all-branch material in `SKILL.md`
   - branch-only depth in references
4. Finish T2 pressure scenarios.
5. Run isolated quick validation after T1/T3-owned metadata exists.
6. Run focused GREEN pressure scenarios and REFACTOR any rationalizations.
7. Update T3 metadata and validation.
8. Update T4 routing/docs/changelog and refresh/deferred status fields.
9. Run full relevant validation:
    - focused pressure scenarios
    - `tests/skills/run-skill-pressure-tests.sh --fast`
    - isolated quick validation
    - Claude plugin validation
    - Codex marketplace/plugin visibility check
    - AGENTS route audit
    - public-safe grep/review
    - source-adaptation audit
10. Run `implementation-review-swarm`.
11. Address accepted findings through implementation execution.
12. Run `implementation-pr-wrapup` for PR readiness, not merge.

## Validation Gates

Minimum source/static gate:

```bash
Run the Codex `skill-creator` quick validator for
`plugins/shravan-dev-workflow/skills/creating-skills` with PyYAML available.
```

Pressure gates:

```bash
tests/skills/run-skill-pressure-tests.sh --scenario creating-skills-workflow-spine --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario creating-skills-update-existing-skill --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario creating-skills-evaluate-draft --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario creating-skills-security-and-cache-boundary --timeout 900
tests/skills/run-skill-pressure-tests.sh --fast
```

Harness/unit gates:

```bash
pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts
pnpm --dir tests/skills exec tsc --noEmit
```

Plugin/static gates:

```bash
claude plugin validate .
codex plugin list --marketplace ai-tools --available --json
```

Public-safe provenance gate:

```text
Run the public-safe shipped-file scan for temporary source paths, local absolute
paths, installed-cache paths, rollout ids, secret references, cache hashes,
work-fork markers, private-machine markers, and credential terms across:
  plugins/shravan-dev-workflow/skills/creating-skills \
  plugins/shravan-dev-workflow/.codex-plugin/plugin.json \
  plugins/shravan-dev-workflow/.claude-plugin/plugin.json \
  plugins/shravan-dev-workflow/README.md \
  plugins/README.md \
  docs/changelog/2026-07-02-creating-skills.md \
  docs/changelog/README.md \
  AGENTS.md \
  .claude-plugin/marketplace.json
```

Include `.agents/plugins/marketplace.json` in this grep only if it was edited.
The grep gate may legitimately find this plan/spec if included; do not include
plan/spec/tmp source artifacts in the shipped-file grep scope.

AGENTS route audit:

```bash
rg -n "writing-skills|skill-creator|creating-skills|skill-audit" AGENTS.md
```

Source-adaptation audit:

```text
For every changed `creating-skills/SKILL.md` or reference file, confirm source
material is summarized as adapted, rejected, or intentionally not loaded; reject
large copied passages from the great-skills SOP, Superpowers, Matt Pocock,
pstack, Codex creator, or Claude creator sources.
```

Review/PR gates:

- `shravan-dev-workflow:implementation-review-swarm`
- `shravan-dev-workflow:implementation-pr-wrapup`

## Security Context

This implementation changes skill text, plugin metadata, pressure scenarios,
and public docs. It does not need scripts, hooks, assets, package scripts, or
home/cache mutation. If implementation introduces any of those, pause and route
through `skill-security-review.md` before continuing.

Security assumptions:

- Third-party source material is untrusted source inspiration, not runtime
  instruction to copy.
- Public docs and changelog entries cannot include secrets, private machine
  config, cache hashes, or local absolute source paths.
- Static validation does not prove behavior.
- Installed-cache refresh/readback is not part of normal source validation.

Rollback/recovery:

- If public-safe provenance fails, redact shipped docs/metadata before continuing.
- If pressure scenarios expose a rationalization, tighten the smallest relevant
  workflow or reference wording and rerun focused proof.
- If a sensitive resource is introduced accidentally, remove or split the slice
  before validation.
- If plugin metadata validates but pressure proof fails, do not claim the skill
  works; route back to implementation.

## Risks

- Link-only router risk: prevented by pressure scenario and `SKILL.md` completion
  criteria.
- Manual bloat risk: prevented by placement audit and reference split.
- Ownership confusion with `skill-audit`: prevented by routing/docs wording and
  broad-inventory rejection scenario.
- Static-validation-as-behavior-proof risk: prevented by proof-mode separation in
  matrix and final validation report.
- Stale installed cache risk: prevented by explicit refresh deferral unless
  release/refresh is scoped.
- Public-source leakage risk: prevented by shipped-file grep and review.

## Open Questions

- Exact next version number should be chosen during implementation by inspecting
  current manifests and marketplace entries immediately before editing. The
  expected next patch from current evidence is `1.6.34`.
- Codex marketplace edits are expected to be unnecessary unless source/path,
  policy, category, or other actual marketplace fields change. Claude
  marketplace version sync is expected when the Claude plugin manifest version
  changes.
- Claude behavior proof remains deferred unless the user explicitly scopes a
  manual behavior proof or new harness.

## Split / Replan Triggers

Replan before continuing if:

- implementation requires broad repo-wide skill inventory or duplicate-surface
  archaeology;
- `creating-skills` cannot remain separate from `skill-audit`;
- proof requires editing `tests/skills` runner internals;
- a new executable resource or home/cache mutation becomes necessary;
- the focused pressure scenario set cannot prove behavior without leaking hidden
  expected behavior into prompts;
- implementation-review finds the plan/spec missed a material boundary.

## Recommended Next Workflow

Run `shravan-dev-workflow:implementation-execute-plan`. Adversarial
`plan-review-swarm` has completed and the accepted findings have been folded
into this revised plan.

```text
phase_result: complete
evidence: docs/plans/2026-07-02-creating-skills-skill-implementation.md; tmp/plan-review-swarm/2026-07-02-creating-skills/review-packet.md; tmp/plan-review-swarm/2026-07-02-creating-skills/review-report.md
recommended_next_workflow: shravan-dev-workflow:implementation-execute-plan
recommended_transition_reason: Plan-review findings were accepted, applied, and rechecked; the revised plan is ready for implementation execution.
```
