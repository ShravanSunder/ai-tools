---
name: skills-creation
description: Use when creating, updating, or evaluating one named skill or accepted draft; when skill wording fails under pressure; or when a draft's trigger, main path, or proof needs judgment before shipping.
---

# Skills Creation

## Stance

Work on exactly one named skill or accepted draft per run. A great skill is a
compact behavior-shaping artifact: it makes the agent follow a predictable
process, not a fixed script. Broad portfolio inventory, duplicate-surface
archaeology, or "which skills should exist" belongs to `skill-audit`.

## Great Skill Frame

A skill has four surfaces: trigger (`YAML/frontmatter`), mental model and main
path (`SKILL.md`), branch depth (`references/`), and proof (static or
pressure). Author by walking those surfaces in order. Load
`references/glossary.md` for terminology.

## Scaled Run Note

Use a compact run note when implementation, shipping, disputed scope, or proof
needs tracking. Do not make chat-only discussion perform state ceremony.

```text
classification: create | update | evaluate
target skill / owner plugin:
reusable behavior:
baseline or review target:
invocation: model-invoked | user-invoked | routed
branches loaded:
security route: allowed | disallowed | blocked | deferred | n/a
proof route: RED | GREEN | static-only | pressure scenario | micro-test | proof gap
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

**2. Prove first (behavior-changing work).** Before describing or writing any
behavior-changing update, name a pressure scenario or micro-test that already
fails against the current skill (RED). Creates may draft from a hypothesized
baseline; they still need GREEN before `PR-ready` or `released`.
Mechanical/metadata-only changes are static-only and must be labeled that way.
"I already know the wording problem" is not a skip. Completion: RED is named,
or the change is explicitly static-only.

**3. Design the trigger.** First choose invocation: model-invoked (pays context
load and lets the agent discover the skill), user-invoked (pays cognitive load
because the human must name it), or routed when user-invoked skills are
multiplying. Then write the YAML description as a trigger-only context pointer
for that mode. It should start with the real loading condition, use words the
user/docs/code are likely to use, name distinct branches once, include a brief
payoff when useful, and avoid internal step narration. Load
`references/frontmatter-design.md` when trigger wording, adjacent-skill
boundaries, or invocation tradeoffs are the hard part. When explicit-only,
background-only, or client-specific invocation controls are requested, load
`references/platform-mechanics.md` and return the platform encoding, such as
Codex `agents/openai.yaml` policy versus Claude-oriented frontmatter fields.
Completion: invocation mode is named, and description or platform policy
matches that mode without summarizing the workflow.

**4. Build the mental model.** Decide what concept, lens, or leading word the
skill should pull into the model's latent space. Prefer existing domain or
engineering language over invented jargon. State the behavior the skill
stabilizes and the judgment it should improve. Completion: `SKILL.md` has a
clear mental model before details or exceptions.

**5. Shape the main path.** Decide whether the skill is all steps, all
reference, or both. Put ordered steps in `SKILL.md` only when order changes
behavior. End each step with a checkable completion criterion that demands the
necessary legwork. Completion: the main path is visible in one scan and cannot
be mistaken for a loose essay.

**6. Build the workflow and branches.** Turn the main path into a route map.
Name the all-run workflow first: what the agent does from load to completion.
Then name branches only when an observable condition changes the work. Each
branch needs a predicate, destination, and return shape: when to enter, where
to read deeper guidance, and what result comes back to the main path. Do
not create branches for topics that are merely interesting; create them when
the agent would otherwise guess, skip a gate, or overload `SKILL.md`.
Completion: the workflow has one all-run spine, each branch has a load
condition, and every branch returns something the main path can use. Load
`references/workflow-topology.md` for detailed workflow and branch design.

**7. Place the depth.** Inline material every run needs, then use one owning
reference for the placement question instead of rebuilding the ladder here.
Load `references/reference-design.md` when deciding whether material belongs in
`SKILL.md`, a reference, a script, glossary, or nowhere. Load
`references/schema-design.md` only when real lanes, repeated outputs, or tools
share a shape that must stay stable. Completion: nothing sits in two homes, and
branch depth is behind strong pointers rather than filename lists.

**8. Steer the failure.** Match the guidance form to the observed or
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

**9. Prove GREEN and size the proof.** After wording exists, rerun the chosen
proof route. Behavior-changing work needs GREEN before `PR-ready` or
`released`; mechanical changes use static validation only. Choose proof by
skill type:

- discipline skill: pressure scenario plus rationalization capture.
- technique skill: application to a fresh but similar task.
- pattern skill: recognition, application, and counter-example.
- reference skill: retrieval and correct use of the referenced material.
- mechanical change: validator, packaging, or metadata proof only.

Completion: proof route is explicit and static proof is not relabeled behavior
proof. Load `references/pressure-testing.md` for the detailed protocol.

**10. Prune and ship.** Run the deletion test sentence by sentence: would agent
behavior change if this disappeared? If not, delete it. When shipping, route
platform validation, versioning, changelog, and cache/readback decisions through
`references/platform-mechanics.md`. Sensitive surfaces -- scripts, hooks,
assets, package scripts, shell/network behavior, third-party source adoption,
installed-cache refresh, or home-level mutation -- route through
`references/skill-security-review.md` before outlining an authoring path or
writing them. Chat-only sensitive-surface reviews still use that reference's
return labels, including license/permission and copy-vs-adapt decisions for
third-party source. Completion: the skill is compact, valid, public-safe, and
proof route matches shipping status.

## Completion Blockers

The run is not done while any of these hold:

- the YAML description summarizes the workflow instead of triggering the skill;
- `SKILL.md` lacks a mental model or main path;
- a behavior-changing update described or edited wording before naming RED;
- the workflow has branches without observable predicates or return shapes;
- branch-only depth is inlined without a strong reason;
- a behavior-changing shipped update has no behavior proof or accepted proof
  gap;
- static validation is claimed as behavior proof;
- a sensitive surface was touched without an allowed/disallowed/blocked/
  deferred decision;
- required platform static validation failed, or was skipped without a stated
  reason.
