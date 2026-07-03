# Creating Skills Rewrite

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.35` -> `1.6.36`
- Supersedes: this entry replaces the prior iteration described in
  [2026-07-03 Creating Skills Authoring Spine Refinement](2026-07-03-creating-skills-authoring-spine.md);
  that entry's ledger/receipt/placement-audit sprawl and literal-label
  pressure regexes are the sprawl this rewrite removes.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/creating-skills/SKILL.md` rewritten
  from an "Authoring Contract + ledger + receipt + placement audit" body
  into a single ~145-line workflow spine: Stance, one required Authoring
  State block, six numbered steps with checkable completion criteria, and a
  Completion Blockers list.
- `references/` collapsed 12 files -> 6: `glossary.md` rewritten as the
  single vocabulary home (terms and meaning only, never rules or field
  lists); `great-skill-evaluation.md`, `pressure-testing.md`,
  `skill-security-review.md`, and `platform-mechanics.md` kept and edited to
  remove restated rules now owned once, elsewhere.
- Five references deleted: `authoring-intake.md`,
  `invocation-and-description.md`, `structure-and-progressive-disclosure.md`,
  `steering-and-wording.md`, `pruning-and-maintenance.md`. Their content
  moved into the spine steps or the glossary; no functionality lost.
- `references/source-inspirations.md` deleted from the active skill; its
  adaptation ledger moved unchanged to
  [`docs/changelog/references/creating-skills-source-inspirations.md`](references/creating-skills-source-inspirations.md)
  (historical/reference-only, not loaded during authoring).
- Six `tests/skills/pressure-scenarios/creating-skills-*.md` scenarios
  rewritten to grade judgment artifacts and canonical output shapes
  (state-block field labels, return labels, artifact filenames) instead of
  narration phrasing or filename recitation. One new scenario added:
  `creating-skills-draft-artifact`, which requires the agent to actually
  draft a small `SKILL.md` in chat and grades the artifact itself.

## User-Visible Behavior Changes

- RED-first is now enforced for behavior-changing updates: a failing
  pressure scenario or micro-test must be named before any edit is made or
  described, not after.
- Three contract additions, each a positive-output-contract fix for a
  specific observed failure mode, per the failure-form table:
  1. **Mandatory visible Authoring State block.** Motivating scenario:
     `creating-skills-update-existing-skill`, where the same classification
     and existing-surface-check judgment showed up as five different
     narrative sentence constructions across five independent runs, none of
     which any single regex could reliably anchor on. The Authoring State
     block (classification, target skill/owner plugin, reusable job,
     baseline, branches loaded, security route, proof status, shipping
     status) is now required, chat-visible output at the start of every
     run -- including chat-only runs with no file edits -- shown again in
     full at run completion, with only changed fields stated at
     intermediate step boundaries. It replaces the prior
     ledger/receipt/placement-audit trio and is the only *cross-branch*
     state artifact; branch references may define their own labeled return
     blocks that feed its fields.
  2. **Step-4 drafted-body placement contract, with a length-independent
     predicate.** Motivating scenario: `creating-skills-draft-artifact`,
     where the model's own words were that provider-specific depth "would
     normally move to references if it grew" -- treating branch-only as a
     length judgment it could defer rather than an observable predicate
     keyed to who consumes the material. The contract now states
     explicitly: branch-only material (a per-provider walkthrough, a
     per-case worked example, a rubric for one path) becomes a named
     reference pointer the first time it is drafted, short or not -- never
     inline body text pending later growth.
  3. **Per-step stop-condition slot.** Motivating scenario:
     `creating-skills-draft-artifact` again, where 5 of 6 early samples
     omitted any per-step completion criterion from the drafted body. Each
     step in a drafted skill body now ends with a checkable stop condition
     (a `Completion:` line or a named gate section such as `Stop
     Conditions`); the form is free, the slot is not.
- A proof gap may only coexist with shipping status `source-only`; anything
  `PR-ready` or `released` that changes behavior requires GREEN, not a gap.
- The reference taxonomy this skill also teaches by example is now explicit
  in spine step 3: `glossary.md` (terms only), `schema-<name>.md` (contracts
  shared by 2+ independent consumers), `lanes/<lane>.md` (swarm-lane focus
  deltas, with single-lane schemas colocated rather than promoted), and
  `<branch>.md` (branch-only depth).
- `great-skill-evaluation.md` now requires a `blocker overrides:` line in
  every reported verdict, stated even when the answer is `none`, replacing
  the deleted 40-point scorecard and literal required-gate-evidence block.

## Validation

- `claude plugin validate .` -- Validation passed.
- Codex `skill-creator` quick validator (`quick_validate.py`, run via
  `uv run --with pyyaml` for PyYAML) against
  `plugins/shravan-dev-workflow/skills/creating-skills/` -- `Skill is
  valid!` (spec gate 3; previously skipped unreported, now run and
  recorded).
- Per-scenario pressure results (live `codex exec`, `gpt-5.5`, low reasoning
  effort, fast/read-only mode), fresh serial runs, final state:
  - `creating-skills-draft-artifact`: 3/3 required repeats, GREEN. Verified
    behaviorally, not just by regex match -- each of the three transcripts
    showed genuine per-step `Completion:` lines (6-8 per draft) and named
    gate sections (`Stop Conditions`, `Removal Gate`), plus correct
    provider-depth routing to named `references/*.md` pointers.
  - `creating-skills-evaluate-draft`: 4/4 fresh runs across the session,
    GREEN.
  - `creating-skills-security-and-cache-boundary`: 2/2 required repeats,
    GREEN, plus additional confirming runs earlier in the session.
  - `creating-skills-workflow-spine`: 2/2 fresh runs across the session,
    GREEN.
  - `creating-skills-update-existing-skill`: 2/2 required repeats, GREEN.
    An earlier single-sample miss traced to a word-order limitation in the
    RED-first proof regex ("failing pressure scenario" vs. the regex's
    expected "pressure scenario ... failing" order); confirmed the run
    itself was fully RED-first compliant, then re-anchored the regex on the
    canonical `proof status: RED` state-block field and added the missing
    word order as a second alternation. Re-verified 2/2 fresh afterward.
  - `creating-skills-platform-artifact-scale`: 2/2 fresh runs across the
    session, GREEN.
- Honesty note on RED-baseline evidence: the pre-rewrite baseline for these
  scenarios is narrative plus early raw runs reconstructed by review, not a
  snapshot taken before any scenario file was edited; the earliest runs fail
  against the *current* (post-rewrite) regexes for reasons traceable to the
  spec's own wording changes, and the `creating-skills-platform-artifact-scale`
  baseline in particular is thinner than the others. Future scenario rewrites
  should snapshot the true pre-edit baseline before any scenario file changes
  land, not reconstruct it afterward.
- Spec proof-gate 4 originally named full repo-wide `--fast` suite parity as
  half of this changeset's proof; that half was superseded mid-changeset by
  the gate-2 amendment (GREEN = the six `creating-skills` scenarios passing
  fresh serial runs, not the full suite), per direction. The full repo-wide
  `--fast` suite was not used as the gate for this changeset; unrelated-skill
  scenario failures observed during two partial full-suite attempts are
  pre-existing and out of scope, reported upstream separately.

## Post-Review Fix Batch

A six-lane review swarm requested one same-session fix batch before ship:
single-home cleanup for the structural-vs-behavior rule (glossary and three
references now use the term without restating step 5's anti-conflation
directive), a length-independent cross-branch note on the Authoring State
block, a bounded-reproduction escape for step 2's baseline check, an
explicit reference to `skill-security-review.md`'s Sensitive Surfaces list
as the authoritative superset in step 4, three over-long inline glosses
shortened to <=5-word parentheticals, and four scenario regex fixes (three
of which were prompt-echo/decision-context bugs the swarm caught by reading
the files directly). SKILL.md is now 149 lines (`references/glossary.md`
70, `pressure-testing.md` 61, `great-skill-evaluation.md` 49,
`skill-security-review.md` 52). All six `creating-skills` scenarios were
re-run x1 fresh, serial, after these edits: full parity, all GREEN --
`claude plugin validate .` also re-confirmed passing.

## Refresh Status

- Codex installed-cache refresh: deferred; not run. Installed-cache refresh
  is an explicit post-release step, not part of source validation.
- Claude installed-cache refresh: deferred; not run, for the same reason.
