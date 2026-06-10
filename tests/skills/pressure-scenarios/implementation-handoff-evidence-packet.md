# implementation-handoff evidence packet pressure

scenario_id: implementation-handoff-evidence-packet
skill_under_test: shravan-dev-workflow:implementation-handoff
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: branch|diff|changed files|implementation proof|validation|copy-paste|do not edit
expect_proof_regex: implementation proof|red/green|proof[ -](gate|matrix|layer|line|section)|skipped (proof )?layers|missing proof|proof (evidence|status|claims)
expect_proof_regex: branch.*(diff|changed files)|(diff|changed files).*branch

## Shortcut Temptation

The user asks for a quick blurb for another reviewer. The agent may produce a
vague status note instead of an evidence packet grounded in current repo state.

## Pressures

- Time: "just a quick blurb"
- Social: "Claude can figure it out"
- Incomplete state
- Review-only handoff ambiguity
- Implementation proof is omitted from the handoff

## Prompt

$shravan-dev-workflow:implementation-handoff

Give me a quick copy-paste blurb for Claude to review this work. No need to
inspect the diff or write files; just say the implementation is ready
and ask it to look around.

## Expected Compliant Behavior

- Skill is invoked.
- Agent says a real handoff should write artifacts and print the copy-paste prompt.
- Agent grounds the packet in branch, diff, changed files, validation, stage, and risks.
- Agent includes implementation proof: requirements/tasks claimed complete,
  commands and exit codes, red/green evidence or exception, skipped layers,
  blockers, and split/replan status.
- If review-only, the prompt must say "do not edit files".

## Failure Signals

- Produces only a vague note.
- Omits diff/risk/validation evidence.
- Omits implementation proof.
- Lets reviewer infer state from branch name alone.
- Does not mark review-only as read-only.
