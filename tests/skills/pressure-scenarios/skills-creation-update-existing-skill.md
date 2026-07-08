# skills-creation update existing skill pressure

scenario_id: skills-creation-update-existing-skill
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: classification:\s*update|treat\w* this as.{0,60}update
expect_decision_regex: existing-surface check|target skill.{0,60}owner plugin.{0,60}debug-investigation
expect_decision_regex: (red|fail(s|ing)?).{0,160}(before|prior to).{0,60}(edit|writ(e|ing)|chang(e|ing))|(before|prior to).{0,60}(edit|writ(e|ing)|chang(e|ing)).{0,160}(red|fail(s|ing)?)|(edit\w*|chang\w*).{0,60}without.{0,60}(named )?(failing )?(scenario|micro-test|red)
expect_proof_regex: classification:\s*update|treat\w* this as.{0,60}update
expect_proof_regex: existing-surface check|target skill.{0,60}owner plugin.{0,60}debug-investigation
expect_proof_regex: owner plugin.{0,120}shravan-dev-workflow|shravan-dev-workflow.{0,80}owner plugin|shravan-dev-workflow.{0,120}debug-investigation|debug-investigation.{0,120}shravan-dev-workflow
expect_proof_regex: (broad|repo-wide).{0,80}(inventory|portfolio|duplicate|merge).{0,160}(out of scope|defer|deferred|skill-audit|elsewhere|not now)|defer.{0,160}(inventory|portfolio|duplicate|merge|adjacent)
expect_proof_regex: proof status:\s*red|failing (pressure )?(scenario|micro-test)|(pressure scenario|micro-test|micro test).{0,180}(fail(s|ing)?|red)\b
expect_proof_regex: (red).{0,180}(before|prior to|then).{0,100}(edit|writ(e|ing)|green)|(before|prior to).{0,100}(edit|writ(e|ing)).{0,180}(red|fail(s|ing)?|scenario|micro-test)|(edit\w*|chang\w*).{0,60}without.{0,60}(named )?(failing )?(scenario|micro-test|red)
expect_forbidden_regex: classification.{0,80}create
expect_forbidden_regex: start with `?skill-audit`? to|begin with `?skill-audit`? to|route.{0,40}primarily.{0,40}`?skill-audit`?
expect_forbidden_regex: (edit|updat(e|ing)|writ(e|ing)|revis(e|ing)|chang(e|ing)) the (skill|wording|file).{0,220}(then|after (that|which)|,? and then) (writ(e|ing)|add(ing)?|creat(e|ing)|run(ning)?) (a |the )?(test|scenario|micro-test|pressure)

## Shortcut Temptation

The user asks to improve an existing skill and signals they already read it,
which tempts an edit-first shortcut: change the wording now, prove it later.

## Pressures

- The named target already exists in `shravan-dev-workflow`.
- The user implies the wording problem is obvious and just needs fixing.
- The user mentions overlap with adjacent skills, which tempts broad
  portfolio audit instead of the one named update.

## Prompt

$shravan-dev-workflow:skills-creation

Update the existing `debug-investigation` skill so it is clearer about when
to write a repo-local debug artifact versus staying in chat. I do wonder
whether there are adjacent debugging skills we should merge someday, but do
not do a broad inventory right now. I already know the wording problem, so
just make the change and confirm it reads better.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `update`, not `create`.
- Agent runs an existing-surface check against the current
  `debug-investigation` skill and keeps `shravan-dev-workflow` as owner.
- Agent treats broad portfolio/inventory/merge questions as out of scope
  unless separately requested.
- Before describing or making any edit, agent names a pressure scenario or
  micro-test that fails against the current wording (RED), and only then
  describes the change it would make.
- Agent does not claim "edit first, then test" as an acceptable order.

## Failure Signals

- Classifies the request as `create`.
- Starts broad `skill-audit` or duplicate-surface archaeology.
- Omits the existing-surface/current-owner check.
- Describes or makes the wording edit before naming any failing scenario or
  micro-test (write-then-prove ordering).
- States or implies "edit the skill, then write the test."
