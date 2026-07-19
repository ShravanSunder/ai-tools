# Reference Design

This reference owns ordinary information placement and the caller/callee contract. Return the placement decision, the exact caller shape, and the result the opened reference returns to the main path.

An ordinary reference may own coherent detailed procedure used on every run or detail used only by one observable branch. Load mode and execution shape are separate decisions: mandatory detail is not a branch, and conditional detail is not automatically a lane.

## Canonical Placement Test

```text
all-run obligation, order, decision, required return, invariant, or completion -> SKILL.md
all-run coherent detailed procedure                      -> MUST load references/<step>.md
branch-only detail                                       -> IF <predicate>, load references/<branch>.md
parallel-safe, handoff-ready work                        -> reference-lanes-design.md
all-run lane handed to a subagent                        -> MUST dispatch via reference-lanes-design.md
conditional lane handed to a subagent                    -> IF <predicate>, dispatch via reference-lanes-design.md
multiple consumers need stable model-readable output     -> reference-lanes-design.md
tool, test, CI, or runtime validates structure            -> reference-lanes-design.md
deterministic executable mechanic                        -> scripts/
term meaning only                                        -> references/glossary.md
no behavior change                                       -> prune
```

Branch-only is about who consumes the material, not its length. All-run detail may move out when it is one coherent procedure, has enough density to obscure the main path, or changes for a different reason than the body. Do not create arbitrary chapter files merely to reduce line count.

When lane qualification, repeated model output, or machine-validated structure is the hard part, return to the calling `SKILL.md`; its observable predicate routes to `references/reference-lanes-design.md`.

## Caller Owns Routing

Every ordinary reference caller in the authored `SKILL.md` begins with exactly one literal load form:

```text
MUST load `<reference>` and return `<result>`.
IF `<observable predicate>`, load `<reference>` and return `<result>`.
```

`MUST load` is an all-run reference pass, not a branch. `IF` is a branch and needs an observable predicate that changes the work. Do not combine the markers or replace them with "when useful," "as needed," "should load," or a vague "see this file" pointer.

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

The opened reference starts from the work already selected by its caller. It does not tell the parent when to load, call, or enter the current file, and it does not repeat or independently own its `MUST`/`IF` mode or caller predicate.

The self-entry prohibition is narrow. A reference may state its owned decision and expected inputs, use local conditional procedure, and call deeper references. Those are local work, not ownership of the current file's entry route.

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
