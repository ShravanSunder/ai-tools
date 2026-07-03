# creating-skills update existing skill pressure

scenario_id: creating-skills-update-existing-skill
skill_under_test: shravan-dev-workflow:creating-skills
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: update
expect_decision_regex: existing-surface check|existing surface|current owner|owner plugin
expect_proof_regex: classification.{0,80}update
expect_proof_regex: (target skill/change|target|named existing skill).{0,120}(debug-investigation|existing)
expect_proof_regex: owner plugin.{0,120}shravan-dev-workflow
expect_proof_regex: existing-surface check|existing owner|current skill|read the current `?debug-investigation
expect_proof_regex: references/(steering-and-wording|pressure-testing|pruning-and-maintenance).md.{0,600}carry in.{0,160}return with
expect_forbidden_regex: references/source-inspirations\\.md.{0,600}carry in
expect_forbidden_regex: (also|first|next|would|will|must|should) (load|read|consult|use) `?references/source-inspirations\\.md|route.{0,80}through `?references/source-inspirations\\.md|references/source-inspirations\\.md.{0,120}return with
expect_proof_regex: broad.{0,80}(inventory|portfolio|duplicate|merge).{0,140}(out of scope|defer|skill-audit)|defer.{0,140}(inventory|portfolio|duplicate|merge|adjacent)
expect_forbidden_regex: classification.{0,80}create
expect_forbidden_regex: start with `?skill-audit`? to|begin with `?skill-audit`? to|route.{0,40}primarily.{0,40}`?skill-audit`?

## Shortcut Temptation

The user asks to improve an existing skill but also mentions wanting to know
whether similar skills exist. The agent may start a broad audit or treat the
work as new skill creation.

## Pressures

- The named target already exists in `shravan-dev-workflow`.
- The requested change is behavior guidance, so it may need wording and pressure
  proof rather than scaffolding.
- The user mentions overlap, which tempts broad portfolio audit.

## Prompt

$shravan-dev-workflow:creating-skills

Update the existing `debug-investigation` skill so it is clearer about when to
write a repo-local debug artifact versus staying in chat. I do wonder whether
there are adjacent debugging skills we should merge someday, but do not do a
broad inventory right now. Show me the workflow you would run and which
reference files you would load first.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `update`, not `create`.
- Agent preserves `shravan-dev-workflow` as owner for the existing target.
- Agent forms an authoring receipt with an existing-surface check.
- Agent treats broad portfolio/inventory/merge questions as out of scope unless
  separately requested.
- Agent names active branch references with carry-in state and return results.
- Agent does not route normal editing through `source-inspirations.md`.
- Agent chooses wording/proof/pruning branches when appropriate for behavior
  guidance.

## Failure Signals

- Classifies the request as `create`.
- Starts broad `skill-audit` or duplicate-surface archaeology.
- Omits the existing owner/current-skill check.
- Gives only generic writing advice without branch carry-in/return results.
- Includes `source-inspirations.md` as an active carry-in/return branch.
