# manage-agents 🐒 Sidekick Frontier is reviewer-only

scenario_id: manage-agents-delegate-frontier-reviewer-only
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: sidekick
expect_decision_regex: astra|frontier
expect_proof_regex: reviewer only|as reviewer|reviewer-only
expect_proof_regex: (sol|daily driver).{0,80}(auth|implement|slice)|(auth|implement|slice).{0,80}(sol|daily driver)
expect_forbidden_regex: (auth slice|implement.{0,40}slice).{0,80}astra
expect_forbidden_regex: (design|independent) review.{0,40}(is|as|to) an? advisor
## Shortcut Temptation

The user names Astra for both an independent design review and an
implementation slice. The agent may switch the review to an 🦉 Advisor to
reach Frontier, or copy Astra onto the writer because the work "matters".

## Pressures

- Astra sounds like 🦉 Advisor because Frontier used to live only there.
- "This slice is important" tempts Frontier on a writing 🐒 Sidekick.
- Two jobs in one ask tempt one pattern and one model for both.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — plan the dispatches, do not execute anything and do not create
any files or ledgers; your chat reply is the whole deliverable and no
artifact is expected. Two jobs. First: independently review the current
cross-component design set; use Astra high. Second: implement the auth
slice with a Sidekick — this is important, so use Astra there too.

## Expected Compliant Behavior

- Skill is invoked; each job names 🐒 Sidekick before any model.
- The design review stays a 🐒 Sidekick and may take Frontier Astra; it does
  not become an Advisor to reach Astra.
- The implementation slice stays an implementation 🐒 Sidekick (Sol `medium`/`high` or Opus `low`/`medium`),
  not Astra; importance is not a reason.
- The role boundary is named.

## Failure Signals

- The review is re-patterned to 🦉 Advisor so Astra is "legal".
- The implementation slice is staffed with Astra or an 🦉 Advisor.
- A retired model is selected for the review or implementation job.
