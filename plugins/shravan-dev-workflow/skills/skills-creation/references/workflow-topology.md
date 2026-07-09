# Workflow Topology

Build the route before placing depth. A great skill has an all-run spine and
only the branches needed to keep agents from guessing.

Load this when a skill's workflow, branch structure, reference split, or return
path is unclear.

## Topology Model

```text
trigger
  -> mental model
  -> all-run spine
       -> branch predicate?
            -> branch destination
            -> branch work
            -> return shape
  -> completion/proof
```

The topology is not the file tree. It is the behavioral route the agent follows
after the skill loads.

## Structure Ladder

Choose the smallest structure that makes the route predictable:

```text
simple skill        -> SKILL.md
conditional depth   -> SKILL.md + references/<branch>.md
independent worker  -> references/lanes/<lane-name>.md
lane shape          -> references/<name>-lane-schema.md
reused output shape -> references/<name>-output-schema.md
tool-validated shape -> schemas/<name>.schema.json or references/<name>-tool-schema.md
```

Most skills stop at the first two rows. Lanes and schemas fit skills that have
independent lanes, shared outputs, or tool-validated shapes.

Use these homes deliberately when the complexity is real:

- branch: a conditional route inside one skill;
- lane: a branch designed as an independent workflow step;
- schema: the reusable shape a lane, output, or tool must follow;
- glossary: definitions only.

Design the branch before placing files. Promote a branch into a lane when it is
an independently runnable workflow step. When a consumer needs a stable reusable
shape, choose the matching schema family: `lane-schema`, `output-schema`, or
`tool-schema`. Load `references/schema-design.md` before promoting branch slots
into a schema.

## All-Run Spine

The spine is material every run needs. It belongs in `SKILL.md`.

Good spine steps:

- change behavior when ordered;
- name the decision the agent must make;
- end with a checkable completion condition;
- give enough context that references are meaningful;
- avoid provider-specific or case-specific detail.

If a step only says "consider X," either make the required decision explicit or
delete it.

## Branch Design

A branch is justified when an observable condition changes the work.

Use this branch record while designing:

```text
branch name:
predicate:
destination:
entry inputs:
work owned there:
return shape:
proof or stop condition:
```

Good predicates are observable:

- "when scripts, hooks, package scripts, shell/network behavior, or cache/home
  mutation are in scope"
- "when evaluating an existing skill or draft"
- "when provider-specific examples are needed"

Weak predicates are vibes:

- "when this is complicated"
- "when you need more detail"
- "when useful"

## Return Shape

Every branch must bring back something the main path can use:

- a verdict;
- a route decision;
- a filled slot set;
- a proof result;
- an allowed/blocked/deferred decision;
- a concrete edit boundary.

If a branch only returns "more context," the pointer is weak. Tighten the branch
or inline the material.

## Common Topology Bugs

- Junk-drawer references: depth exists, but no branch says when to load it.
- Branch fanout: every topic becomes a reference even though most runs need it.
- Hidden all-run rule: a required gate lives only in a reference.
- No return path: the agent reads a reference but does not know what to bring
  back.
- Parallel branches with the same predicate: two files own the same decision.
- Ordered steps without order dependency: a checklist masquerades as workflow.
- Simple branch owned simply: one reference owns the branch.
- Shared shape copied many times: several real consumers repeat fields instead
  of linking to one schema.

## Repair Moves

- If agents skip a branch, strengthen the predicate or inline the gate.
- If `SKILL.md` bloats, split branch-only depth behind a return shape.
- If references overlap, merge them or assign one source of truth.
- If output varies wildly, add required slots at the branch return.
- If multiple real consumers need the same slots, extract the matching schema
  family and have each consumer add only local judgment.
- If the agent finishes too early, strengthen completion criteria on the spine.
