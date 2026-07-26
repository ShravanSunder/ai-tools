# 2026-07-26 Skills Creation Review Lanes

Plugin: `shravan-dev-workflow` 1.6.70 (shipping status: source-only; not published, no cache refresh)

## User-visible behavior change

`skills-creation` review changed from two vague perspective gates to named
content lanes, dispatched by the artifact under review.

Before, both review steps said "use two read-only perspectives:
`fresh-perspective` plus a second independent local perspective." That named
*who* reviews, which `manage-agents` already owns, and never named *what to
check*. Reviews checked contract conformance thoroughly and skill quality
barely.

Now `SKILL.md` carries a `Review Lanes` section that owns lane selection
outright, behind two ordered gates and a surface table.

**Gate 1 — change class.** A mechanical change dispatches nothing and takes
static validation only.

**Gate 2 — artifact.** A proposal exists only in conversation and dispatches
exactly `mental-model-fit`, `trigger-routing`, and `rule-agreement`.
`no-op-pruning`, `placement-and-calls`, and `claim-vs-evidence` need line-level
text, call sites, and real transcripts — dispatched at spec time they would open
the currently shipped file, find it consistent because it shipped, and return a
clean receipt about text nobody proposed. Changed files go to the table.

```text
SKILL.md body (main path)          -> placement-and-calls, steering-strength,
                                      mental-model-fit, no-op-pruning,
                                      rule-agreement
reference text (depth)             -> rule-agreement, no-op-pruning
frontmatter or description (trigger)-> trigger-routing
a behavior-proof claim (proof)     -> claim-vs-evidence
a sensitive surface                -> sensitive-surface
```

The rows are the four surfaces of the Great Skill Frame plus the security gate,
so the table is a visible walk of the skill's own lens. Artifact and change
class are gates rather than rows because they select *whether* the table
applies, not *which* surface changed — as rows they contradicted it.

**No collector.** The parent synthesizes: merge duplicates across lanes, resolve
conflicts against the artifact, name coverage gaps, rank. No lane reads another
lane's receipt, so review is a single readiness wave with no barrier.

Workflow steps 9-11 became one review-then-prove loop. Proof runs after review,
so a proof run is not spent on text the review is about to change.

## Changed surfaces

- Added `skills/skills-creation/references/lanes/` with eight lane contracts:
  `rule-agreement`, `no-op-pruning`, `placement-and-calls`, `steering-strength`,
  `mental-model-fit`, `trigger-routing`, `claim-vs-evidence`,
  `sensitive-surface`. Each carries its own mission, rubric, overlap boundary,
  and stop condition; selection and the shared contract live outside them.
- Lane dispatch routes through `manage-agents` as a reviewer, which owns
  `parent conversation history: none` and `workspace access: read-only`. Native
  dispatch is preferred; at least one lane should use a different model lineage
  than the author when the runtime can reach one.
- `references/skill-review-lane-schema.md` (renamed from
  `skill-review-output-schema.md`) gained a `Common Lane Contract` stated once,
  so receipt shape and dispatch terms are not repeated per lane. Parent
  Reduction absorbed the synthesis fields. The `provider` field was removed; it
  conflated content-lane identity with model provider.
- `SKILL.md`: `Review Lanes` added; steps 9-11 restructured; step 6 now owns
  writing call sites including dispatch sites; the readiness-gate predicate is
  observable instead of circular.
- Completion Blockers went from 15 to 17. The dispatch blocker accepts a named
  shared dispatch contract instead of requiring six fields at every call site.
  Added: review running outside the Review Lanes contract, and implementation
  deviating from the accepted spec without naming it.
- `Scaled Run Note` gained `review lanes dispatched:` and `lane receipts:`.
- `references/skill-spec-review.md` and `skill-implementation-review.md`:
  provider-axis perspective lists removed; rubric lines that restated lane
  qualification, caller forms, authority, and shape families removed. The
  implementation reference no longer declares the pre-change proof-then-review
  order.
- `references/reference-design.md`: `references/lanes/<lane>.md` added to the
  placement ladder.
- `references/glossary.md`: entries now explained in `SKILL.md` removed.
- Pressure scenarios: `skills-creation-spec-review-gate.md` updated to lane
  vocabulary and authoring-basis assertions; `skills-creation-review-lane-scaling.md`
  added.

## Validation

- `claude plugin validate .` passed; JSON manifests parse.
- `codex plugin list --marketplace ai-tools --available --json` run; the Codex
  surface resolves `shravan-dev-workflow@ai-tools` (installed cache still at
  1.6.63, not refreshed).
- All `references/` pointers in `skills-creation` resolve, including the
  cross-skill relative paths into `manage-agents`.
- Markdown tables aligned and code fences balanced across all changed files.
- Lane selection has one home: the `SKILL.md` table. No lane file carries a
  `Status:` line or a `When to run:` block.
- Dispatch terms appear once, in the common lane contract; zero lane files
  restate authority or history.
- No lane consumes another lane's receipt — single readiness wave confirmed.
- Every lane's H1 matches its filename, so receipts key on the dispatched name.
- `pnpm --dir tests/skills exec vitest run lib` and `tsc --noEmit` clean. Note
  these exercise the harness library, which this change does not touch, so they
  are not evidence about the changed files.
- `SKILL_PRESSURE_BACKEND=fake … --scenario skills-creation-review-lane-scaling`
  run: the new scenario parses and its regexes compile and evaluate. The fake
  backend returns a canned non-agent response, so this is parse proof only, not
  assertion proof.

## Proof gap

Behavior proof is **not** established. `tests/skills/run-skill-pressure-tests.sh
--fast` has not been run against this change; shipping status is `source-only`.
The named scenarios exercise lane SELECTION via the `SKILL.md` table. They do
not reach `references/lanes/*.md` content: the harness source hint names
`SKILL.md` only, so lane-file behavior is a separate, still-open proof gap.

Version and marketplace metadata were bumped to 1.6.70. Nothing was published
and no installed cache was refreshed; shipping status remains `source-only`.
