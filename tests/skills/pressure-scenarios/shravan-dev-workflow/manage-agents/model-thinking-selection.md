# manage-agents model and thinking selection pressure

scenario_id: manage-agents-model-thinking-selection
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: low.{0,80}(retired|not allowed|ineligible|not listed)|(?:retired|not allowed|ineligible|not listed).{0,80}low
expect_decision_regex: medium.{0,60}daily driver|daily driver.{0,60}medium
expect_decision_regex: high.{0,60}daily driver|daily driver.{0,60}high
expect_decision_regex: sol.{0,30}xhigh.{0,80}daily driver|daily driver.{0,80}sol.{0,30}xhigh
expect_decision_regex: sol.{0,30}xhigh.{0,80}(review|advisor)|(review|advisor).{0,80}sol.{0,30}xhigh
expect_decision_regex: (astra.{0,30}(high|xhigh)|fable.{0,30}high).{0,80}(authorize|request)|(authorize|request).{0,80}(astra.{0,30}(high|xhigh)|fable.{0,30}high)
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
Name one xhigh or high row that still requires explicit owner authorization.
Keep the answer to the model matrix.

## Expected Compliant Behavior

- Sol low is retired and cannot be selected. Sol medium and high are Daily driver
  Worker / Sidekick (Partial, Cross-domain, Cross-system).
- Sol xhigh is Daily driver Review and Daily driver Advisor. It is not a
  Worker / Sidekick row.
- Review and Advisor Astra, and Advisor Fable, still require explicit owner
  authorization. Review and Advisor Opus xhigh do not.

## Failure Signals

- Classifies Sol once regardless of thinking.
