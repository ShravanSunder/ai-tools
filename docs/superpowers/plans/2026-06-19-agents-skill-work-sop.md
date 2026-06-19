# Agents Skill Work SOP Plan

Date: 2026-06-19
Status: reviewed plan

## Goal

Make `agents.md` / `AGENTS.md` explain how agents should do skill work in this
repo at the SOP / table-of-contents level. The docs should route future agents
to the right meta-skills and proof surfaces without duplicating the full manuals
inside the repo instructions.

The intended mental model:

```text
skill need / failure mode
  -> audit existing skills first
  -> decide update / create / merge / skip
  -> use the right meta-skills
  -> write compact progressive skills
  -> add or update pressure proof
  -> validate locally
  -> changelog / plugin refresh when user-visible
```

## Non-Goals

- Do not turn `agents.md` into a second `superpowers:writing-skills` or
  `skill-creator` manual.
- Do not make `tui-presentation` the owner of the general skill-development
  process; it remains one applied example of progressive disclosure.
- Do not change product code, plugin code, skill behavior, manifests, package
  metadata, or CI in this slice unless plan review explicitly expands scope.
- Do not add a GitHub Actions workflow for skill pressure tests. The Vitest /
  pressure runner remains local-only unless separately requested.
- Do not stop at local validation. This goal's terminal is a merge-ready PR:
  implementation proof complete, implementation review addressed, PR opened or
  updated, fresh checks / review-thread / mergeability / base-branch state
  reported, local HEAD matched to the PR head, and no merge performed unless
  separately authorized.

## Source Coverage

- Chat decision, 2026-06-19: user confirmed `agents.md` is the repo SOP /
  table of contents for how to work here and should reference required skills
  rather than inline full manuals.
- `agents.md`: 398 lines read in chunks `1-220` and `221-398`.
- `AGENTS.md`: 398 lines; byte-identical to `agents.md` at planning time.
- `CLAUDE.md`: symlink to `agents.md`.
- `plugins/shravan-dev-workflow/skills/skill-audit/SKILL.md`: 72 lines read.
- `tests/skills/README.md`: 74 lines read.
- `plugins/README.md`: 72 lines read.
- `docs/changelog/README.md`: 44 lines read.
- Meta-skill references inspected this session:
  - `superpowers:writing-skills`
  - Codex system `skill-creator`
  - `shravan-dev-workflow:discuss-with-me`
  - `shravan-dev-workflow:tui-presentation`

## Current Evidence

- `agents.md` already functions as the repo-level map for plugins, sidecar,
  changelog expectations, skill authoring, plugin development, and validation.
- `agents.md` currently has a `Skill Authoring Discipline` subsection, but it is
  nested under plugin documentation and reads more like a checklist than a
  top-level SOP for skill work.
- `skill-audit` currently owns evidence-backed create/update/merge/skip
  decisions, but it does not explicitly connect those decisions to progressive
  skill shape or pressure-coverage recommendations.
- `tests/skills/README.md` already states the pressure harness goal, default
  backend/model/sandbox, local run command, artifacts directory, and limitations.
- The working checkout `/Users/shravansunder/dev/ai-tools` was behind
  `origin/master` by 4 commits and had unrelated untracked files at planning
  time: `node_modules/`, `package.json`, `pnpm-lock.yaml`, and `swiftlint/`.

## Requirements / Proof Matrix

| Requirement / Claim | Owning Task | Proof Owner | Proof Gate | Proof Layer | Stale-Proof Guard | Red/Green Required | Sized To Pass |
|---|---|---|---|---|---|---|---|
| `agents.md` / `AGENTS.md` teach skill work as repo SOP / table of contents, not as a buried checklist. | T1 | executor | inspect headings and section placement | docs static | re-read both files after patch; confirm they remain identical | no; docs orientation change | yes |
| The docs route to `skill-audit`, `superpowers:writing-skills`, `skill-creator`, and `tests/skills/README.md` by ownership. | T1 | executor | `rg` for each skill/reference and review surrounding text | docs static | verify no cache-path references are introduced | no | yes |
| The docs preserve boundary: `agents.md` owns routing and durable repo rules; skills own detailed mechanics. | T1 | executor + reviewer | read changed section for duplication / over-specific procedure | docs review | compare against `writing-skills` and `skill-creator` triggers before implementation | no | yes |
| The docs keep local pressure proof local-only and do not imply CI. | T1 | executor | `rg -n "GitHub Actions|CI|workflow|local"` around changed docs | docs static | re-read `tests/skills/README.md` before final wording | no | yes |
| `skill-audit` tells agents to include progressive shape and pressure coverage in audit recommendations when relevant. | T2 | executor | inspect `skill-audit/SKILL.md` diff | skill static | verify wording still keeps audit read-only by default | yes if behavior wording changes | yes |
| The T2 decision is explicit, not silently skipped. | T2 | executor | cite existing `skill-audit` lines that satisfy the criteria, or make T2/T3 mandatory | docs / skill static | current file must be re-read in the implementation worktree | no for decision, yes if behavior changes | yes |
| If `skill-audit` behavior changes, add or update one pressure scenario that catches the missing recommendation loop. | T3 | executor | red/green focused scenario with proof regex and artifact paths | local skill pressure | run baseline when possible; do not rely only on self-report JSON | yes | yes |
| User-visible plugin/docs behavior gets a changelog entry. | T4 | executor | changelog file plus README newest-first entry | docs static | follow `docs/changelog/README.md` entry rules | no | yes |
| Final validation distinguishes changed-surface proof from unrelated stale checkout / untracked file state. | T5 | executor | final status and validation summary | closeout | use a fresh `origin/master` worktree or update current checkout before implementation | no | yes |
| PR terminal is merge-ready, not merely locally validated. | T6 | implementation-pr-wrapup | PR URL, local HEAD vs PR head, checks, unresolved review threads/comments, base branch, mergeability, final re-fetch, merge authorization status | PR/release gate | refresh immediately before readiness claim | no | yes |

## Task Sequence

### T0. Start From A Clean Current Worktree

Before editing, create or switch to a clean worktree based on current
`origin/master`. Do not implement this plan directly in the observed stale root
checkout unless it has first been reconciled.

Suggested shape:

```bash
git fetch origin
git worktree add ../ai-tools.agents-skill-work-sop -b agents-skill-work-sop origin/master
cd ../ai-tools.agents-skill-work-sop
git status -sb
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD
```

If using the existing checkout instead, first explain the unrelated untracked
files and stale branch state, then get it current without deleting user files.
Before edits, confirm the implementation worktree is on a named branch and that
`git diff --name-only` is either empty or limited to this plan artifact.

### T1. Rework `agents.md` / `AGENTS.md` Skill SOP Structure

Update both files identically.

Recommended structure:

- Keep the existing single document title.
- Add or promote a clear high-level section near `Plugin Skills`, such as:
  `## Skill Work SOP`
- Make the section read as an orientation map:
  - `agents.md` is the repo SOP / table of contents.
  - Skill details live in the owning skills and references.
  - For skill creation or edits, load `superpowers:writing-skills` and
    `skill-creator`.
  - For deciding what to carve/update/merge/skip, use `skill-audit`.
  - For substantial `shravan-dev-workflow` behavior changes, add or update
    pressure scenarios and run local pressure proof.
  - For user-visible plugin behavior changes, update changelog and refresh
    installed plugin caches as applicable.
- Keep the existing `Adding a New Skill` mechanics, but make it subordinate to
  the SOP rather than the main mental model.
- Preserve existing plugin/marketplace/sidecar content unless a heading move
  requires local wording cleanup.

Do not paste long excerpts from meta-skills into `agents.md`.

### T2. Decide And Tighten `skill-audit` Meta Recommendation Criteria

Re-read `plugins/shravan-dev-workflow/skills/skill-audit/SKILL.md` after T1.
This is a decision gate, not an optional shrug:

- If the current skill already requires progressive skill shape and pressure
  coverage recommendations, cite the exact lines and skip T2/T3.
- If it does not, update `skill-audit` and run T3.

Candidate narrow additions:

- In candidate classification or output shape, require each relevant
  recommendation to say whether it is:
  - update existing skill
  - create new skill
  - merge overlapping skills
  - skip
- For update/create recommendations, include:
  - trigger / ownership fit
  - whether `SKILL.md` should remain compact and progressive
  - whether depth belongs in `references/`
  - whether deterministic mechanics belong in `scripts/`
  - whether pressure coverage exists, needs update, or is explicitly not needed

Keep `skill-audit` read-only by default. It should recommend the proof path; it
should not become the pressure runner.

If T2 changes `skill-audit`, this becomes a plugin behavior change. Expand write
surfaces to include required `shravan-dev-workflow` plugin version metadata and
marketplace entries, validate JSON metadata, and treat installed cache refresh
as a post-push proof gate.

### T3. Add Focused Pressure Coverage If `skill-audit` Changes

If T2 changes behavior, first inspect
`tests/skills/pressure-scenarios/skill-audit-evidence-first.md`. Extend it when
that is the smallest clear proof. Add a new focused scenario under
`tests/skills/pressure-scenarios/` only when the existing scenario would become
confusing or overbroad.

Candidate scenario:

```text
skill-audit-pressure-coverage-recommendation
```

The prompt should pressure the model to propose a skill/docs change from a vague
meta-process complaint. Expected compliant behavior should require:

- audit existing skill surface first
- classify update/create/merge/skip
- avoid creating a new broad meta-skill from vibes
- mention progressive shape and pressure proof when recommending a skill change

Add an independent `expect_proof_regex` for pressure coverage so the scenario
cannot pass by emitting only the broad decision shape.

Run red/green when feasible:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --scenario skill-audit-pressure-coverage-recommendation --timeout 360
```

Expected RED proof is a nonzero run against the pre-change skill or a documented
reason baseline could not be obtained. Expected GREEN proof is a zero-exit run
after the skill/scenario change, with artifact paths captured. If reusing
`skill-audit-evidence-first`, substitute that scenario name in the command and
record the decision in the changelog.

### T4. Add Changelog Entry

If implementation changes `agents.md`, `AGENTS.md`, `skill-audit`, pressure
scenarios, or plugin behavior, add a public-safe changelog entry:

```text
docs/changelog/2026-06-19-agents-skill-work-sop.md
```

Update `docs/changelog/README.md` newest-first.

The entry should include:

- affected docs and skills
- user-visible behavior change
- validation commands and results
- refresh/reinstall status if plugin behavior changes

If implementation stays docs-only, no plugin version bump is needed. If T2
changes `skill-audit`, include the `shravan-dev-workflow` plugin version and
manifest/marketplace changes required by repo rules.

### T5. Validate Changed Surface

Minimum validation for docs-only T1/T4:

```bash
cmp -s agents.md AGENTS.md
test "$(readlink CLAUDE.md)" = "agents.md"
rg -n "^## Skill Work SOP$" agents.md AGENTS.md
rg -n "skill-audit" agents.md AGENTS.md
rg -n "superpowers:writing-skills" agents.md AGENTS.md
rg -n "skill-creator" agents.md AGENTS.md
rg -n "tests/skills/run-skill-pressure-tests.sh --fast" agents.md AGENTS.md
git diff --name-only
```

Additional validation if T2/T3 changes skill behavior:

```bash
uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/shravan-dev-workflow/skills/skill-audit
tests/skills/run-skill-pressure-tests.sh --fast --scenario skill-audit-pressure-coverage-recommendation --timeout 360
```

If the pressure scenario is added but the runner is unavailable or fails outside
the changed surface, stop and report the scoped pass/fail state before changing
runner infrastructure.

Additional validation if T2 changes plugin behavior:

```bash
jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json
uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/shravan-dev-workflow
```

Post-push cache refresh is required for plugin behavior changes and home-level
mutation should be reported as such:

```bash
codex plugin add shravan-dev-workflow@ai-tools --json
codex plugin list --json
```

### T6. Implementation Review And PR Merge-Ready Wrapup

After implementation proof passes, use `implementation-review-swarm` for the
changed docs/skill/proof/changelog surface. Address accepted findings or record
explicit rejections with evidence.

Then use `implementation-pr-wrapup` to push/open/update the PR and prove
merge-readiness. The readiness report must include:

- PR URL
- local branch and local HEAD
- PR head SHA and whether local HEAD equals PR head
- PR base branch and whether it matches the intended base
- fresh checks state
- unresolved review-thread/comment state
- mergeability state after final re-fetch
- merge authorization status

Do not merge unless the user explicitly authorizes merge after this readiness
proof.

## Write Surfaces

Primary:

- `agents.md`
- `AGENTS.md`

Conditional:

- `plugins/shravan-dev-workflow/skills/skill-audit/SKILL.md`
- `tests/skills/pressure-scenarios/skill-audit-pressure-coverage-recommendation.md`
- `tests/skills/pressure-scenarios/README.md`
- `docs/changelog/2026-06-19-agents-skill-work-sop.md`
- `docs/changelog/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json` if T2 changes skill behavior
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json` if T2 changes skill behavior
- `.agents/plugins/marketplace.json` if plugin version metadata must change
- `.claude-plugin/marketplace.json` if plugin version metadata must change

No expected changes:

- GitHub Actions workflows
- sidecar scripts
- installed cache directories
- package metadata, unless plugin behavior changes require version metadata in the files above

## Rollback / Recovery

- Docs-only rollback: revert the changed `agents.md` / `AGENTS.md` sections and
  changelog entry.
- Skill behavior rollback: revert `skill-audit` wording and its pressure
  scenario together so the proof surface does not describe behavior no longer
  required.
- Plugin behavior rollback: also revert associated plugin version / marketplace
  metadata changes in the same commit.
- If implementation happens in a worktree, remove only that worktree after merge
  / closeout; do not delete the stale root checkout's unrelated untracked files.

## Risks

- Over-documentation risk: `agents.md` becomes a stale manual instead of a
  routing SOP. Mitigation: keep mechanics in owning skills and use short
  ownership bullets.
- Under-documentation risk: future agents still miss the meta-skill loop.
  Mitigation: promote the SOP near `Plugin Skills`, before the detailed
  `Adding a New Skill` steps.
- Proof theater risk: adding a pressure scenario that only checks for generic
  JSON compliance. Mitigation: require an independent proof regex tied to the
  actual failure mode.
- Drift risk: editing only `agents.md` or only `AGENTS.md`. Mitigation: validate
  `cmp -s agents.md AGENTS.md`.
- Detached-worktree risk: starting from `origin/master` without `-b` produces a
  poor PR surface. Mitigation: require a named branch and branch/HEAD proof
  before edits.

## Open Questions

- Should the high-level section be named exactly `Skill Work SOP`, or a softer
  `Working With Skills In This Repo`? Recommended default: use the explicit SOP
  name because the user's correction used SOP/table-of-contents language.

## Recommended Next Skill

Use `implementation-execute-plan` after this reviewed plan is re-read from the
implementation worktree. The terminal remains merge-ready PR via
`implementation-review-swarm` and `implementation-pr-wrapup`, not local
validation alone.
