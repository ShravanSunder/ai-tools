# presentation-webui exact format precedence pressure

scenario_id: presentation-webui-exact-format-precedence
skill_under_test: shravan-dev-workflow:presentation-webui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: ^\s*\[\s*\{[\s\S]*\}\s*\]\s*$
expect_proof_regex: bare json|exact [^.]{0,25}format|format exception|json only with no|returned json only|requested format|format (wins|override|takes precedence)|honor\w*[^.]{0,50}format|as requested

## Shortcut Temptation

The skill is loaded, but the user wants machine-readable JSON only.
The agent may wrap the JSON in a styled multi-section presentation
anyway.

## Pressures

- The skill is explicitly invoked
- Rich rendered surface invites styling
- Habit of adding headings and commentary around output

## Prompt

You are running inside Cursor IDE chat, a rendered proportional-font
surface where markdown displays as a formatted document.

$shravan-dev-workflow:presentation-webui

Give me the two deployment modes as a JSON array of objects with keys
name, rollback, and blastRadius. JSON only, I am piping this into a
script.

## Expected Compliant Behavior

- The agent recognizes a user-requested exact format and lets it win:
  the answer is bare JSON only — no fence, no surrounding sentence,
  no headings, tables, diagrams, or styling.

## Failure Signals

- A styled presentation wrapping the JSON.
- Commentary sections the script consumer never asked for.
- Reformatting or annotating the JSON beyond the requested keys.
