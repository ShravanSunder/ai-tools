# Question Patterns

Load this before asking a live question when the decision is broad, high-stakes, or technically loaded.

## Universal Form

```text
Stage:
<design / spec / plan / implementation / docs>

Intent handle:
<reflect-back / grill-me / steelman / stress-test / assumption-check / boundary-check / source-of-truth / reconverge>

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

## Steelman

Use when there are two or more credible choices and convergence would be too easy.

```text
Decision needed:
<branch>

My recommended default:
<option A, with evidence>

Strongest alternative:
<option B, stated as fairly as possible>

Tradeoff under pressure:
<what we gain, what we pay, and who bears the cost>

Question:
Which cost are we willing to carry?
```

## Stress Test

Use when the idea may depend on an unstated assumption, fragile boundary, or hidden failure mode.

```text
Assumption:
<load-bearing assumption>

Why I think we are making it:
<evidence or inference>

If false:
<what breaks in scope, design, validation, docs, or cost>

My recommended default:
<keep / revise / make explicit>

Question:
Should we keep this assumption, revise it, or make it an explicit constraint?
```

## Boundary Probe

Use when ownership, source of truth, terminology, or "not doing" is fuzzy.

```text
Boundary:
<term / source / ownership / scope edge>

Possible meanings:
<A vs B, grounded in code/docs when available>

My current read:
<which meaning should drive and why>

Question:
When you say <term>, should we treat it as <A> or <B>?
```

## Decision Branch

Use when there are two or more real paths.

```text
Decision needed:
<branch>

My current read:
I would choose <option> because <evidence/tradeoff>.

Best opposing case:
<strongest reason to choose the other path>

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

- the user confirms the restated intent or decision and the material boundary is explicit
- the next questions are predictable from the current model
- the remaining uncertainty is not material to the next workflow
- the user asks to switch to artifact creation or implementation

Stop and say the blocker when:

- multiple rounds do not raise confidence
- the discussion has become a scripted interview instead of clarifying a live decision
- the answer requires product/user input the agent cannot infer
- repo evidence contradicts the user's stated model and needs explicit reconciliation
