# Skill Spec Review

Review the intended skill design before implementation. This reference judges
whether the proposed promise, trigger, workflow, reference split, and proof plan
would make a trustworthy skill if implemented.

Return a spec-review verdict, blocker overrides, rubric evidence, accepted and
rejected findings, first required revision, and proof or retest implication.

Use `manage-agents` for reviewer-lane mechanics. Parent authority stays in the
main run: reviewer lanes return candidate findings, not the final verdict. Use
`skill-review-output-schema.md` for shared packet, finding, coverage, and
reduction shapes.

## Review Lanes

Use at least two read-only perspectives for non-trivial skill specs:

- `fresh-perspective`: checks whether the intended skill promise, trigger,
  workflow, reference split, and proof route cohere without relying on the
  author's explanation.
- `outside-model`: uses Claude, Cursor-backed model, Grok, or another
  configured non-parent provider when available. If unavailable, record the
  outside-model gap and run a second independent lane with a different focus.

## Verdicts

Allowed verdicts: `great`, `targeted-revision`, `significant-rewrite`,
`reject-or-restart`. Use the exact label; do not replace it with a free-form
phrase such as "not great yet."

For pre-implementation spec review, `great` means accepted to implement.
`targeted-revision` means the intended design needs a bounded spec fix before
editing. `significant-rewrite` means the proposed design's promise, trigger,
workflow, or proof route must be redesigned before implementation.

Blocker overrides: a spec cannot be accepted when the target behavior is not
one named skill, the trigger is not a loading condition, the body lacks a
mental model or usable main path, branch-critical depth has no owning
reference, behavior-changing guidance has no proof route, sensitive surfaces
are unclassified, or the proposed text is mostly no-op prose.

## Rubric

Cover each item with source-backed evidence:

- promise: the reusable behavior is specific and worth making durable.
- trigger: name and YAML/frontmatter description say when to load, why briefly,
  and do not summarize the workflow.
- invocation: model-invoked, user-invoked, or routed choice pays the right load.
- mental model: `SKILL.md` will name the lens, leading words, or concepts that
  pull the model into the intended frame.
- main path: ordered steps or reference shape are visible, operational, and
  checkable.
- workflow topology: the all-run spine is explicit; branches have observable
  predicates, destinations, and return expectations.
- hierarchy: all-run material stays inline; branch depth has strong context
  pointers; related concepts are co-located.
- steering: guidance form matches the failure: positive output shape, required
  slot, observable predicate, rationalization counter, or stronger completion
  criterion.
- proof plan: structural proof and behavior proof are separated, and behavior
  proof matches the skill type when behavior changes.
- safety/platform: sensitive surfaces, plugin mechanics, changelog, and cache
  refresh are routed correctly when in scope.

## Reduction

The parent reduces candidate findings into the spec-review result. Accepted
findings return to the design step they affect before implementation starts.
Implementation may start only after the parent marks the spec
accepted-to-implement. If the verdict is `targeted-revision`,
`significant-rewrite`, or `reject-or-restart`, revise the spec and run a fresh
parent reduction before editing files, unless the user explicitly skips review.

Report with these exact labels:

```text
review target:
verdict:
blocker overrides:
rubric evidence:
highest risk:
accepted findings:
rejected findings:
first required revision:
proof or retest implication:
implementation decision: accepted-to-implement | revise-first | restart | skipped-by-user
```

The first required revision is the smallest useful spec change. When the
revision changes wording, output shape, omitted slots, conditional behavior,
invocation, reference retrieval, or completion criteria, name the matching
failure form from `SKILL.md`.
