# Skills Creation Great Skill Model Plan

## Goal

Rewrite `shravan-dev-workflow:skills-creation` so it teaches the craft model
for making great skills, not just the proof protocol around skill edits.

The intended model:

- YAML/frontmatter is the trigger surface: when to load, what symptoms or
  decisions trigger it, and why to use it briefly.
- `SKILL.md` is the compact usage path plus mental model: how to think, what
  concepts pull the model into the right latent space, and how to author the
  main path.
- `references/` carries details, branches, examples, rubrics, platform
  mechanics, and longer proof protocols.
- Testing and pressure proof stay visible in `SKILL.md`, but as an evidence
  gate rather than the identity of the workflow.

## Non-Goals

- Do not redesign the whole skill portfolio.
- Do not remove pressure testing.
- Do not refresh installed Codex or Claude plugin caches.
- Do not change unrelated workflow skills.
- Do not clean up the stale exploratory worktree created during discussion.

## Source Coverage

- Chat decision from 2026-07-09: refocus `skills-creation` around "what makes a
  great skill" and keep testing as proof, not the spine.
- Current target skill:
  `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md`.
- Current references:
  `plugins/shravan-dev-workflow/skills/skills-creation/references/*.md`.
- Focused pressure scenarios:
  `tests/skills/pressure-scenarios/skills-creation-*.md`.
- Prior research source:
  `tmp/great skills/great-skills-sop/`.
- Inspiration sources read during design:
  Matt Pocock `writing-great-skills` and Obra Superpowers `writing-skills`.

## Plan

### Task 1: Rewrite the `SKILL.md` Spine

Write surfaces:

- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md`

Changes:

- Replace the mandatory first-class Authoring State block with a scaled run
  note used only when implementation, shipping, or disputed proof needs it.
- Add a top-level "Great Skill Model" section:
  trigger, mental model, path, references, steering, pruning, proof.
- Add explicit guidance for YAML/frontmatter:
  when to use, trigger symptoms, concise why, adjacent-route boundary, and no
  workflow summary.
- Add explicit guidance for `SKILL.md`:
  how to use the skill, how to name the mental model, leading words, completion
  criteria, and main path.
- Add explicit guidance for references:
  branch depth, details, examples, rubrics, mechanics, proof protocols, and
  strong context pointers.
- Keep pressure/testing visible as a final "Prove Under Pressure" step with
  typed proof by skill kind.

Checkpoint:

- The rewritten `SKILL.md` reads like the pattern future skills should follow:
  YAML triggers, `SKILL.md` teaches, references deepen, proof validates.

### Task 2: Rebalance References

Write surfaces:

- `plugins/shravan-dev-workflow/skills/skills-creation/references/glossary.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-design.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-spec-review.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/pressure-testing.md`

Changes:

- Make `glossary.md` match the intended axes:
  invocation, information hierarchy, steering, pruning, proof.
- Refocus the review/design references around the rubric:
  trigger, structure, mental model, steering, pruning, proof.
- Keep `pressure-testing.md` as the detailed proof strategy:
  discipline, technique, pattern, reference, and mechanical-change proof.

Checkpoint:

- Testing remains a strong reference, but it no longer dominates the main
  authoring identity.

### Task 3: Update Focused Pressure Scenarios

Write surfaces:

- `tests/skills/pressure-scenarios/skills-creation-*.md`
- `tests/skills/lib/pressure-assertions.test.ts` if scenario assertions require
  identifier or canonical-shape updates.

Changes:

- Stop treating mandatory visible Authoring State output as the central success
  signal.
- Add or adjust expectations for:
  trigger-writing quality, YAML/SKILL.md/references separation, mental-model
  guidance, leading-word/latent-space steering, reference pointer quality, and
  typed proof strategy.
- Keep at least one scenario that guards RED/GREEN or pressure-proof behavior
  so testing does not silently disappear.

Checkpoint:

- Focused scenarios fail before the rewrite or assertion update for the
  specific old behavior, then pass after the rewrite.

### Task 4: Changelog and Validation

Write surfaces:

- `docs/changelog/2026-07-09-skills-creation-great-skill-model.md`
- `docs/changelog/README.md`
- Plugin version metadata only if repo convention requires it for this
  user-visible skill behavior change.

Validation:

- Codex skill quick validator for
  `plugins/shravan-dev-workflow/skills/skills-creation`.
- Focused pressure scenarios for `skills-creation-*`.
- `pnpm --dir tests/skills exec tsc --noEmit` if pressure assertions change.
- `pnpm --dir tests/skills exec vitest run lib/pressure-assertions.test.ts --config vitest.config.ts`
  if pressure assertions change.
- `claude plugin validate .` if shared plugin validation is expected for the
  changed source skill.
- `git diff --check`.

## Requirements / Proof Matrix

| Requirement | Owning task | Proof | Layer | Freshness guard |
| --- | --- | --- | --- | --- |
| YAML guidance teaches trigger, why, and no workflow summary | Task 1 | focused scenario or manual readback plus validator | behavior/static | current diff |
| `SKILL.md` teaches mental model and usage path, not run ceremony | Task 1 | focused scenario and direct file review | behavior/static | current diff |
| References carry branch depth and details | Task 2 | direct file review and validator | static | current diff |
| Testing remains visible but subordinate | Tasks 1-3 | focused pressure scenario guarding proof behavior | behavior | fresh scenario run |
| Changed skill remains valid for plugin consumers | Task 4 | quick validator and plugin validation | static/package | current checkout |

## Execution DAG

```text
gate 0: confirm clean rewrite worktree and source files
  |
  v
Task 1: rewrite SKILL.md spine
  |
  +--> Task 2: rebalance references
  |
  v
Task 3: update focused pressure scenarios
  |
  v
targeted validation gate
  |
  v
Task 4: changelog, version decision, package/static validation
  |
  v
implementation-review-swarm
```

The work is mostly serial because scenario expectations should follow the
rewritten contract, not the old proof-heavy contract.

## Risks

- Overcorrecting by hiding pressure proof entirely.
- Leaving old pressure scenarios to force the old Authoring State ceremony.
- Making the main skill too philosophical and not operational enough.
- Forgetting this skill is shared by Codex and Claude plugin surfaces.

## Split / Replan Triggers

- If pressure scenario changes require broad test harness changes, split that
  into a separate plan.
- If plugin metadata/versioning becomes larger than a normal changelog bump,
  route the release mechanics through the platform reference and pause before
  cache refresh.
- If the rewrite changes the relationship with `skill-audit`, stop and
  reconverge before widening scope.

## Next Workflow

Use `implementation-execute-plan` to implement this plan in a clean repo
worktree for the skills-creation branch.
