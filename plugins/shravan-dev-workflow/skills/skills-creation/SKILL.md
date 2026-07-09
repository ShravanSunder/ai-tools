---
name: skills-creation
description: Use when creating, updating, or evaluating one named skill; turning repeated agent behavior into durable guidance; or deciding trigger wording, skill structure, references, steering language, or proof so future agents behave predictably. Not for repo-wide skill portfolio audits - use skill-audit.
---

# Skills Creation

## Stance

Work on exactly one named skill or accepted draft per run. A great skill is a
compact behavior-shaping artifact: it makes the agent follow a predictable
process, not a fixed script. The craft is choosing what belongs in the YAML
trigger, what belongs in `SKILL.md`, what belongs in references, what language
pulls the model into the right latent space, and what proof shows the wording
actually changed behavior. Broad portfolio inventory, duplicate-surface
archaeology, or "which skills should exist" belongs to `skill-audit`.

## Great Skill Model

Every skill has four surfaces:

- YAML/frontmatter is the trigger surface. It answers "should I load this
  now?" with concrete situations, symptoms, user words, adjacent-skill
  boundaries, and a short payoff.
- `SKILL.md` is the mental model and main path. It tells the agent how to think
  and act when the skill is loaded.
- `references/` carries branch depth: details, rubrics, examples, platform
  mechanics, security gates, and longer proof protocols that only some runs
  need.
- Tests and pressure proof validate behavior. They are not the identity of the
  skill, but behavior-changing skill text is not ready to ship without them.

Use these quality axes while authoring:

- trigger: the name and description are searchable, trigger-only, and concise.
- mental model: the body introduces the concept or lens the agent should think
  with.
- path: ordered steps appear only where order matters, and each step has a
  checkable completion criterion.
- workflow: the all-run route is explicit, and branches have observable load
  conditions and return shapes.
- hierarchy: all-run material stays in `SKILL.md`; branch-only depth sits
  behind a strong context pointer.
- steering: leading words, positive shapes, required slots, and observable
  predicates shape behavior more reliably than vague advice.
- pruning: delete duplication, sediment, sprawl, no-op text, and branch detail
  that bloats the main path.
- proof: static validation proves structure; pressure proof proves changed
  behavior.

Load `references/glossary.md` when these terms need fuller meaning.

## Scaled Run Note

Use a compact run note when implementation, shipping, disputed scope, or proof
needs tracking. Do not make chat-only discussion perform state ceremony.

```text
classification: create | update | evaluate
target skill / owner plugin:
reusable behavior:
baseline or review target:
branches loaded:
security route: allowed | disallowed | blocked | deferred | n/a
proof route: static-only | pressure scenario | micro-test | proof gap
shipping status: source-only | PR-ready | released
```

## Workflow

**1. Name the promise.** Classify the run; run an existing-surface check; name
the reusable behavior in one sentence: "This skill helps agents reliably do X
when Y happens." Completion: classification, owner, reusable behavior, and
baseline or review target are named. Evaluating an existing skill or draft
routes to `references/great-skill-evaluation.md`.

For any classify, scope, or draft response, state the surface allocation in
plain words before the details: YAML/frontmatter is the trigger surface,
`SKILL.md` will carry the mental model and main path, `references/` will carry
branch depth, and pressure or static proof will validate the change. This is
part of alignment, not ceremony.

**2. Design the trigger.** Write the YAML description as a context pointer, not
a workflow summary. It should start with the real loading condition, use words
the user/docs/code are likely to use, name distinct branches once, include a
brief payoff when useful, and avoid internal step narration. Load
`references/frontmatter-design.md` when trigger wording, adjacent-skill
boundaries, or invocation tradeoffs are the hard part. Completion: description
text answers "should I load this now?" without letting the agent skip the body.

**3. Build the mental model.** Decide what concept, lens, or leading word the
skill should pull into the model's latent space. Prefer existing domain or
engineering language over invented jargon. State the behavior the skill
stabilizes and the judgment it should improve. Completion: `SKILL.md` has a
clear mental model before details or exceptions.

**4. Shape the main path.** Decide whether the skill is all steps, all
reference, or both. Put ordered steps in `SKILL.md` only when order changes
behavior. End each step with a checkable completion criterion that demands the
necessary legwork. Completion: the main path is visible in one scan and cannot
be mistaken for a loose essay.

**5. Build the workflow and branches.** Turn the main path into a route map.
Name the all-run workflow first: what the agent does from load to completion.
Then name branches only when an observable condition changes the work. Each
branch needs a predicate, destination, and return shape: when to enter, where
to read deeper guidance, and what result comes back to the main path. Do
not create branches for topics that are merely interesting; create them when
the agent would otherwise guess, skip a gate, or overload `SKILL.md`.
Completion: the workflow has one all-run spine, each branch has a load
condition, and every branch returns something the main path can use. Load
`references/workflow-topology.md` for detailed workflow and branch design.

**6. Place the depth.** Inline material every run needs. Move branch-specific
walkthroughs, per-provider examples, detailed rubrics, platform mechanics,
security review, and long proof protocols into `references/`. Context pointers
must name the observable condition for loading the reference and what it
returns. Use ordinary references for ordinary branch depth. For complex skills
with independent lanes, multi-consumer outputs, or tool-validated shapes, put
shared shapes in one `lane-schema`, `output-schema`, or `tool-schema` home and
have each consumer point to it instead of copying fields. Completion: nothing
sits in two homes, and branch depth is behind strong pointers rather than
filename lists. Load
`references/reference-design.md` when deciding what makes a reference file good
or whether branch material belongs inline. Load `references/schema-design.md`
when real lanes, skills, outputs, or tools share the same slots or shape.

**7. Steer the failure.** Match the guidance form to the observed or
hypothesized failure:

| observed failure | guidance form |
| --- | --- |
| known rule skipped under pressure | bright-line rule + rationalization table |
| wrong output shape | positive output shape or template |
| omitted element | required slot next to the output |
| conditional behavior mistake | observable predicate + action |
| shallow legwork | stronger completion criterion |
| wrong invocation | sharper description or user-invoked route |
| reference retrieval gap | stronger context pointer or inline material |

Completion: wording changes cite the failure form they are meant to fix.

**8. Prove under pressure.** Keep proof visible, but sized to the change.
Behavior-changing updates caused by an observed failure need RED before the
edit. New skill drafts may start from a failure hypothesis, but they need GREEN
before `PR-ready` or `released`. Mechanical changes use static validation only.
Choose proof by skill type:

- discipline skill: pressure scenario plus rationalization capture.
- technique skill: application to a fresh but similar task.
- pattern skill: recognition, application, and counter-example.
- reference skill: retrieval and correct use of the referenced material.
- mechanical change: validator, packaging, or metadata proof only.

Completion: proof route is explicit and static proof is not relabeled behavior
proof. Load `references/pressure-testing.md` for the detailed protocol.

**9. Prune and ship.** Run the deletion test sentence by sentence: would agent
behavior change if this disappeared? If not, delete it. When shipping, route
platform validation, versioning, changelog, and cache/readback decisions through
`references/platform-mechanics.md`. Sensitive surfaces -- scripts, hooks,
assets, package scripts, shell/network behavior, third-party source adoption,
installed-cache refresh, or home-level mutation -- route through
`references/skill-security-review.md` before outlining an authoring path or
writing them. Chat-only sensitive-surface reviews still use that reference's
return labels, including license/permission and copy-vs-adapt decisions for
third-party source. Completion: the skill is compact, valid, public-safe, and
proof status matches shipping status.

## Completion Blockers

The run is not done while any of these hold:

- the YAML description summarizes the workflow instead of triggering the skill;
- `SKILL.md` lacks a mental model or main path;
- the workflow has branches without observable predicates or return shapes;
- branch-only depth is inlined without a strong reason;
- a behavior-changing shipped update has no behavior proof or accepted proof
  gap;
- static validation is claimed as behavior proof;
- a sensitive surface was touched without an allowed/disallowed/blocked/
  deferred decision;
- required platform static validation failed, or was skipped without a stated
  reason.
