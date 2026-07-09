# Reference Design

References hold depth that the main path can call when a branch needs it. A
good reference changes behavior without making every run carry its weight.

`SKILL.md` owns load conditions. Once a reference is open, the reference owns
the branch work, local rules, and return shape. Start with `SKILL.md` plus
ordinary references. Reach for lanes and schemas when the workflow has real
independent lanes, shared outputs, or tool-validated shapes.

## Good Reference File

A reference is branch depth the main path already chose to open. It is the home
for local judgment, detailed procedure, examples, rubrics, templates, caveats,
or schema links that would overload `SKILL.md`.

A good `references/*.md` file:

- opens by naming the branch, decision, or detail it owns;
- states the concrete result it returns to the main path;
- holds one coherent kind of depth;
- keeps rules, examples, caveats, and templates co-located for that branch;
- lets the parent `SKILL.md` pointer own routing;
- avoids restating all-run rules from `SKILL.md`;
- has checkable stop conditions when it asks the agent to do work.

## Placement Test

Use this decision table:

```text
every run needs it                  -> SKILL.md
one judgment branch needs it        -> references/<branch>.md
independent workflow lane           -> references/lanes/<lane-name>.md
lane shape shared by lanes          -> references/<name>-lane-schema.md
shared model output shape           -> references/<name>-output-schema.md
tool-validated shape                -> schemas/<name>.schema.json or references/<name>-tool-schema.md
deterministic executable mechanic   -> scripts/
term meaning only                   -> references/glossary.md
no behavior change                  -> prune
```

Branch-only is about who consumes the material, not how long it is. A short
provider-specific warning can still belong in a reference if only that provider
branch needs it.

Before promoting a slot set, template, lane context shape, output shape, or
tool shape into a schema, use `references/schema-design.md`. Keep small skills
in the ordinary reference shape. When a schema is justified, each consumer links
to the shared schema and adds only branch- or lane-specific judgment.

## Context Pointer Quality

A pointer from `SKILL.md` to a reference should include the routing condition.
The reference itself should state ownership and return shape, not repeat the
routing condition.

Pointer shape:

```text
routing condition:
reference path:
what to do there:
what to bring back:
```

Reference opening shape:

```text
this reference owns:
return:
```

Weak pointer:

```text
See references/platform-mechanics.md for details.
```

Strong pointer:

```text
When plugin metadata, versioning, changelog, marketplace validation, or cache
readback is in scope, load references/platform-mechanics.md and return the
shipping route plus validation commands.
```

## Reference Fit Signals

- Branch reference: one branch owns it and one result returns.
- Lane reference: an independent workflow step can run from bounded context.
- `lane-schema`: independent lanes share route, input, or return fields.
- `output-schema`: multiple consumers share the same result shape.
- `tool-schema`: a tool, test, CI check, or runtime validates the fields.
- Glossary entry: the content is a term definition only.
- Prune: the content does not change agent behavior.

## Pruning Pass

For each reference section, ask:

```text
what local judgment or detail does this own:
what behavior changes:
what result returns:
what would break if deleted:
```

If those answers are weak, remove the fluff, inline the material into the main
path, merge it with its real owner, or delete it.
