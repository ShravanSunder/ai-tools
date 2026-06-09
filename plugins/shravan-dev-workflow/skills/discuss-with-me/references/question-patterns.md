# Question Patterns

Load this before asking a live question when the decision is broad, high-stakes, or technically loaded.

## Universal Form

```text
Stage:
<design / spec / plan / implementation / docs>

Current model:
<one sentence>

Evidence checked:
<code/docs/session artifacts>

Confidence:
<high / medium / low> - missing: <one material variable>

My recommended default:
<answer and why>

Question:
<single focused question>
```

## Decision Branch

Use when there are two or more real paths.

```text
Decision needed:
<branch>

My current read:
I would choose <option> because <evidence/tradeoff>.

If wrong:
<what changes in scope, architecture, validation, docs, or cost>

Question:
<single choice or focused correction>
```

## Model Break

Use when implementation or repo evidence contradicts the current design/spec/plan.

```text
What we thought:
<assumption>

What I found:
<evidence>

My read:
<what this changes>

Question:
Should we update <design/spec/plan/docs> to reflect this, or is this an implementation bug?
```

## Source-Of-Truth Conflict

Use when code, docs, specs, plans, README, or AGENTS disagree.

```text
Conflict:
<source A says X; source B/code says Y>

My current read:
<which source should drive and why>

Question:
Should <code/docs/spec/plan/AGENTS/README> be the source of truth here?
```

## Stop Conditions

Stop discussing when:

- the user confirms the restated intent or decision
- the next questions are predictable from the current model
- the remaining uncertainty is not material to the next workflow
- the user asks to switch to artifact creation or implementation

Stop and say the blocker when:

- multiple rounds do not raise confidence
- the answer requires product/user input the agent cannot infer
- repo evidence contradicts the user's stated model and needs explicit reconciliation
