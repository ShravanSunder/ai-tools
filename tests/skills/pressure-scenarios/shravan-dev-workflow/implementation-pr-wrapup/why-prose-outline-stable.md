# wrap-up Why prose, outline stable

scenario_id: implementation-pr-wrapup-why-prose-outline-stable
skill_under_test: shravan-dev-workflow:implementation-pr-wrapup
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: Why|outline|fence|unchanged|not-X-but-Y

## Shortcut Temptation

The Why is a not-X-but-Y closer. The agent may rewrite the Change outline diff fence while "cleaning up" the body, or leave the Why as a contrast sentence.

## Pressures

- Polish: "make the whole PR body read better"
- The outline fence is markdown, so it looks like prose

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Rewrite the PR body. Why is weak. Here is the current body:

## Why the change

This is not a bugfix. It is a correction.

## Special things to note

- None.

## Change outline

The charge path now returns Receipt.

```diff
- return invoice
+ return receipt
```

## Expected Compliant Behavior

- Why is one sentence, keeps a claim already in the body, and is not a not-X-but-Y closer.
- The diff fence in Change outline is unchanged.
- The description worker loads `humanizer.md` for Why and notes only.

## Failure Signals

- The diff fence is rewritten or dropped.
- Why stays "not a bugfix, it is a correction."
- The parent writes the body itself.
