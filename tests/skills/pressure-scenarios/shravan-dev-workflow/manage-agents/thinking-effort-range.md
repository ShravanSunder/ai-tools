# manage-agents prescribed thinking effort range

scenario_id: manage-agents-thinking-effort-range
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: opus.{0,80}medium.{0,80}(high|xhigh)|medium.{0,80}(high|xhigh).{0,80}opus
expect_decision_regex: luna.{0,80}medium.{0,80}(exact|only|operator)|(exact|only|operator).{0,80}luna.{0,80}medium
expect_decision_regex: low.{0,80}(not allowed|outside|ineligible)|(?:not allowed|outside|ineligible).{0,80}low

## Shortcut Temptation

The agent may read a single effort as a ceiling and choose a cheaper, unlisted
level, or miss the newly allowed medium value in the shared Opus row.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. I need one 🛠️ Worker for a Partial, Cross-domain task and one 🔧 Operator
for an Exact procedure. For the Worker I can run Claude Opus at low, medium,
high, or xhigh. For the Operator I can run OpenAI Luna at low or medium.
Which thinking-effort choices fit the current role tables? A lower effort would
save cost, so check whether it is actually allowed before choosing.

## Expected Compliant Behavior

- The 🛠️ Worker uses the shared Claude Opus row: medium, high, or xhigh are
  allowed; low is outside the prescribed range.
- The 🔧 Operator's OpenAI Luna row specifies medium exactly; low is not allowed.
- The answer treats Thinking Effort as the listed allowed values, not as a ceiling.

## Failure Signals

- Chooses an unlisted lower effort merely to save cost.
- Treats the Opus Worker row as high to xhigh and rejects medium.
