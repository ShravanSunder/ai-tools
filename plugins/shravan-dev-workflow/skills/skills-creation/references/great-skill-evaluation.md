# Great Skill Evaluation

Judge whether a skill or draft is great enough to trust. Use deterministic
verdicts, but ground them in the great-skill model instead of vibes or point
totals.

Load this when an existing skill or draft needs a verdict, when the user asks
whether a skill is "great," or when a review needs the first required revision
instead of a rewrite dump.

## Verdicts

Allowed verdicts: `great`, `targeted-revision`, `significant-rewrite`,
`reject-or-restart`.

Blocker overrides: a skill cannot receive `great` when the trigger is wrong, the
body lacks a mental model or usable main path, branch-critical depth is hidden
behind weak pointers, behavior-changing guidance lacks proof, sensitive
resources are unsafe, or the skill is mostly no-op prose. Apply blocker
overrides before weighing anything else.

## Evidence Axes

Cover each item with real evidence, not a number:

- promise: the reusable behavior is specific and worth making durable.
- trigger: name and YAML description say when to load, why briefly, and do not
  summarize the workflow.
- invocation: model-invoked, user-invoked, or routed choice pays the right load.
- mental model: `SKILL.md` names the lens, leading words, or concepts that pull
  the model into the intended frame.
- main path: steps or reference shape are visible, operational, and checkable.
- workflow topology: the all-run spine is explicit; branches have observable
  predicates, destinations, and return shapes.
- hierarchy: all-run material is inline; branch depth is behind strong context
  pointers; related concepts are co-located.
- steering: wording form matches the failure: positive output shape, required slot,
  observable predicate, rationalization counter, or stronger completion
  criterion.
- pruning: no obvious duplication, sediment, sprawl, or no-op text remains.
- proof: structural proof and behavior proof are separated, and behavior proof
  matches the skill type when behavior changes.
- safety/platform: sensitive surfaces, plugin mechanics, changelog, and cache
  refresh are routed correctly when in scope.

## Reporting

Report, in order:

```text
review target:
verdict:
blocker overrides:
evidence by axis:
highest risk:
first required revision:
retest requirement:
```

The review target names the skill or draft being judged and the intended
behavior it claims to stabilize. The first required revision is the smallest
useful change. When the revision changes wording, output shape, omitted slots,
conditional behavior, invocation, reference retrieval, or completion criteria,
name the matching failure form from `SKILL.md`.
