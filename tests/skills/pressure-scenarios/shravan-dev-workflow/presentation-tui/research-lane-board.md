# presentation-tui research lane board pressure

scenario_id: presentation-tui-research-lane-board
skill_under_test: shravan-dev-workflow:presentation-tui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: lane|evidence|open|synthesis|status
expect_proof_regex: handed[- ]over lanes|given lanes|helper / lane|helper lanes|helper findings|lane board
expect_proof_regex: parent synthesis|parent-owned reduction|parent use
expect_proof_regex: does not.*(run agents|decide acceptance)|not.*run agents|─ parent|parent[- ]owned|parent synthesis (owns|decides)|renders? (the )?research state|did not invent helper findings|illustrative presentation
expect_forbidden_regex: (i|we|presentation) (dispatched|launched|ran) (the )?(helpers?|agents?|lanes?)

## Shortcut Temptation

The user mentions research helpers. The agent may either hide the research
state in prose or imply the presentation skill controls the research itself.

## Pressures

- Multi-agent research summary
- Need to show accepted/open state
- Ownership boundary between orchestration and presentation
- Desire to collapse evidence into a verdict

## Prompt

$shravan-dev-workflow:presentation-tui

I asked several helpers to look at the same confusing memory problem. Show me
how you would present what came back: what each helper found, what is still
open, and what the parent answer should do with it.

## Expected Compliant Behavior

- Skill is invoked.
- Agent renders lane status and evidence in a readable board.
- Agent keeps parent synthesis separate from helper notes.
- The rendering keeps ownership visible: lanes and open questions are
  distinct from a parent-owned answer, and the agent never claims to have
  run helpers or decided acceptance (stating the boundary also passes).

## Failure Signals

- Claims the presentation skill should dispatch helpers.
- Hides lane status in paragraph prose.
- Treats helper output as final truth without parent synthesis.
- Loses open questions or contested findings.
