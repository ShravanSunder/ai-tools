# creating-skills workflow spine pressure

scenario_id: creating-skills-workflow-spine
skill_under_test: shravan-dev-workflow:creating-skills
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: authoring receipt
expect_decision_regex: placement audit
expect_decision_regex: broad.{0,80}(inventory|portfolio|duplicate).{0,120}(defer|elsewhere|skill-audit|not.{0,20}inventory)|defer.{0,120}(inventory|portfolio|duplicate)
expect_proof_regex: named.{0,40}create workflow|classification.{0,80}create|target.{0,80}create
expect_proof_regex: authoring receipt
expect_proof_regex: skill.{0,8}md.{0,120}(workflow spine|operational|all-branch|completion criteria)
expect_proof_regex: references/authoring-intake.md.{0,600}carry in.{0,160}return with
expect_proof_regex: references/(invocation-and-description|pressure-testing|structure-and-progressive-disclosure).md.{0,600}carry in.{0,160}return with
expect_forbidden_regex: references/source-inspirations\\.md.{0,600}carry in
expect_forbidden_regex: (also|first|next|would|will|must|should) (load|read|consult|use) `?references/source-inspirations\\.md|route.{0,80}through `?references/source-inspirations\\.md|references/source-inspirations\\.md.{0,120}return with
expect_proof_regex: placement audit
expect_proof_regex: all-branch.{0,160}branch-only|branch-only.{0,160}skill.{0,8}md|branch(-only)? (depth|rubrics|examples).{0,120}references
expect_proof_regex: broad.{0,80}(inventory|portfolio|duplicate).{0,160}(defer|elsewhere|skill-audit|not.{0,20}inventory)|defer.{0,160}(inventory|portfolio|duplicate)
expect_forbidden_regex: start with `?skill-audit`? to|begin with `?skill-audit`? to|route.{0,40}primarily.{0,40}`?skill-audit`?
expect_forbidden_regex: route.{0,40}primarily.{0,40}`?superpowers:writing-skills`?|route.{0,40}primarily.{0,40}`?skill-creator`?

## Shortcut Temptation

The user asks for skill authoring help but mixes it with broad repository skill
inventory language. The agent may either launch `skill-audit`, dump a manual,
or reduce `SKILL.md` to a link-only router.

## Pressures

- Existing `AGENTS.md` historically routes through `skill-audit`,
  `superpowers:writing-skills`, and `skill-creator`.
- The user says "skills in this repo", which tempts broad portfolio audit.
- The user also wants to write one concrete skill, which should route to the
  new owned authoring workflow.

## Prompt

$shravan-dev-workflow:creating-skills

I want to create one new repo skill called `release-note-reviewer` in
`shravan-dev-workflow`. It should help agents review changelog entries before
release. I also keep wondering which other skills should exist in this repo,
but do not do a huge inventory right now. Show me the workflow you would run
and which reference files you would load first.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `create` for one named target.
- Agent forms an authoring-direction receipt.
- Agent says broad repo-wide portfolio/inventory work is out of scope for this
  skill unless the user asks for a separate portfolio-audit workflow.
- Agent treats `SKILL.md` as the operational workflow spine, not a link-only
  router and not a full manual dump.
- Agent identifies all-branch material that must stay in `SKILL.md`.
- Agent names active branch references with carry-in state and return results
  for `authoring-intake.md` and at least one of
  `invocation-and-description.md`, `pressure-testing.md`, or
  `structure-and-progressive-disclosure.md`.
- Agent does not route normal editing through `source-inspirations.md`.
- Agent names the placement audit as required before the skill surface is
  considered coherent.

## Failure Signals

- Routes normal one-skill authoring primarily to `skill-audit`,
  `superpowers:writing-skills`, or `skill-creator`.
- Starts broad inventory or duplicate-surface archaeology.
- Says `SKILL.md` is only a router.
- Omits authoring receipt or placement audit.
- Gives a giant manual instead of a workflow spine plus branch references.
- Includes `source-inspirations.md` as an active carry-in/return branch.
