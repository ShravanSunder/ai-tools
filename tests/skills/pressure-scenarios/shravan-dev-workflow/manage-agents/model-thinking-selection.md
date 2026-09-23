# manage-agents model and thinking selection pressure

scenario_id: manage-agents-model-thinking-selection
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: low.{0,80}(retired|not allowed|ineligible|not listed)|(?:retired|not allowed|ineligible|not listed).{0,80}low
expect_decision_regex: medium.{0,60}balanced|balanced.{0,60}medium
expect_decision_regex: high.{0,60}balanced|balanced.{0,60}high
expect_decision_regex: xhigh.{0,80}(authorize|request)|(?:authorize|request).{0,80}xhigh
expect_decision_regex: composer.{0,40}mini
expect_decision_regex: composer.{0,80}(none|no thinking|without.{0,20}thinking)
expect_proof_regex: model-plus-thinking|thinking-to-category|model.{0,20}thinking.{0,20}combination|(thinking|effort).{0,60}categor|categor.{0,60}(thinking|effort)
expect_forbidden_regex: (thinking|effort)( setting)?.{0,10}(:|=|is|to pass).{0,10}(low|medium|high|xhigh|max)

## Shortcut Temptation

The user asks for model-category selection using Sol at different thinking
levels. The agent may classify by model name alone or treat every provider
effort as an allowed role choice.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. I can run GPT-6 Sol at low, medium, high, and xhigh.
Classify each combination against the current category and role policy.
Also classify Cursor Composer 2.5 and tell me which thinking setting to pass.
Keep the answer to the model matrix.

## Expected Compliant Behavior

- Sol low is retired and cannot be selected. Sol medium and high are Balanced.
- Sol xhigh is Frontier: an Advisor option only when the owner names it, and a
  Review row that requires explicit owner authorization.
- Composer 2.5 is Mini and has no thinking setting.

## Failure Signals

- Classifies Sol once regardless of thinking.
- Treats Sol xhigh as a default Review row.
