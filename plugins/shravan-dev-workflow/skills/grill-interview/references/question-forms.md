# Question Forms

Load this when preparing a manual grill/interview question.

## Intent Interview

Use before design when the user has an idea but the real outcome is unclear.

```text
Hypothesis:
You want <outcome>, and <artifact/request> is the shape that came to mind.

Confidence:
<percent> - missing: <who / why now / success / constraint / non-goal>

Question:
<one focused question>

Guess:
<agent's best guess and why>
```

## Decision Branch

Use when a design has two or more real paths.

```text
Decision needed:
<branch>

My current read:
I would choose <option> because <evidence/tradeoff>.

If wrong:
<what changes in scope, architecture, validation, or security>

Question:
<single choice or focused correction>
```

## Plan Stress Test

Use when the user asks whether a plan is ready.

```text
Crux:
<assumption that could invalidate the plan>

Evidence so far:
<code/docs/source checked>

My current read:
<ready / not ready / needs one decision>

Question:
<the one unresolved thing>
```

## Docs Conflict

Use when code, docs, README, AGENTS, or plans disagree.

```text
Conflict:
<source A says X; source B/code says Y>

My current read:
<which source should drive and why>

Question:
Should <code/docs/plan/AGENTS/README> be the source of truth here?
```

## Stop Conditions

Stop interviewing when:

- the user confirms the restated intent or decision
- the next three questions are predictable from the current model
- the remaining uncertainty is not material to the next workflow
- the user asks to switch to implementation or artifact creation

Stop and say the blocker when:

- multiple rounds do not raise confidence
- the answer requires product/user input the agent cannot infer
- repo evidence contradicts the user's stated model and needs explicit reconciliation
