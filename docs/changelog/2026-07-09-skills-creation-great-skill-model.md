# Skills Creation Great Skill Model

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.45` -> `1.6.49`

## User-Visible Behavior Changes

- Rebalanced `skills-creation` around the great-skill craft model instead of a
  proof-first authoring ritual.
- Collapsed the top-level great-skill model into a compact four-surface frame
  so the workflow remains the operational source of truth.
- Made YAML/frontmatter trigger design explicit: when to load, trigger
  situations, brief payoff, adjacent-route boundaries, and no workflow summary.
- Made `SKILL.md` the home for the mental model, leading words, main path, and
  checkable completion criteria.
- Added workflow topology guidance between main-path design and reference
  placement so skills define the all-run spine, branch predicates, branch
  destinations, and return shapes before moving depth into references.
- Added schema-family guidance for complex skills: use `lane-schema`,
  `output-schema`, or `tool-schema` when a reusable shape is actually shared,
  while ordinary skills stay at `SKILL.md` plus references.
- Added detailed rubrics for frontmatter design, workflow topology, and
  reference-file design.
- Collapsed duplicated placement ladders so `reference-design.md` owns
  SKILL/reference/script/glossary placement, `workflow-topology.md` owns route
  and branch returns, and `schema-design.md` owns only reusable schema families.
- Added a default implementation review gate for non-trivial skill changes with
  two reviewer perspectives, external counsel only when explicitly requested,
  parent reduction, and targeted pressure retest before `PR-ready` or
  `released`.
- Split skill review into `skill-spec-review.md` before implementation and
  `skill-implementation-review.md` after pressure proof, before ship.
- Added `skill-review-output-schema.md` as the single home for shared review
  packets, lane findings, changed-file coverage, and parent reductions.
- Reworked reference-file openings so references state what they own and return
  instead of repeating self-load conditions already owned by `SKILL.md`.
- Moved RED-before-edit into an early hard gate for behavior-changing updates,
  while keeping creates on hypothesized baselines and mechanical edits
  static-only.
- Rewrote the skill trigger description around observable skill-authoring
  symptoms instead of listing internal craft surfaces.
- Added invocation capability guidance to the main trigger-design step so new
  skills choose model-invocable and user-invocable behavior before description
  wording.
- Added platform-specific invocation-control guidance: keep client-specific
  controls in `platform-mechanics.md`, not default shared skill text.
- Kept pressure testing visible in `SKILL.md`, but refocused it as the proof
  gate for behavior-changing skill text rather than the identity of the skill.
- Reworked `glossary.md`, `skill-spec-review.md`, and
  `pressure-testing.md` around invocation, information hierarchy, steering,
  pruning, and typed proof strategy.
- Updated focused `skills-creation-*` pressure scenarios so they test trigger
  quality, mental-model guidance, reference placement, and proof discipline
  without forcing the old full Authoring State ceremony.
- Updated repo routing summaries in `AGENTS.md` and plugin READMEs so future
  agents inherit the same model.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/frontmatter-design.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/glossary.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/platform-mechanics.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-spec-review.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/pressure-testing.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-design.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/schema-design.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-implementation-review.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-review-output-schema.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-security-review.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/workflow-topology.md`
- `tests/skills/pressure-scenarios/skills-creation-*.md`
- `tests/skills/pressure-scenarios/README.md`
- `AGENTS.md`
- `plugins/README.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- Codex skill quick validation from the active installation against
  `plugins/shravan-dev-workflow/skills/skills-creation`
  - Exit 0: `Skill is valid!`
- Focused pressure scenarios after the final RED/invocation/description changes:
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-workflow-spine --timeout 900`
    - Exit 0: 1 test passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-draft-artifact --timeout 900`
    - Exit 0: 1 test passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-update-existing-skill --timeout 900`
    - Exit 0: 1 test passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-evaluate-draft --timeout 900`
    - Exit 0: 1 test passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-spec-review-gate --timeout 900`
    - Exit 0: 1 test passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-implementation-review-gate --timeout 900`
    - Exit 0: 1 test passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-platform-artifact-scale --timeout 900`
    - Exit 0: 1 test passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario skills-creation-security-and-cache-boundary --timeout 900`
    - Exit 0: 1 test passed.
- `pnpm --dir tests/skills exec tsc --noEmit`
  - Exit 0.
- `pnpm --dir tests/skills exec vitest run lib/pressure-assertions.test.ts --config vitest.config.ts`
  - Exit 0: 11 tests passed.
- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json`
  - Exit 0.
- `claude plugin validate .`
  - Exit 0: validation passed.
- `git diff --check`
  - Exit 0.
- Broad fast pressure suite:
  - `tests/skills/run-skill-pressure-tests.sh --fast`
  - Interrupted after unrelated non-owned failures in
    `debug-investigation-background-monitoring` and
    `discuss-clarify-mental-models-map-building`; focused
    `skills-creation-*` scenarios above were run separately and passed.

## Refresh Status

- Codex installed-cache refresh: not run. Cache refresh is a home-level
  mutation and remains an explicit release/readback step.
- Claude installed-cache refresh: not run, for the same reason.
