# Shravan Dev Workflow Creation Swarms Plan

Date: 2026-06-20
Status: draft implementation plan
Review status: not reviewed
Recommended next skill: `shravan-dev-workflow:plan-review-swarm`

## Goal

Hard-cut the workflow phase names and contracts so the system reads as:

```text
idea / goal
  -> spec-creation-swarm
  -> spec-review-swarm
       accepted spec findings -> spec-creation-swarm
  -> plan-creation-swarm
  -> plan-review-swarm
       accepted plan findings -> plan-creation-swarm
  -> implementation-execute-plan
  -> implementation-review-swarm
       accepted implementation findings -> implementation-execute-plan
  -> implementation-pr-wrapup
```

The core invariant:

```text
spec defines separability
plan defines sequence
implementation executes sequence
review attacks the artifact
parent owns truth
```

## Non-Goals

- Do not merge spec creation and plan creation into one generic
  `creation-swarm` skill. This plan uses two concrete skills:
  `spec-creation-swarm` and `plan-creation-swarm`.
- Do not keep aliases for `spec-design-swarm` or `plan-create` in current
  runtime routing. This is a hard cutover.
- Do not rewrite historical changelog prose that accurately describes old
  released names. Update only current runtime docs, current paths, and any
  changelog links that must resolve to live files.
- Do not change product code or sidecar behavior.
- Do not let review skills become implementation skills.

## Source Coverage

Primary source is the chat decision plus current repo evidence. Whole-file
coverage was established for the files below unless noted.

| Source | Lines | Coverage |
| --- | ---: | --- |
| `plugins/shravan-dev-workflow/skills/orchestrator-goal/SKILL.md` | 422 | read 1-422 |
| `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/routing-map.md` | 57 | read 1-57 |
| `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/goal-contract.md` | 284 | read 1-260; tail not needed for routing, but validate before edit |
| `plugins/shravan-dev-workflow/skills/spec-design-swarm/SKILL.md` | 125 | read 1-125 |
| `plugins/shravan-dev-workflow/skills/spec-review-swarm/SKILL.md` | 109 | read 1-109 |
| `plugins/shravan-dev-workflow/skills/plan-create/SKILL.md` | 107 | read 1-107 |
| `plugins/shravan-dev-workflow/skills/plan-review-swarm/SKILL.md` | 167 | read 1-167 |
| `plugins/shravan-dev-workflow/skills/implementation-execute-plan/SKILL.md` | 121 | read 1-121 |
| `plugins/shravan-dev-workflow/skills/implementation-execute-plan/references/controller-packets.md` | 84 | read 1-84 |
| `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md` | 245 | read 1-245 |
| `plugins/shravan-dev-workflow/skills/spec-handoff/SKILL.md` | 73 | read 1-73 |
| `plugins/shravan-dev-workflow/skills/plan-handoff/SKILL.md` | 67 | read 1-67 |
| `plugins/shravan-dev-workflow/skills/research-swarm/SKILL.md` | 101 | read 1-101 |
| `plugins/shravan-dev-workflow/skills/research-swarm/references/evidence-ledger.md` | 43 | read 1-43 |
| `plugins/shravan-dev-workflow/skills/discuss-with-me/references/workflow-handoff-map.md` | 65 | read 1-65 |
| `plugins/shravan-dev-workflow/references/trigger-evals.md` | 303 | read 1-303 |
| `plugins/shravan-dev-workflow/README.md` | 255 | read 1-255 |
| `plugins/shravan-dev-workflow/.codex-plugin/plugin.json` | 88 | read 1-88 |
| `plugins/shravan-dev-workflow/.claude-plugin/plugin.json` | 55 | read 1-55 |
| `tests/skills/README.md` | 76 | read 1-76 |
| `tests/skills/pressure-scenarios/README.md` | 56 | read 1-56 |
| `tests/skills/run-skill-pressure-tests.sh` | 137 | read 1-137 |

Subagent evidence used:

- Rename blast radius lane: identified identity surfaces, manifests, routing
  docs, README, pressure scenarios, and current-vs-historical references.
- Pressure scenario lane: identified existing scenario updates and new
  scenarios needed for review loops and parallel execution.
- Ownership boundary lane: identified current phase ownership and text-level
  overlaps to clarify.

## Current Issues By Skill

### `orchestrator-goal`

Current issue:

- It correctly owns goal-backed routing and official transition state, but it
  still routes to `spec-design-swarm` and `plan-create`.
- It mixes forward lifecycle phases and portability handoffs in one route list,
  which makes handoff look like phase progress.
- It does not make the support workflows prominent enough:
  `discuss-with-me` is pre-clarity decision pressure, and `research-swarm` is
  supporting evidence gathering.

Required change:

- Update lifecycle routing to `spec-creation-swarm` and
  `plan-creation-swarm`.
- Encode the review loops:
  `spec-review-swarm -> spec-creation-swarm` for accepted spec findings and
  `plan-review-swarm -> plan-creation-swarm` for accepted plan findings.
- Keep the rule that `orchestrator-goal` is the only official workflow
  transition writer for goal-backed flows.
- Clarify that direct skill invocation owns the current turn outside
  goal-backed orchestration: when the user explicitly names a phase skill, that
  skill runs without an orchestrator transition.
- Separate lifecycle routes from portability actions in wording.

### `spec-design-swarm` -> `spec-creation-swarm`

Current issue:

- The name sounds like design exploration, not creation of the spec/design
  contract.
- It already uses subagents for substantial work, but the output still permits
  proof/sequencing language to blur into planning.
- It needs to state that specs define separability, contracts, constraints,
  invariants, non-goals, and proof expectations, not execution sequence.

Required change:

- Rename directory and frontmatter to `spec-creation-swarm`.
- Make subagents default for substantial spec creation. Tiny cases may run
  locally, but the reason must be stated.
- Add an explicit "no sequencing" rule: no worker order, task order, dependency
  DAG, or implementation execution plan belongs in the spec.
- Add a required spec boundary / separability diagram:

```text
Spec boundary / separability map

surface A
  owns: invariant X, source of truth X
  exposes: contract A

contract A <----> contract B

surface B
  owns: invariant Y, source of truth Y
  exposes: contract B
```

- Route substantial source gathering through `research-swarm` when the work is
  evidence-heavy, then consume that ledger before synthesis.
- Normal next skills:
  `spec-review-swarm`, `spec-handoff`, or `plan-creation-swarm` only after the
  spec is accepted or explicitly ready for planning.

### `spec-review-swarm`

Current issue:

- It currently permits the review skill to address accepted issues in the owned
  spec artifact.
- Its output says the next step is usually `plan-handoff` or
  `plan-review-swarm`, which is stale. A successful pre-plan review should
  normally flow to plan creation.

Required change:

- Keep reviewer lanes read-only and advisory.
- Parent verifies candidate findings and returns accepted / contested / open
  findings.
- Default accepted blocker/important findings route back to
  `spec-creation-swarm` for revision with the full creation context.
- Allow only tiny same-session copy edits as an explicitly scoped exception.
- Normal next step:
  - ready spec: `plan-creation-swarm`
  - accepted findings: `spec-creation-swarm`
  - portability: `spec-handoff`
  - explicit security scan: `ops-security-review`

### `plan-create` -> `plan-creation-swarm`

Current issue:

- The name is inconsistent with the swarm-based lifecycle.
- It does not explicitly use subagents for substantial planning.
- It owns sequencing, but it does not require a visible execution DAG showing
  how agents can parallelize and validate work.

Required change:

- Rename directory and frontmatter to `plan-creation-swarm`.
- Make subagents default for substantial plan creation:
  codebase boundary lane, validation/proof lane, execution-order lane,
  security/reliability lane, and adversarial plan lane.
- Plan creation reads the accepted spec and turns separability into execution
  sequence.
- Add a required execution DAG:

```text
Execution DAG

gate 0: validate repo state and source artifacts
  |
  +-- lane A: <scope/files/proof>
  |
  +-- lane B: <scope/files/proof>
  |
  +-- lane C: <scope/files/proof>
  |
integration gate: parent reviews diffs and resolves conflicts
  |
targeted validation gate
  |
full relevant validation gate
  |
implementation-review-swarm
```

- The plan must name:
  task sequence, dependency graph, parallel work lanes, disjoint write scopes,
  integration gates, validation gates by proof layer, stale-proof guards,
  split/replan triggers, rollback/recovery, and open questions.
- Normal next skills:
  `plan-review-swarm`, `plan-handoff`, or `implementation-execute-plan` only
  after the written plan exists and is ready to validate.

### `plan-review-swarm`

Current issue:

- It currently permits the review skill to revise accepted plan issues itself.
- It lacks a first-class route back to plan creation when findings affect
  sequence, proof, parallelization, or task scope.

Required change:

- Keep reviewer lanes read-only and advisory.
- Parent verifies candidate findings.
- Accepted blocker/important findings route back to `plan-creation-swarm`.
- If the finding reveals a missing or wrong spec boundary, route further back to
  `spec-creation-swarm`.
- Do not advance to `implementation-execute-plan` until accepted plan findings
  are addressed and the plan is reviewed or explicitly accepted.

### `implementation-execute-plan`

Current issue:

- The skill already supports subagents, but the language makes them optional
  even when the plan has parallelizable, disjoint slices.
- Slice-level review can be mistaken for the formal
  `implementation-review-swarm` gate.

Required change:

- Light-touch update only.
- Say: use subagents whenever work is parallelizable into bounded disjoint
  slices, unless the task is tiny, serial, unsafe to delegate, or the tool
  surface lacks subagent support; record that reason.
- Consume the `plan-creation-swarm` execution DAG.
- Keep parent responsible for integration, diff inspection, proof, and final
  claims.
- Clarify that slice-level checks are local execution checks and do not replace
  formal `implementation-review-swarm` unless review is explicitly out of
  scope.

### `implementation-review-swarm`

Current issue:

- It can fix accepted current-session findings by default, which blurs the
  formal review gate with implementation execution.

Required change:

- Light-touch update.
- Formal review returns accepted findings and proof gaps.
- Default route for accepted blocker/important implementation findings is
  `implementation-execute-plan`.
- Allow tiny same-session review-fix only when explicitly scoped, with the same
  proof discipline and clear report of what was fixed.

### Handoff Skills

Current issue:

- Handoffs correctly describe portability, but current references still point to
  old creation names.

Required change:

- `spec-handoff`: route plan authoring to `plan-creation-swarm`.
- `plan-handoff`: route missing plan creation to `plan-creation-swarm`.
- Keep handoffs as portability only, never approval, phase completion, or
  official goal transition.

## Task Sequence

### Task 0: Create RED Pressure Coverage First

Write or update pressure scenarios before changing the skill docs.

New or renamed scenarios:

- Rename `spec-design-swarm-parent-synthesis.md` to
  `spec-creation-swarm-parent-synthesis.md`.
- Rename `plan-create-from-spec-not-code.md` to
  `plan-creation-swarm-from-spec-not-code.md`.
- Rename `orchestrator-goal-plan-create-matrix-handoff.md` to
  `orchestrator-goal-plan-creation-matrix-handoff.md`.
- Add `spec-review-swarm-routes-findings-to-spec-creation.md`.
- Add `plan-review-swarm-routes-findings-to-plan-creation.md`.
- Add `implementation-execute-plan-parallel-subagents-default.md`.

Expected RED behavior before skill updates:

- New skill names are missing or old routing remains.
- Review scenarios do not route accepted findings back to creation skills.
- Implementation execution can choose inline work for clearly parallelizable
  slices.

### Task 1: Rename Skill Identity Surfaces

Use `git mv` or equivalent non-destructive renames:

- `plugins/shravan-dev-workflow/skills/spec-design-swarm/`
  -> `plugins/shravan-dev-workflow/skills/spec-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-create/`
  -> `plugins/shravan-dev-workflow/skills/plan-creation-swarm/`

Update:

- `SKILL.md` frontmatter `name`
- skill title and description
- `agents/openai.yaml` prompt text

### Task 2: Update Creation Skill Contracts

Edit:

- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/SKILL.md`

Add the separability map to spec creation and the execution DAG to plan
creation. Remove or tighten any text that lets specs own sequencing or lets
plans redefine spec boundaries.

### Task 3: Update Routing and State Ownership

Edit:

- `plugins/shravan-dev-workflow/skills/orchestrator-goal/SKILL.md`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/routing-map.md`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/goal-contract.md`

Required routing model:

```text
direct skill invocation
  -> the named phase skill owns the current turn

goal-backed workflow
  -> orchestrator-goal owns Current workflow / Next workflow
  -> phase skill returns recommendation footer
  -> orchestrator-goal verifies evidence and writes transition
```

### Task 4: Update Review Loops

Edit:

- `plugins/shravan-dev-workflow/skills/spec-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`

Make review outputs route back to the owning creation or execution skill for
accepted blocker/important findings.

### Task 5: Light-Touch Implementation Execution Update

Edit:

- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/references/controller-packets.md`

Require subagents for parallelizable bounded slices and clarify that the parent
must verify every returned diff and proof claim.

### Task 6: Update Handoff, Docs, and Shared References

Update old-name routing in:

- `plugins/shravan-dev-workflow/skills/spec-handoff/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-handoff/SKILL.md`
- `plugins/shravan-dev-workflow/skills/docs-maintain/SKILL.md`
- `plugins/shravan-dev-workflow/references/trigger-evals.md`
- `plugins/shravan-dev-workflow/references/source-inspirations.md`

Explicitly out of scope for this implementation pass:

- `plugins/shravan-dev-workflow/skills/discuss-with-me/**`
- `plugins/shravan-dev-workflow/skills/research-swarm/**`

### Task 7: Update Plugin Runtime Metadata and README

Edit:

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `plugins/shravan-dev-workflow/README.md`

Update:

- plugin descriptions
- keywords
- default prompts
- namespace map
- Mermaid workflow
- examples

Bump `shravan-dev-workflow` from `1.6.25` to `1.6.26` unless another version
has landed before implementation begins.

### Task 8: Update Pressure Scenario Inventory

Edit:

- `tests/skills/pressure-scenarios/README.md`
- renamed and new scenario files under `tests/skills/pressure-scenarios/`

Update scenario ids, skill names, prompt invocations, and lowercase regexes.
Remember that the harness lowercases decision/proof text before matching.

### Task 9: Changelog

Add:

- `docs/changelog/2026-06-20-shravan-dev-workflow-creation-swarms.md`

Update:

- `docs/changelog/README.md`

Do not rewrite older historical entries just because they mention old names.

### Task 10: Verification and Refactor

Run focused checks first, then the broader fast suite.

Commands:

```bash
rg -n "spec-design-swarm|plan-create" \
  plugins/shravan-dev-workflow tests/skills \
  --glob '!plugins/shravan-dev-workflow/skills/discuss-with-me/**' \
  --glob '!plugins/shravan-dev-workflow/skills/research-swarm/**' \
  --glob '!**/node_modules/**'

pnpm --dir tests/skills exec tsc --noEmit

pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts

tests/skills/run-skill-pressure-tests.sh \
  --fast \
  --scenario spec-creation-swarm-parent-synthesis \
  --timeout 900

tests/skills/run-skill-pressure-tests.sh \
  --fast \
  --scenario plan-creation-swarm-from-spec-not-code \
  --timeout 900

tests/skills/run-skill-pressure-tests.sh \
  --fast \
  --scenario spec-review-swarm-routes-findings-to-spec-creation \
  --timeout 900

tests/skills/run-skill-pressure-tests.sh \
  --fast \
  --scenario plan-review-swarm-routes-findings-to-plan-creation \
  --timeout 900

tests/skills/run-skill-pressure-tests.sh \
  --fast \
  --scenario implementation-execute-plan-parallel-subagents-default \
  --timeout 900

tests/skills/run-skill-pressure-tests.sh --fast --timeout 900

claude plugin validate .

codex plugin list --marketplace ai-tools --available --json
```

If `rg` still finds old names in `docs/changelog/`, inspect whether each hit is
historical prose or a live path. Historical prose may remain. Live paths and
current instructions must change. Old-name references in `discuss-with-me/**`
and `research-swarm/**` are out of scope for this pass by user decision.

## Requirements / Proof Matrix

| Requirement | Owning task | Proof owner | Proof gate | Layer | Stale-proof guard | Red/green required | Sized to pass |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Old current skill names are hard-cut to `spec-creation-swarm` and `plan-creation-swarm` in scoped surfaces | 1, 6, 7, 8 | parent | `rg` over plugin and tests has no old current references outside historical changelog and the out-of-scope `discuss-with-me/**` / `research-swarm/**` paths | integration | run after all edits from repo root | no | yes |
| Spec creation owns separability, not sequencing | 2 | parent + pressure scenario | `spec-creation-swarm-parent-synthesis` passes | workflow pressure | scenario uses new skill name and prompt pressure | yes, scenario should fail before skill text changes | yes |
| Plan creation owns sequencing, DAG, proof matrix, and parallel execution plan | 2 | parent + pressure scenario | `plan-creation-swarm-from-spec-not-code` passes | workflow pressure | scenario validates no implementation edits | yes | yes |
| Review findings loop back to creation skills | 4, 8 | parent + pressure scenarios | spec and plan review routing scenarios pass | workflow pressure | scenarios assert accepted findings route to creation | yes | yes |
| Orchestrator remains official goal transition writer | 3, 8 | parent | orchestrator transition scenarios pass | workflow pressure | scenario names exact current skill names | no unless scenario changed | yes |
| Direct skill invocation works outside goal-backed state | 3, 6 | parent | README and orchestrator text inspect cleanly; trigger evals updated | static + review | source files after rename | no | yes |
| Implementation uses subagents when work is parallelizable | 5, 8 | parent + pressure scenario | `implementation-execute-plan-parallel-subagents-default` passes | workflow pressure | scenario names disjoint write sets and parent verification | yes | yes |
| Plugin discovery uses new names | 7 | parent | `claude plugin validate .`; `codex plugin list --marketplace ai-tools --available --json` | packaging smoke | version bump visible in source; cache refresh may be separate rollout | no | yes |
| User-visible plugin change is recorded | 9 | parent | changelog file and README entry exist | docs | dated 2026-06-20 entry | no | yes |

No red/green exception is approved in this plan. For skill behavior changes,
RED is satisfied by adding or updating pressure scenarios before skill text is
changed and observing failure or name/routing mismatch where feasible.

## Write Surfaces

Primary:

- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/**`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/**`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/**`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/**`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
- `tests/skills/pressure-scenarios/**`

Supporting:

- `plugins/shravan-dev-workflow/skills/spec-handoff/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-handoff/SKILL.md`
- `plugins/shravan-dev-workflow/skills/docs-maintain/SKILL.md`
- `plugins/shravan-dev-workflow/references/**`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `plugins/shravan-dev-workflow/README.md`
- `docs/changelog/**`

Do not touch unrelated untracked files such as `node_modules/`, root
`package.json`, root `pnpm-lock.yaml`, or `swiftlint/` unless the user expands
scope.

## Risks

- Skill-name hard cutover can strand installed caches until the plugin is
  refreshed. Mitigation: bump version and verify runtime marketplace state.
- Review skills may still sound like they own edits if wording is only partially
  updated. Mitigation: pressure scenarios must assert route-back behavior.
- A broad `rg` replacement could corrupt historical changelog context.
  Mitigation: split current runtime surfaces from historical prose.
- If plan creation over-specifies worker mechanics, specs may start mentioning
  sequence again. Mitigation: spec pressure scenario must assert no sequencing.

## Open Questions

- Should the implementation review fix-loop be changed now, or left as a
  light-touch clarification? This plan treats it as light-touch because the
  current user priority is spec/plan creation and review routing.
- Should runtime installed-cache refresh be part of this implementation, or a
  separate rollout after source validation? The changelog should record the
  chosen rollout status either way.
