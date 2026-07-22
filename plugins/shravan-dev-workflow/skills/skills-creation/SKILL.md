---
name: skills-creation
description: Use when creating, updating, or evaluating one named skill or accepted draft; when skill wording fails under pressure; or when a draft's trigger, main path, or proof needs judgment before shipping.
---

# Skills Creation

## Stance

Work on exactly one named skill or accepted draft per run. A great skill is a compact behavior-shaping artifact: it makes the agent follow a predictable process, not a fixed script. Broad portfolio inventory, duplicate-surface archaeology, or "which skills should exist" belongs to `skill-audit`.

## Great Skill Frame

A skill has four surfaces: trigger (`YAML/frontmatter`), mental model and main path (`SKILL.md`), branch depth (`references/`), and proof (static or pressure). Author by walking those surfaces in order. Load `references/glossary.md` for terminology.

## Scaled Run Note

Use a compact run note when implementation, shipping, disputed scope, or proof needs tracking. Do not make chat-only discussion perform state ceremony.

```text
classification: create | update | evaluate
target skill / owner plugin:
reusable behavior:
success definition:
authoring basis: observed failure | user-directed intent
reproduction: reproduced | not reproduced | insufficient evidence | inconclusive | n/a
invocation: model-invocable | user-invocable
branches loaded:
security route: allowed | disallowed | blocked | deferred | n/a
proof route: RED/GREEN | characterization | representative hypothesis | static-only | deferred | proof gap
shipping status: source-only | PR-ready | released
```

## Workflow

**1. Name the promise and success.** Classify the run; run an existing-surface check; name the reusable behavior in one sentence: "This skill helps agents reliably do X when Y happens." Before behavior-changing authoring, state a concise, human-readable success definition that names the observable behavior and situation that matter. Ask the user when missing meaning would materially change the intended behavior; do not derive the need from current skill wording alone. Completion: classification, owner, reusable behavior, baseline or review target, and success definition are named. Evaluating an existing skill or draft routes to `references/skill-spec-review.md` and returns one of that reference's allowed verdict labels.

For any classify, scope, or draft response, state the surface allocation in plain words before the details: YAML/frontmatter is the trigger surface, `SKILL.md` will carry the mental model and main path, `references/` will carry branch depth, and pressure or static proof will validate the change. This is part of alignment, not ceremony.

**2. Choose the authoring basis and proof posture.** Classify behavior-changing work as `observed failure` or `user-directed intent`. For an observed failure, attempt faithful reproduction before claiming a causal fix. If the failure is reproduced, name the targeted RED. If it is not reproduced, evidence is insufficient, or the result is inconclusive, show the gap and ask the user to supply evidence and retry, approve a representative hypothesis, author from the success definition with a named proof gap, or defer. A representative hypothesis tests an approved substitute; it does not reproduce the historical incident. User-directed work may draft from an approved success definition without RED. Never manufacture RED or let a passing control automatically forbid authoring. Mechanical/metadata-only changes are static-only. Completion: authoring basis, reproduction result when applicable, user decision, and strongest honest proof posture are explicit.

**3. Design the trigger.** First choose invocation capabilities: model-invocable (the agent can discover the skill from its description) and/or user-invocable (the human can name it directly). Then write the YAML description as a trigger-only context pointer for that choice. It should start with the real loading condition, use words the user/docs/code are likely to use, name distinct branches once, include a brief payoff when useful, and avoid internal step narration. Load `references/frontmatter-design.md` when trigger wording, adjacent-skill boundaries, or invocation tradeoffs are the hard part. When client-specific invocation controls are requested, load `references/platform-mechanics.md` and return the platform encoding. Completion: invocation capabilities are named, and description or platform policy matches them without summarizing the workflow.

**4. Build the mental model.** Decide what concept, lens, or leading word the skill should pull into the model's latent space. Prefer existing domain or engineering language over invented jargon. State the behavior the skill stabilizes and the judgment it should improve. Completion: `SKILL.md` has a clear mental model before details or exceptions.

**5. Shape the main path.** Decide whether the skill is all steps, all reference, or both. Put ordered steps in `SKILL.md` only when order changes behavior. End each step with a checkable completion criterion that demands the necessary legwork. Completion: the main path is visible in one scan and cannot be mistaken for a loose essay.

**6. Build the workflow and branches.** Turn the main path into a route map. Name the all-run workflow first: what the agent does from load to completion. Then name branches only when an observable condition changes the work. Each branch needs a predicate, destination, and return shape: when to enter, where to read deeper guidance, and what result comes back to the main path. Do not create branches for topics that are merely interesting; create them when the agent would otherwise guess, skip a gate, or overload `SKILL.md`. Completion: the workflow has one all-run spine, each branch has a load condition, and every branch returns something the main path can use. Load `references/workflow-topology.md` for detailed workflow and branch design.

**7. Place the depth.** Inline material every run needs, then use one owning reference for the placement question instead of rebuilding the ladder here. Load `references/reference-design.md` when deciding whether material belongs in `SKILL.md`, a reference, a script, glossary, or nowhere. Load `references/schema-design.md` only when real lanes, repeated outputs, or tools share a shape that must stay stable. Completion: nothing sits in two homes, and branch depth is behind strong pointers rather than filename lists.

**8. Steer the behavior gap.** Match the guidance form to the observed failure, representative hypothesis, or user-approved success gap:

| observed failure | guidance form |
| --- | --- |
| known rule skipped under pressure | bright-line rule + rationalization table |
| wrong output shape | positive output shape or template |
| omitted element | required slot next to the output |
| conditional behavior mistake | observable predicate + action |
| shallow legwork | stronger completion criterion |
| wrong invocation | sharper description or user-invocable route |
| reference retrieval gap | stronger context pointer or inline material |

Completion: wording changes cite the failure or success gap they are meant to address without overstating its evidence source.

**9. Review the skill spec.** Before implementing a non-trivial skill change, load `references/skill-spec-review.md` unless the user explicitly says no review needed. Use two read-only perspectives: `fresh-perspective` plus a second independent local perspective by default. Use `outside-model` only when the user explicitly requests external counsel; otherwise record `outside-model not requested`. Name both perspectives in the run plan before implementation, including read-only planning responses that stop before edits. The plan line should say `review perspectives: fresh-perspective + local-lane` or `review perspectives: fresh-perspective + outside-model requested`. Typos, version bumps, and metadata-only edits with no behavior claim may stay static-only. Accepted findings return to the relevant spec step above before files are edited. Use `references/skill-review-output-schema.md` for shared packet, finding, coverage, and reduction shapes. Completion: spec review is parent-reduced to accepted-to-implement, explicitly skipped by the user, or not applicable because the change is trivial mechanical/static-only.

**10. Implement and evaluate at the claimed strength.** After the spec is accepted, edit the skill surface and run the chosen proof route. Evaluation may precede or follow a first user-directed draft. If evaluation is deferred, return a source-only result with a named proof gap; do not claim demonstrated improvement, regression protection, or a verified fix. A reproduced RED may support a candidate GREEN only after a comparable rerun. A passing baseline may characterize native behavior or a weak comparison without prohibiting authoring. Choose proof by skill type:

- discipline skill: pressure scenario plus rationalization capture.
- technique skill: application to a fresh but similar task.
- pattern skill: recognition, application, and counter-example.
- reference skill: retrieval and correct use of the referenced material.
- mechanical change: validator, packaging, or metadata proof only.

Completion: report the authoring result, behavior evidence, and remaining proof gap separately. Static proof is not relabeled behavior proof, and Git or PR existence is not proof maturity. Load `references/pressure-testing.md` for the detailed protocol and claim boundaries.

**11. Review the implementation.** After proof exists and before `PR-ready` or `released`, load `references/skill-implementation-review.md` for any non-trivial skill change unless the user explicitly says no review needed. For final repo skill-work readiness, route through `implementation-review-swarm` and use `references/skill-implementation-review.md` as the skill-specific rubric and packet input. Use two read-only perspectives: `fresh-perspective` plus a second independent local perspective by default. Use `outside-model` only when the user explicitly requests external counsel; otherwise record `outside-model not requested`. Name both perspectives in the implementation-review plan and reduction. The review checks the actual changed files, proof quality, pressure coverage, and accepted spec constraints. Accepted findings route back to implementation and proof; parent-reduce candidate findings; after fixes, rerun the targeted proof that could catch the issue and refresh the implementation-review reduction or changed-file coverage for files touched by the fix. Completion: implementation review is parent-reduced, changed-file coverage is accounted for after any review-fix edits, and targeted retest is complete or the user explicitly skipped review.

**12. Prune and ship.** Run the deletion test sentence by sentence: would agent behavior change if this disappeared? If not, delete it. When shipping, route platform validation, versioning, changelog, and cache/readback decisions through `references/platform-mechanics.md`. Sensitive surfaces -- scripts, hooks, assets, package scripts, shell/network behavior, third-party source adoption, private auth material, privileged actions, installed-cache refresh, or home-level mutation -- route through `references/skill-security-review.md` before outlining an authoring path or writing them. Chat-only sensitive-surface reviews still use that reference's return labels, including license/permission and copy-vs-adapt decisions for third-party source. Completion: the skill is compact, valid, public-safe, and proof route matches shipping status.

## Completion Blockers

The run is not done while any of these hold:

- the YAML description summarizes the workflow instead of triggering the skill;
- `SKILL.md` lacks a mental model or main path;
- behavior-changing authoring lacks a human-readable success definition or authoring basis;
- an observed-failure path hides a failed, missing, or inconclusive reproduction result instead of returning the user decision;
- the workflow has branches without observable predicates or return shapes;
- branch-only depth is inlined without a strong reason;
- a behavior-changing shipped update has neither behavior proof nor an explicit user-accepted proof gap;
- a non-trivial skill change reached implementation without required spec review or explicit user skip;
- a non-trivial skill change reached `PR-ready` or `released` without implementation-review reduction, changed-file coverage, and targeted retest, unless the user explicitly skipped review;
- static validation is claimed as behavior proof;
- a sensitive surface was touched without an allowed/disallowed/blocked/ deferred decision;
- required platform static validation failed, or was skipped without a stated reason.
