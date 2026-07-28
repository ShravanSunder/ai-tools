# Reference Design

This reference owns ordinary information placement and the caller/callee contract. Return the placement decision, the exact caller shape, and the result the opened reference returns to the main path.

An ordinary reference may own coherent detailed procedure used on every run or detail used only by one observable branch. Load mode and execution shape are separate decisions: mandatory detail is not a branch, and conditional detail is not automatically a lane.

## Canonical Placement Test

```text
all-run obligation, order, decision, required return, invariant, or completion -> SKILL.md
all-run coherent detailed procedure                      -> MUST load references/<step>.md
branch-only detail                                       -> IF <predicate>, load references/<branch>.md
one qualified lane's job contract                        -> references/lanes/<lane>.md
                                                            or references/<workflow>/lanes/<lane>.md
shared fields used by multiple lanes                     -> references/<name>-lane-schema.md
                                                            or references/<workflow>/lanes/lane-schema.md
shared model-readable output                             -> references/<name>-output-schema.md
machine-validated structure                              -> schemas/<name>.schema.json
                                                            or references/<name>-tool-schema.md
deterministic executable mechanic                        -> scripts/
term meaning only                                        -> glossary.md
no behavior change                                       -> prune
```

Branch-only placement follows who consumes the material. Move all-run detail into a separate reference when it forms one coherent procedure, has enough density to obscure the main path, or changes for a different reason than the body. Keep detail with its existing owner when line count is the only reason to split it.

The calling `SKILL.md` loads `reference-lanes-design.md` when lane qualification, repeated model output, or machine-validated structure is the hard part. This reference returns the ordinary placement decision; the table above names each final home.

## Caller Owns Routing

Every ordinary reference caller in the authored `SKILL.md` begins with exactly one literal load form:

```text
MUST load `<reference>` to `<requested work>` and return `<result>`.
IF `<observable predicate>`, load `<reference>` to `<requested work>` and return `<result>`.
```

Use `MUST load` for an all-run reference pass. Use `IF` with an observable predicate for a branch that changes the work. Give every caller exactly one of those literal markers.

The caller owns:

```text
load mode: MUST | IF <observable predicate>
destination: exact reference path
requested work: decision, inspection, or procedure performed there
needed result: concrete result consumed by the continuing main path
```

For `MUST load`, the caller also keeps the all-run step's obligation, order, decision, required return, invariant, and completion visible. The reference may own the detailed procedure; it must not become the only place that explains why the step exists or when the main path may continue.

## Opened Reference Owns Local Work

Once opened, an ordinary reference owns:

```text
owned decision or detail
expected inputs from the caller
local judgment, procedure, examples, caveats, or templates
detailed returned result
checkable stop or completion condition
```

The opened reference starts from the work already selected by its caller. Keep the current file's entry route, `MUST`/`IF` mode, and caller predicate with the caller.

The entry-ownership boundary is narrow. A reference states its owned decision and expected inputs, may use local conditional procedure, and may call deeper references while its caller retains the current file's entry route.

A useful opening shape is:

```text
this reference owns:
expected inputs:
return:
complete when:
```

## Reference Fit

A good ordinary reference:

- holds one coherent kind of detail;
- changes behavior without duplicating the main path;
- keeps local rules, examples, caveats, and templates together;
- returns a result the caller can actually use;
- has a checkable stop when it asks the agent to do work;
- leaves entry routing and parent completion with the caller.

A separate file is not enough to make work a lane or a schema. Provider-specific, conditional, long, packet-shaped, delegated, or serialized work still uses the ordinary-reference route unless it satisfies the advanced predicates owned by `reference-lanes-design.md`.

## Pruning Pass

For each body or reference section, ask:

```text
what decision or detail does this own:
who consumes it:
what behavior changes:
what result returns:
what would break if deleted:
```

If those answers are weak, inline the detail with its actual owner, merge overlapping references, or delete the no-op prose. Completion: each meaning has one owner, every ordinary caller is complete, and every opened reference can finish its local work without claiming its own entry route.
