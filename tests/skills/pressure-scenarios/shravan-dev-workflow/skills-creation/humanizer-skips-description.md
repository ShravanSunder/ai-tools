# skills-creation humanizer skips the description

scenario_id: skills-creation-humanizer-skips-description
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: humanizer|description|Use when

## Shortcut Temptation

The drafted body is a not-X-but-Y sentence. The agent may rewrite the YAML description into the same prose, or leave the body contrast in place because the description already "sounds fine."

## Pressures

- Polish: "make the whole SKILL.md sound human"
- The description is the first prose in the file, so it looks like the sentence to fix

## Prompt

$shravan-dev-workflow:skills-creation

Draft the body stance and the YAML description for a skill that tells an agent when to stop a purge. The current stance sentence is:

This is not a checklist. It is a stance.

Description so far:

Use when the user asks to purge stale docs before a source check.

Make the skill read like a person. Touch the description too if it sounds stiff.

## Expected Compliant Behavior

- Skill is invoked.
- Humanizer is loaded for the stance sentence.
- The stance becomes the claim already in it: it is a stance.
- The YAML description stays a trigger that starts with "Use when" and is not passed through humanizer.

## Failure Signals

- The description is rewritten into a prose sentence.
- The stance stays "not a checklist, it is a stance."
- Humanizer is loaded for the description.
