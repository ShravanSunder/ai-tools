---
name: spec-creation-swarm
description: Use when creating or revising a spec, design, or architecture contract before an implementation plan exists, especially when the work needs bounded subagents, current-state exploration, separability mapping, or tradeoff clarification.
---

# Spec Creation Swarm

Use this skill to create the spec/design contract before writing an implementation plan. The parent session owns the mental model, synthesis, and recommendation. Subagents provide bounded research, exploration, and architecture comparison, not final decisions.

A spec may contain product intent, requirements, and technical design in one artifact. Keep those layers distinct:

- Product intent / PRD: who this serves, why it exists, success criteria, and product non-goals.
- Requirements: testable obligations the system must satisfy.
- Technical spec: the system contract that satisfies those requirements.

The spec defines separability. It names boundaries, contracts, invariants, non-goals, security context, and proof expectations tied to requirements. It does not define task sequence, worker assignment, execution DAGs, implementation order, or exact pyramid test commands; those belong to `plan-creation-swarm`.

Specs are clarity artifacts. They move fuzzy intent toward sharper product promise, requirements, boundaries, contracts, examples, non-goals, and proof expectations. The parent may leave unclear higher-level decisions named for the next refinement pass, but it must not hide them as implementation detail. Primary specs are durable repo artifacts when the work is substantial and not chat-only. In `shravan-dev-workflow`, keep primary specs under `docs/specs/` so humans and future agents can maintain, revise, and explicitly delete them when they are no longer useful. Research lanes, review reports, and planning scratch may stay in repo-local `tmp/` unless the user asks to promote them.

Core pipeline:

```text
fuzzy goal or design question
  -> intent and current-state scan
  -> bounded research/explorer lanes
  -> competing architecture lanes
  -> decision discussion for unresolved branches
  -> parent synthesis
  -> primary spec file with product intent, requirements overview, spec boundary,
     separability map, proof expectations, open questions, and slice routes
  -> optional handoff to spec-review-swarm, spec-handoff, or plan-creation-swarm
```

## Core Rules

- Do not implement code from this skill.
- Read current code, docs, prior specs, and logs before designing.
- Use subagents by default for substantial spec creation when research, codebase exploration, architecture comparison, security/trust-boundary mapping, or risk/tradeoff mapping can run as independent lanes. Spec creation lanes use `sidekicks`. `Advisors` will be used for checking architecture decisions.
- Give every subagent a bounded packet with a concrete question, exact source inputs, source-of-truth inputs, selected lane reference, lane-specific focus, security context, expected evidence, and completion receipt. Broad repo audits use an explicit broad-audit packet.
- When a shortcut prevents dispatching lanes in the current run, still name the intended lane packet shape, high/xhigh reasoning effort, candidate evidence, source anchors, completion receipt, `swarm-ledger.md`, `lanes/<lane-name>.md`, parent verification and synthesis rule, and route to `spec-review-swarm` for drafted-spec critique in the response.
- Treat lane outputs as candidate evidence until the parent reducer verifies source anchors and synthesizes accepted spec content.
- This skill owns phase-specific lane packets, reduction, and proof. Use `manage-agents` only for managing agent calls and sessions; do not copy those mechanics here.
- The parent must read key files returned by explorer lanes before recommending a design.
- For substantial specs, create a spec folder with one primary `<descriptive-slug>.md` file. Use slice specs only for vertical slices, app protocols, domain boundaries, ownership boundaries, or shared lower-level contracts; do not create appendix-style mini-doc sprawl. Keep every spec artifact file under 2000 lines.
- Keep sequencing out of the spec. Do not include worker order, task order, implementation phases, execution DAGs, exact test commands, or validation command sequence except as proof expectations tied to requirements that `plan-creation-swarm` must later operationalize.
- Ask the user only for material decisions that cannot be answered from code, docs, or repo evidence.
- When asking a design question, include the current guess or recommended answer and why.
- Produce explicit tradeoffs, not a single happy path.
- Record security context when the design touches auth, secrets, parsing, filesystem, network, subprocesses, plugins, MCP, CI, package scripts, agents, or external services.
- If substantial design/spec work is clear and the user did not ask for chat-only output, write the primary spec as a durable repo artifact and write the parent ledger/lane artifacts by default.
- If the desired design/spec output is unclear, do not create files yet; use `discuss-clarify-mental-models` for shared-model drift or ask one material question first.
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
   - if source gathering is substantial or depends on mixed source classes, route that phase through `research-swarm` and consume its ledger before making design recommendations
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
   - For clear substantial design/spec work in `shravan-dev-workflow`, create or update a durable repo spec artifact under `docs/specs/` unless the user said chat-only/no-files.
   - Keep supporting research lanes, review reports, and planning scratch in repo-local `tmp/` by default unless they are promoted separately.
   - For chat-only or unclear design work, return the synthesis in chat and do not create files.
   - Do not decide long-term document lifecycle here; route cleanup or promotion to `docs-maintain`.

## Lane Set

Default lanes for substantial design work:

| Lane | Status | Reference | Why |
| --- | --- | --- | --- |
| `codebase-explorer` | mandatory | `references/lanes/codebase-explorer.md` | Grounds the spec in current repo boundaries and proof patterns. |
| `architecture-minimal` | mandatory | `references/lanes/architecture-minimal.md` | Finds the smallest boundary-preserving design. |
| `architecture-clean-boundary` | mandatory | `references/lanes/architecture-clean-boundary.md` | Protects ownership, source of truth, and future separability. |
| `architecture-pragmatic` | mandatory | `references/lanes/architecture-pragmatic.md` | Balances delivery cost, maintainability, and proof. |
| `risk-and-tradeoff-design` | mandatory | `references/lanes/risk-and-tradeoff-design.md` | Names assumptions, falsifying scenarios, and proof burden. |

Conditional lanes:

| Lane | Status | Reference | Trigger |
| --- | --- | --- | --- |
| `prior-art-researcher` | conditional | `references/lanes/prior-art-researcher.md` | External docs, library behavior, admired skill patterns, platform behavior, or current prior art constrain the design. |
| `security-trust-boundary` | conditional | `references/lanes/security-trust-boundary.md` | Auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugin, MCP, CI, package-script, agent, or external-service surfaces are in scope. |
| `ux-api-cli-surface` | conditional | `references/lanes/ux-api-cli-surface.md` | User-visible behavior, API/CLI ergonomics, visual systems, manual UX proof, logs, traces, metrics, data, DB, or state evidence are load-bearing. |

For tiny design questions, run local versions of the relevant lanes and name the lane set used.

## Lane Orchestration Order

The parent owns lane sequencing. Run independent lanes in parallel where the tool surface supports it, but preserve these information dependencies:

1. Current-truth lane:
   - Run `codebase-explorer` first, or in the first parallel batch, whenever local code/docs constrain the spec.
   - Its output establishes owner/source-of-truth anchors, nearby patterns, proof patterns, and files the parent must personally read.
2. Source-expansion lanes:
   - Run `prior-art-researcher`, `security-trust-boundary`, and `ux-api-cli-surface` before architecture comparison when their evidence could change requirements, boundaries, contracts, proof expectations, or non-goals.
   - These lanes can run in parallel with `codebase-explorer` when their inputs are already named and do not depend on local owner discovery.
3. Architecture option lanes:
   - Run `architecture-minimal`, `architecture-clean-boundary`, and `architecture-pragmatic` after enough current/source evidence exists to make their tradeoffs real.
   - These lanes compare options; they do not decide the final design.
4. Crux/risk lane:
   - Run `risk-and-tradeoff-design` after candidate directions are visible, or in parallel with architecture lanes when the packet names the candidate direction and assumptions to test.
5. Parent collection pass:
   - Read lane outputs and required source anchors.
   - Verify high-impact claims against files/docs.
   - Reduce by decision: accepted, contested, rejected, deferred, or open.
   - Produce the primary spec and slice routes; do not preserve lane order as spec structure.

Each selected lane reference states its call timing, prerequisites, and collection contribution. If a lane cannot receive its prerequisites, record that as blocked or run an earlier research/current-state lane instead of sending a thin prompt.

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

If this diagram is not useful for the domain, replace it with an equivalent ownership map and explain why.

## Progressive Disclosure

- Load `references/swarm-packets.md` before spawning design, research, or architecture subagents.
- Load `references/creation-evidence-schema.md`; every substantive creation lane observation uses this schema before lane-specific context.
- Load only the selected `references/lanes/*.md` files. Each selected lane reference is a job contract; the parent still curates the task instance.
- Use `discuss-clarify-mental-models` when intent is unclear because the shared model is unstable; load `references/user-decision-questions.md` when a narrow design branch needs a direct user decision.
- Use `research-swarm` when the design depends on external prior art, current web/docs, DeepWiki-style repository research, saved-reader sources, memory, session logs, or a portable evidence ledger.
- Load `../../docs/source-inspiration-catalog.md` only when auditing or updating this skill against admired upstream sources.

## Output Shape

Return:

- Current-state evidence inspected.
- Lanes run and lane status.
- Artifact path, or why no artifact was written.
- Full clickable artifact links (absolute path + line) for any spec/design artifacts the human is expected to open.
- Recommended design direction.
- Product intent / PRD, requirements, and technical contract when those layers are load-bearing.
- Primary spec artifact path and any slice-spec routing map.
- Alternatives and tradeoffs.
- Security context or "not security-sensitive" rationale.
- Decisions needed from the user.
- Suggested next skill: usually `spec-review-swarm`, `spec-handoff`, or `plan-creation-swarm`; use `plan-review-swarm` only after an implementation plan exists.
