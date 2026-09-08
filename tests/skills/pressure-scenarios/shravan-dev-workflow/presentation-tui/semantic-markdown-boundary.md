# presentation-tui semantic markdown boundary pressure

scenario_id: presentation-tui-semantic-markdown-boundary
skill_under_test: shravan-dev-workflow:presentation-tui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: [┌└│]
expect_proof_regex: fenced (\w+ )?(code|block|config|snippet|yaml|json)|code fence|language tag|tagged (json|yaml|code)|(json|yaml) (block|fence)
expect_proof_regex: outside the (row|frame|box|cell|board)|outside [^.]{0,20}(row|frame|box)|out of the (row|frame|box)|(above|under|below|beside|before|after|next to|adjacent to) the (row|frame|box|framed block)|immediately (before|after)|relocat\w*
expect_proof_regex: label|pointer|copy-ready|reference
expect_forbidden_regex: (keep|kept|keeping|left|buried) (the )?(path|json|flag|command|url|identifier|atom)s? (inside|in) the (row|frame|box|cell)
expect_forbidden_regex: (raw|plain)[^.]{0,80}(inside|in) the (row|frame|box|cell)
expect_forbidden_regex: (?<!not |n't |no |without |never )truncat\w*[^.]{0,40}(ellipsis|\.\.\.|…)

## Shortcut Temptation

The user wants terminal-friendly structure including a framed status
board. The agent may bury code, paths, URLs, and one very long
identifier inside fixed-width box rows — either as raw plain text
(breaking the bright line) or as inline markdown inside the rows
(drifting the borders).

## Pressures

- Mixed prose and technical atoms
- A fixed-width framed board the user explicitly wants
- One identifier too long for any cell
- Copyable command snippets and a JSON config

## Prompt

$shravan-dev-workflow:presentation-tui

Make me a framed status board for this migration. It must mention the
file plugins/shravan-dev-workflow/skills/presentation-tui/SKILL.md,
the command pnpm --dir tests/skills run test:evals, the URL
https://example.invalid/docs, the flag
--enable-experimental-cache-invalidation-token-rotation, and this
config:

```json
{"kind":"agent-channel-provider-health","enabled":true}
```

Keep it all in one tidy box if you can.

## Expected Compliant Behavior

- Skill is invoked.
- The framed board carries short plain labels only; every technical
  atom (path, command, URL, long flag, JSON) is rendered as inline
  code, a fenced block, or a navigational link placed immediately
  before or after the frame, with a short pointer in the row.
- The long flag is neither truncated mid-token nor wrapped as raw
  plain text inside a row.
- The JSON stays a fenced block; nothing code-shaped sits in a box
  cell.

## Failure Signals

- Raw plain-text identifiers, paths, URLs, or commands inside box rows.
- Inline backticks or link markup inside fixed-width rows (border
  drift risk).
- JSON drawn into a frame or box-table cell.
- The long flag truncated with an ellipsis mid-token.
