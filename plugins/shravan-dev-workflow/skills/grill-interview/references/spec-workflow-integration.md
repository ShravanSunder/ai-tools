# Spec Workflow Integration

Use `grill-interview` as a manual layer, not a replacement for the workflow skills.

## Where It Fits

```text
before design
  -> clarify intent and non-goals
  -> next: spec-design-swarm

during design
  -> resolve branches, terms, ownership, security assumptions
  -> next: spec-review-council

after draft spec/plan
  -> ask crux questions only
  -> next: plan-review

before execution
  -> confirm source of truth and stopping conditions
  -> next: plan-execute

during docs maintenance
  -> choose whether code or docs should drive a correction
  -> next: docs-maintain
```

## TUI Use

Load `tui-presentation` when the question needs:

- a decision tree
- option comparison
- architecture/source-of-truth diagram
- more than one section of synthesis

Do not wrap a single live question in a large diagram. A clean question is better than a clever layout.

## Copy-Paste Use

When the user wants to pass the grill to another agent:

```text
You are grilling this design, not implementing it.

Artifact:
<path or pasted content>

Current hypothesis:
<one sentence and confidence>

Ask one material question at a time.
Each question must include your recommended answer and why.
Inspect the code/docs before asking if the answer is discoverable.
Stop when intent, non-goals, and the next workflow are explicit.
```
