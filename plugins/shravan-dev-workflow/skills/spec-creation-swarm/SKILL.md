---
name: spec-creation-swarm
description: Use when creating or revising a spec, design, or architecture contract before an implementation plan exists, especially when the work needs bounded subagents, current-state exploration, separability mapping, or tradeoff clarification.
---

# Spec Creation Swarm

Use this skill to create the spec/design contract before writing an
implementation plan. The parent session owns the mental model, synthesis, and
recommendation. Subagents provide bounded research, exploration, and
architecture comparison, not final decisions.

A spec may contain product intent, requirements, and technical design in one
artifact. Keep those layers distinct:

- Product intent / PRD: who this serves, why it exists, success criteria, and
  product non-goals.
- Requirements: testable obligations the system must satisfy.
- Technical spec: the system contract that satisfies those requirements.

The spec defines separability. It names boundaries, contracts, invariants,
non-goals, security context, and proof expectations tied to requirements. It
does not define task sequence, worker assignment, execution DAGs, implementation
order, or exact pyramid test commands; those belong to `plan-creation-swarm`.

Core pipeline:

```text
fuzzy goal or design question
  -> intent and current-state scan
  -> bounded research/explorer lanes
  -> competing architecture lanes
  -> decision discussion for unresolved branches
  -> parent synthesis
  -> product intent, requirements, spec boundary, separability map, open questions
  -> optional handoff to spec-review-swarm, spec-handoff, or plan-creation-swarm
```

## Core Rules

- Do not implement code from this skill.
- Read current code, docs, prior specs, and logs before designing.
- Use subagents by default for substantial spec creation when research,
  codebase exploration, architecture comparison, security/trust-boundary
  mapping, or risk/tradeoff mapping can run as independent lanes. Spec creation
  lanes use high effort by default and xhigh effort for architecture, security,
  or crux-decision lanes. For tiny local decisions, name the smaller lane set
  used.
- Give every subagent a bounded packet with a concrete question, exact source
  inputs, source-of-truth inputs, lane-specific focus, security context,
  expected evidence, and completion receipt. Broad repo audits use an explicit
  broad-audit packet.
- When a shortcut prevents dispatching lanes in the current run, still name the
  intended lane packet shape, high/xhigh reasoning effort, candidate evidence,
  source anchors, completion receipt, `swarm-ledger.md`,
  `lanes/<lane-name>.md`, parent verification and synthesis rule, and route to
  `spec-review-swarm` for drafted-spec critique in the response.
- Treat lane outputs as candidate evidence until the parent reducer verifies
  source anchors and synthesizes accepted spec content.
- The parent must read key files returned by explorer lanes before recommending a design.
- Keep sequencing out of the spec. Do not include worker order, task order,
  implementation phases, execution DAGs, exact test commands, or validation
  command sequence except as proof expectations tied to requirements that
  `plan-creation-swarm` must later operationalize.
- Ask the user only for material decisions that cannot be answered from code, docs, or repo evidence.
- When asking a design question, include the current guess or recommended answer and why.
- Produce explicit tradeoffs, not a single happy path.
- Record security context when the design touches auth, secrets, parsing, filesystem, network, subprocesses, plugins, MCP, CI, package scripts, agents, or external services.
- If substantial design/spec work is clear and the user did not ask for
  chat-only output, write a parent ledger and lane artifacts by default.
- If the desired design/spec output is unclear, do not create files yet; use `discuss-with-me` or ask one material question first.
- Design artifacts contain decisions and technical rationale, not process history. Later cleanup, promotion, or archival belongs to `docs-maintain`.

## Workflow

1. Establish design mode:
   - Restate the goal and success shape.
   - Name assumptions and unknowns.
   - Resolve whether the output is chat-only, a design/spec artifact, or a handoff packet.
   - If the output is unclear, stop before writing files and clarify the intent.
2. Inspect current state:
   - Read relevant code/docs.
   - Search for adjacent implementations and prior plans.
   - Capture security-sensitive surfaces early.
3. Build research lanes when useful:
   - similar local feature or module lane
   - architecture/current-boundaries lane
   - external prior-art or docs lane
   - UX/API/CLI surface lane when relevant
   - security/trust-boundary lane for sensitive designs
   - if source gathering is substantial or depends on mixed source classes,
     route that phase through `research-swarm` and consume its ledger before
     making design recommendations
4. Build architecture option lanes:
   - minimal-change approach
   - clean-boundary approach
   - pragmatic/ship-first approach
   - risk-and-failure-mode approach
5. Synthesize:
   - Read lane outputs.
   - Verify important claims against source files or docs.
   - Deduplicate by decision, not by lane.
   - Preserve real disagreement as an open decision branch.
6. Discuss unresolved branches:
   - Ask one blocking question at a time.
   - Include the parent agent's recommended answer.
   - Explain the cost of each option.
7. Produce the design output:
   - recommended direction
   - product intent / PRD when product meaning is load-bearing
   - requirements as testable obligations
   - alternatives considered
   - what we gain and pay
   - boundaries and ownership
   - separability map and contracts
   - security context and non-goals
   - validation strategy
   - proof expectations, or explicit deferral to `plan-creation-swarm`
   - open questions
   - next skill to use
8. Write the artifact when appropriate:
   - For clear substantial design/spec work, create a repo-local temp or requested spec artifact unless the user said chat-only/no-files.
   - For chat-only or unclear design work, return the synthesis in chat and do not create files.
   - Do not decide long-term document lifecycle here; route cleanup or promotion to `docs-maintain`.

## Lane Set

Default lanes for substantial design work:

- `codebase-explorer`: finds similar features, ownership boundaries, and key files the parent must read.
- `prior-art-researcher`: researches library/API/platform patterns with source citations.
- `architecture-minimal`: argues for the smallest safe change.
- `architecture-clean-boundary`: argues for clearer separation of concerns and future-proof ownership.
- `architecture-pragmatic`: argues for the most shippable balanced approach.
- `security-trust-boundary`: identifies entry points, untrusted inputs, assets, auth assumptions, sensitive data, and privileged actions.
- `risk-and-tradeoff-design`: maps assumptions, future failure modes, and simpler alternatives.

For tiny design questions, run local versions of the relevant lanes and name the
lane set used.

## Required Spec Diagram

Every substantial spec artifact includes a boundary / separability map:

```text
Spec boundary / separability map

surface A
  owns: invariant X, source of truth X
  exposes: contract A

contract A <----> contract B

surface B
  owns: invariant Y, source of truth Y
  exposes: contract B
```

If this diagram is not useful for the domain, replace it with an equivalent
ownership map and explain why.

## Progressive Disclosure

- Load `../../references/lane-contract.md` and `references/swarm-packets.md`
  before spawning design, research, or architecture subagents.
- Load `references/discuss-with-me.md` when intent is unclear or design branches need user decisions.
- Use `research-swarm` when the design depends on external prior art, current
  web/docs, DeepWiki-style repository research, saved-reader sources, memory,
  session logs, or a portable evidence ledger.
- Load `../../references/source-inspirations.md` when updating this skill, explaining source practices, or comparing against admired upstream skills.

## Output Shape

Return:

- Current-state evidence inspected.
- Lanes run and lane status.
- Artifact path, or why no artifact was written.
- Full clickable artifact links (absolute path + line) for any spec/design
  artifacts the human is expected to open.
- Recommended design direction.
- Product intent / PRD, requirements, and technical contract when those layers
  are load-bearing.
- Alternatives and tradeoffs.
- Security context or "not security-sensitive" rationale.
- Decisions needed from the user.
- Suggested next skill: usually `spec-review-swarm`, `spec-handoff`, or
  `plan-creation-swarm`; use `plan-review-swarm` only after an implementation plan
  exists.
