# Discuss Clarify Mental Models: Alignment Signal Card

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.37` -> `1.6.38`
- Extends the same-day entry
  [2026-07-04 Discuss Clarify Mental Models](2026-07-04-discuss-clarify-mental-models.md)
  after an evaluate pass under `creating-skills`.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/SKILL.md`
  sharpened (119 lines, still no `references/` folder).
- Added
  `tests/skills/pressure-scenarios/discuss-clarify-mental-models-drift-interrupt.md`,
  covering a mid-task interrupt where the user invokes the signal while
  artifact work is implied in-flight.
- Updated `discuss-clarify-mental-models-reconverge.md`'s forbidden-regex to
  stop flagging a compliant mention of the old ritual name.
- Updated `tests/skills/pressure-scenarios/README.md` with the new scenario
  row.
- Bumped `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`,
  `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`, and
  `.claude-plugin/marketplace.json` to `1.6.38`.

## User-Visible Behavior Changes

- The skill is now framed as a bidirectional drift signal card: either side
  invokes it the moment the shared model feels off (repeated corrections,
  hollow or instant agreement, surprise at a plan or architecture), not only
  when the user asks to discuss.
- Invocation now explicitly interrupts in-flight edits and queued artifact
  work; the contract owns the turn until the model reconverges.
- A new "Drift Signals" list names the concrete agent-side self-invocation
  triggers.
- The output contract is now scoped by frequency: full contract on the first
  response, when the model materially changes, and at close; interim turns
  may carry only changed fields.
- The skill ends with a selecting question only when real branches remain and
  the user must choose; there is no ritual one-question rule.
- Adopted "none -- answering from session memory" for undischarged evidence
  claims.
- Removed the future-discussion-surfaces paragraph and the `discuss-with-me`
  route-target row from this skill's body.

## Known Open Item

- `discuss-with-me` remains installed for now; its retirement is deliberately
  deferred to a later changeset. Until then the two descriptions overlap on
  "reflect back"/"reconverge"-style triggers, so model-invoked routing between
  them is not deterministic; explicit invocation always selects correctly.

## Validation

- A no-guidance control run of the new
  `discuss-clarify-mental-models-drift-interrupt` scenario against the
  pre-edit skill text passed 10 of 11 assertions; the one miss was an
  over-literal test expectation (`load-bearing` phrase), not a skill defect.
  Disclosed because part of the wording work above was motivated by the
  requested product framing, not by a failing test.
- `discuss-clarify-mental-models-reconverge.md`'s forbidden-regex fix leaves
  one known residual false-positive risk: a compliant sentence describing the
  old ritual in past tense is grammatically indistinguishable from an actual
  rule violation under the current regex. Flagged for future tightening.
- The new drift-interrupt scenario was initially flaky at `gpt-5.5`/low
  effort: two `expect_proof_regex` assertions failed intermittently against
  genuinely compliant output using different wording. Both regexes were
  broadened using nine captured live transcripts as ground truth; neither
  addition matches the operator prompt text (no rubric leak).
- `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-drift-interrupt --serial --timeout 900` (run twice, fresh, post-fix) -- both passed, 1/1 each.
- `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-reconverge --serial --timeout 900` -- passed, 1/1.
- Codex `skill-creator` quick validator on the skill -- `Skill is valid!`.
- `claude plugin validate .` -- `Validation passed`.
- `jq` over the four plugin/marketplace manifests -- all valid.
- `pnpm --dir tests/skills exec tsc --noEmit` -- passed.
- `git diff --check` -- passed.

## Refresh Status

- Codex installed-cache refresh: deferred; not run. Installed-cache refresh is
  an explicit post-release step, not source validation.
- Claude installed-cache refresh: deferred; not run, for the same reason.
