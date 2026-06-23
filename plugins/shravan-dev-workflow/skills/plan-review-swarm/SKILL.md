---
name: plan-review-swarm
description: Use when adversarially reviewing an implementation plan or handoff before code changes, especially when the user asks to validate, poke holes in, or review a plan without executing it.
---

# Plan Review Swarm

Run a read-only plan review swarm. Load the whole artifact, compare it to live code/docs, dispatch bounded reviewer lanes for substantial plans, and challenge assumptions before anyone implements.

Core pipeline:

```text
accepted source artifact + produced plan
  -> dual whole-artifact coverage
  -> shared plan review packet
  -> mandatory whole-plan-cohesion lane
  -> bounded plan-review-swarm lanes
  -> optional external model lanes
  -> parent verification and synthesis
  -> receive findings
  -> route accepted plan issues
  -> verdict, findings, and route-back decision
```

## Core Rules

- Do not implement while reviewing.
- If a plan file exists, run `wc -l` and read every chunk before judging it.
- Resolve the accepted source artifact that the plan claims to implement:
  accepted spec, design, product requirement, goal contract, or handoff packet.
- Substantial plan review must load both primary artifacts directly: the
  accepted source artifact and the produced plan. Compact excerpts and parent
  summaries can route reviewers, but they do not replace direct source loading.
- Treat the plan as a claim, not truth. Verify major claims against current code, docs, package metadata, tests, and branch state.
- Separate blocker, important, question, and nit findings.
- Include evidence: file path, symbol or section, failure scenario, smallest fix, and proof/test.
- For substantial plans, dispatch bounded read-only reviewer lanes by default. Codex subagents are the normal backend because most sessions run in Codex, but the lane contract is not Codex-only.
- Give every lane a curated packet. Do not rely on inherited session context.
- For substantial plan reviews, always dispatch a first-class
  `whole-plan-cohesion` lane. Focused lanes, parent summaries, and parent-only
  coverage passes may supplement the review, but they do not satisfy the
  substantial whole-plan review requirement.
- Selected plan-review lanes load their durable
  `references/lanes/<lane>.md` file before returning. Inline lane overlays in
  `references/review-packet.md` are compact summaries only; the lane reference
  file is the source of truth for lane-specific checklist and calibration.
- Durable lane references also own lane-specific stance, evidence priority,
  analysis method, prioritized smells, materiality bar, overlap boundaries,
  cannot-verify boundaries, and output extras. The shared packet carries task
  instance data; it does not replace the lane's job contract.
- Plan-review lanes use medium or high reasoning effort according to plan size,
  risk, and latency cost. Security-sensitive, broad, or cross-module reviews
  should use high effort.
- Lane packets must explicitly say "do not edit files"; check the diff after they return if the tool surface permits edits.
- Include Claude, Gemini, or extra `agy` adversarial lanes only when the user explicitly asks. Use the Claude Code CLI harness for Claude and `agy` for Gemini.
- Treat subagent and external model output as candidate findings only, with
  source anchors and completion receipts. The parent reviewer verifies and owns
  synthesis.
- When a shortcut or missing artifact prevents dispatching lanes in the current
  run, still name the substantial-lane packet shape: role / mode, edit
  boundary, bounded question, decision target, accepted source artifact path,
  produced plan path, compact binding excerpts, parent routing summary as
  non-evidence, supporting evidence, inspect list, non-goals, durable
  lane-specific checklist path, output schema, contradiction handling,
  security context, `primary_sources_loaded`,
  `supporting_evidence_checked`, `source_truth_distinction_checked`,
  `coverage_scope`, `cannot_verify_from_focused_packet`, source anchors,
  proposed artifact path, confidence, remaining uncertainty, mandatory
  `whole-plan-cohesion` lane, and parent verification.
- After review, validate every candidate finding before accepting it. Do not blindly apply reviewer suggestions.
- Accepted blocker or important findings normally route back to
  `plan-creation-swarm` for revision with the full planning context. If a
  finding exposes a missing or wrong spec boundary, route back to
  `spec-creation-swarm` first and then `plan-creation-swarm` after the source
  boundary is repaired.
- If a finding is unclear, conflicts with user decisions, or would change code scope rather than plan text, stop and ask before changing the plan.
- If this skill is itself running inside a subagent, stay shallow: do not spawn another swarm unless the parent explicitly asked for nested review.
- For substantial plan reviews, write a repo-local temp review artifact by default unless the user explicitly asked for chat-only/no-files output.
- If the plan target or review goal is unclear, do not create files yet; clarify first.
- Review artifacts are lane outputs. Later cleanup, promotion, or archival belongs to `docs-maintain`.

## Workflow

Classify review as substantial when any of these are true:

- the plan is file-backed or handoff-backed and will be consumed by
  `implementation-execute-plan`
- the plan references an accepted source artifact, multiple requirements, proof
  gates, vertical slices, subagents, or parallel work lanes
- the work is cross-module, security-sensitive, high-risk, high/xhigh effort,
  or user-visible enough to need durable review evidence
- findings, decisions, proof obligations, or route-back state need later
  inspection

When classification is unclear, treat file-backed or implementation-facing
review as substantial unless the user explicitly asks for a lightweight
chat-only review.

1. Identify the review target, accepted source artifact, and mode:
   - `plan-file`: source implementation plan path exists.
   - `handoff-packet`: reviewing a packet prepared by another agent.
   - `chat-plan`: reviewing a plan only present in the conversation.
   - `accepted-source`: spec, design, product requirement, goal contract, or
     handoff packet that constrains the plan.
   - if no full artifact or chat plan is available, block with the required
     review surfaces instead of proceeding: whole-artifact coverage,
     requirements/proof mapping, validation-command claims, route-back
     handling, and substantial-lane packet fields including role / mode, edit
     boundary, bounded question, decision target, source-of-truth inputs,
     inspect list, non-goals, lane-specific checklist, output schema,
     contradiction handling, confidence, security context, completion receipt,
     mandatory `whole-plan-cohesion` lane, and parent verification
   - if the accepted source artifact is missing for a substantial plan review,
     block or mark the review limited instead of reviewing only the plan.
2. Establish coverage:
   - For source and plan files: line count plus chunk ranges.
   - For packets: list packet files read.
   - For chat plans: state that no source file was available.
3. Extract major claims:
   - architecture
   - file/module boundaries
   - API contracts
   - execution order
   - tests and validation gates
   - requirements/proof matrix coverage, source requirement references, testing
     pyramid coverage, TDD/red-green expectations, and proof layer sizing
   - security context or threat model
   - risks and assumptions
4. Check claims against live repo evidence.
5. Build a shared plan review packet with both primary artifacts, compact
   binding excerpts, parent routing summary as non-evidence, supporting
   evidence, source anchors, selected durable lane reference paths, and the
   full completion receipt contract.
6. Dispatch `whole-plan-cohesion` and bounded plan-review-swarm lanes for
   substantial plans.
7. Add optional external model adversarial lanes when requested.
8. Verify, dedupe, and rank candidate findings.
9. Receive and route findings:
   - load `references/review-checklist.md` for review reception rules
   - ready verdict routes to `implementation-execute-plan`
   - accepted blocker/important plan findings route to `plan-creation-swarm`
   - accepted source-boundary findings route to `spec-creation-swarm`, then
     back to `plan-creation-swarm`
10. Write a review report in chat.
11. For substantial reviews, also write the report under the plan workflow temp directory unless the user asked for chat-only/no-files output.

## Plan-Review Lanes

For substantial plans, spawn bounded read-only reviewer lanes in parallel when the tool surface supports it.

Backend rules:

- Use Codex subagents for most lanes by default.
- Use another available agent system only when explicitly requested, when the harness is already available, or when the current tool surface makes that lane safer than spawning a Codex child.
- Claude lanes must use the Claude Code CLI harness, not Anthropic API or SDK calls.
- Gemini lanes use `agy` as the local Gemini/Antigravity path.
- Regardless of backend, the lane is read-only and advisory.
- External counsel is a backend for a selected review lane, not a separate
  durable lane ID. Load `references/external-counsel.md` for Claude, Gemini,
  `agy`, or another outside model; also load the selected lane reference that
  defines the review focus.

Default lanes:

- `whole-plan-cohesion`: mandatory for substantial plan review; checks whether
  the whole produced plan implements the whole accepted source artifact, whether
  vertical slices compose, whether task order and parallel lanes fit together,
  and whether proof gates attach to the work they prove.
- `spec-compliance`: checks whether the plan satisfies the stated goal, user constraints, and source artifact.
- `architecture-assumptions`: challenges module boundaries, ownership, data flow, dependency direction, and hidden coupling.
- `testability-validation`: checks whether the proposed tests and commands
  actually prove behavior and catch likely failures. It also checks whether
  every material requirement traces back to the source spec/requirements, every
  proof gate maps to a testing-pyramid layer, lower proof layers are not skipped
  just because a higher layer exists, behavior changes name whether red/green
  evidence is required, and manual proof is justified when durable automated
  proof is not suitable.
- `security-reliability`: looks for trust-boundary, secret/token, race, cleanup, rollback, observability, and partial-failure gaps.
- `execution-scope`: checks ordering, cutovers, migration completeness, ambiguous task packets, and overbroad or under-specified work.
- `adversarial-design`: pokes holes in assumptions, contradictions, tradeoffs, and simpler alternatives.

For tiny plans, run the smallest relevant local review lane set and name the
lanes used.

Each lane receives the same shared packet plus one lane focus. It must return:

- lane name
- backend used
- verdict: ready, needs revision, or blocked
- findings grouped as blocker, important, question, or nit
- evidence, failure scenario, smallest plan edit, proof/test, and confidence
- lane-level confidence and remaining uncertainty, including when there are no
  findings
- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- `coverage_scope`
- `cannot_verify_from_focused_packet`
- completion receipt with source anchors, proposed artifact path, confidence,
  and remaining uncertainty
- for security findings: validation status as `validated`, `unvalidated with proof gap`, or `rejected`

## External Model Lanes

Load `references/external-counsel.md` when the user asks to include Claude, Gemini, `agy`, or another outside model in the plan review.

- `agy` / Gemini: optional external adversarial model lane when explicitly requested for plan review.
- Claude: optional external adversarial model lane only when explicitly requested; use `claude --print` / `claude -p`, not API calls.
- Oracle: excluded.

External model lanes receive the shared plan review packet and produce candidate findings only. Parent verification still decides what is accepted.

## Reduction

After lanes return:

1. Read every lane output.
2. Verify each candidate against the plan text, live code, docs, package metadata, tests, or branch state.
3. Deduplicate by root cause.
4. Drop speculation without a concrete failure path.
5. Preserve disagreement as an open question only when it changes implementation.
6. Rank parent-verified findings by execution risk.
7. Produce the smallest creation-route or owner-facing edit instruction, not
   implementation patches.

Plans missing a requirements/proof matrix, source requirement references, or
testing-pyramid proof layers are `needs revision`, not ready for
`implementation-execute-plan`, unless the plan documents why a compact proof
line is sufficient for its size.

Plans with required proof gates that cannot pass at the proposed task size are
`needs revision` until split into smaller provable slices.

## Addressing Accepted Findings

Plan review includes review reception. Load `references/review-checklist.md`
before routing parent-verified findings, returning owner edits, or deciding
whether feedback needs a user decision.

Never convert plan review into code implementation. Accepted findings change the
plan through `plan-creation-swarm`; `implementation-execute-plan` handles code
execution after the plan is ready.

## Progressive Disclosure

- Load `../../references/lane-contract.md` and
  `references/review-packet.md` before dispatching subagents or writing a
  copy-paste review prompt.
- When writing or refactoring durable lane references, load
  `../../references/lane-judgment-cards.md`; do not load it for ordinary review
  dispatch unless the lane text itself needs authoring/debugging.
- Load `references/lanes/whole-plan-cohesion.md` before dispatching the
  mandatory whole-plan lane for a substantial plan review.
- Load each selected focused lane reference before dispatching that lane:
  `references/lanes/spec-compliance.md`,
  `references/lanes/architecture-assumptions.md`,
  `references/lanes/testability-validation.md`,
  `references/lanes/security-reliability.md`,
  `references/lanes/execution-scope.md`, and
  `references/lanes/adversarial-design.md`.
- Load `references/review-checklist.md` when the plan is large, risky, or implementation-facing.
- Load `references/external-counsel.md` when user-requested Claude, Gemini, `agy`, or another outside model lane is included.
- Load `../ops-security-review/references/threat-model-context.md` when packaging or reviewing security-sensitive plans. This cross-skill reference is load-bearing; keep it in sync with `ops-security-review` if that reference moves.

## Output Shape

Return:

- Coverage evidence.
- Source artifact coverage and produced plan coverage.
- Verdict: ready, needs revision, or blocked.
- Findings grouped by severity.
- Questions that must be answered before execution.
- Suggested smallest creation route.
- Accepted/rejected/deferred findings.
- Swarm coverage: lanes run, lane status, backend used for each lane, external model lane status, and verification notes.
- Whole-plan cohesion status.
- Route-back decision: ready to implementation execution, accepted plan
  findings to plan creation, or source-boundary findings to spec creation then
  plan creation.
- Artifact path, or why no artifact was written.
- Full clickable artifact links (absolute path + line) for review reports,
  plans, or artifacts the human is expected to open.
- Explicit "do not implement code yet" note unless the user changes scope.
