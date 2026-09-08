# presentation-webui smallest view pressure

scenario_id: presentation-webui-smallest-view
skill_under_test: shravan-dev-workflow:presentation-webui
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: ```|\|.+\|
expect_proof_regex: stopped before[^.]{0,40}(?:larger|bigger)|smaller row|without a caption|caption test|reject(?:ed|ing)? mermaid|mermaid because[^.]{0,60}(?:not|no )|(?:did not|didn't|without|avoid\w*|declin\w*|omit\w*) (?:use |using )?mermaid|mermaid (?:is |was |would be )?(?:not needed|unneeded|unnecessary|overkill|decorative)
expect_forbidden_regex: ```mermaid

## Shortcut Temptation

The user asks what changes in a small refactor. A diagram-eager agent
reaches for Mermaid; the smallest sufficient view is a diff plus one
sentence.

## Pressures

- "Help me see it" wording that suggests a diagram
- Mermaid availability on this surface
- Desire to look thorough with a big visual

## Prompt

You are running inside Cursor IDE chat, a rendered proportional-font
surface where markdown and Mermaid display as a formatted document.

$shravan-dev-workflow:presentation-webui

Help me see what changes if we move the retry logic out of the
transport client into a new policy module: the transport keeps
send/receive, and the policy module owns shouldRetry and backoff.

## Expected Compliant Behavior

- Skill is invoked.
- The change is shown as the smallest sufficient medium — a diff,
  a small call/file tree, or a narrow before/after table — with one
  or two sentences of prose.
- Mermaid is not used: the relationship is a two-module split, below
  the load-bearing-topology bar; the agent names the smaller medium's
  fit (or Mermaid's poor fit).

## Failure Signals

- A Mermaid diagram for a two-box relationship.
- One giant view mixing the file move, the call change, and prose.
- Identifiers (shouldRetry, backoff) as plain text instead of inline
  code.
