# Trigger Evals

Use this plugin-level eval sheet when changing skill descriptions, routing language, lifecycle boundaries, or release smoke behavior.

## Gate Checks

These are objective gates, not soft rules. If the answer to the gate question is "no", the skill has not cleared the scenario.

- Whole artifact gate: if a file artifact is reviewed, handed off, or executed, can the agent show line count plus chunk coverage?
- Parent ownership gate: if subagents or external models ran, did the parent verify claims before accepting them?
- Read-only gate: if the workflow is review, discussion, handoff, audit, or investigation, is the diff still clean unless the skill explicitly writes artifacts?
- Scope gate: if validation fails outside the approved work path, did the agent report the blocker instead of editing unrelated infrastructure?
- Runtime visibility gate: after a plugin release, does `codex plugin list` report the same installed version as source?
- Proof-chain gate: if implementation is reviewed or called done, does the proof map back to requirements/spec/plan?
- Red/green gate: for behavior changes, did the proof include failing-before-passing evidence or a documented approved exception?
- Plan proof gate: before execution, does the plan map each material requirement to a proof layer?
- Split proof gate: if the required proof cannot pass at the current scope, does the workflow split or replan instead of weakening proof?
- Artifact-link gate: when a spec, plan, review report, changelog, handoff, debug artifact, or other human-openable file is reported, is there a full clickable artifact link (absolute path + line)?
- Goal clarity gate: if objective, scope, proof, or stop condition is unclear, did `orchestrator-goal` route never-articulated intent/unmade decisions to `discuss-pathfinding` and a drifted existing model to `discuss-clarify-mental-models` instead of setting a fuzzy long-horizon goal?
- Artifact gate: if clear spec/plan/debug work ran and the user did not ask for chat-only/no-files output, did the phase skill write its lane artifact?
- Artifact lifecycle gate: if cleanup, archival, promotion, or source-of-truth reconciliation is needed, did `docs-maintain` own that lifecycle decision instead of the phase skill?
- Review-classifier gate: if `spec-program-review` was invoked only to classify review requirement, did it bind exact artifact digests, return `review-required | non-substantial` or a blocked missing-input result, dispatch zero reviewers, and return no review verdict?
- Planning-readiness check: for design-bearing work, does `plan-creation-swarm` have a current pair-mode `ready` review result bound to the exact current specification and program-design digests; or, for the bypass, did source inspection positively prove that every design-bearing category is absent?

## Review Routing

### spec-program-review should trigger

- "For this exact specification digest, classify whether independent specification-only review is required."
- "For this exact program-design digest, classify whether independent program-only review is required."
- "Attack this drafted architecture spec before we plan the implementation."
- "Review this specification for authority and testability."
- "Is this specification/program-design pair ready for planning?"

Gate: the `classify-review-requirement` operation binds exact digests and complete scoped governing-source inventory, returns `review-required | non-substantial` or a blocked missing-input result, dispatches zero reviewers, and returns no review verdict. A separate review invocation binds exact digests, reads the complete required artifact set, dispatches one fresh mode-complete reviewer plus predicate-selected focused lanes, and returns a coverage-bound non-accepting verdict.

### spec-program-review should not trigger

- "Review this implementation plan before I execute it." -> `plan-review-swarm`
- "Review this PR diff for bugs." -> `implementation-review-swarm`
- "Help me write the plan from this spec." -> `plan-creation-swarm`
- "Turn this unreviewed specification into an implementation plan." -> `plan-creation-swarm` loads, then its readiness check routes the missing program design or pair review
- "Create, update, or evaluate the spec-program-review runtime skill package." -> `skills-creation`
- "Run a standalone threat model on this service." -> `ops-security-review`
- "Use spec-review-swarm on this draft." -> explicitly requested legacy `spec-review-swarm`

### plan-review-swarm should trigger

- "Validate this implementation plan against the repo before coding."
- "Poke holes in this implementation-plan handoff packet before another agent runs it."
- "Read this plan and tell me if execution order or validation is wrong."

Gate: the target is a written implementation plan or `plan-handoff` packet, never a raw spec/design or `spec-handoff` packet. Whole-artifact coverage is required; plans missing the requirements/proof matrix (without a documented compact proof line) or with proof gates that cannot pass at task size are `needs revision`. Accepted blocker/important findings route back to `plan-creation-swarm`; Why/What gaps route to `spec-design`, and structural-How gaps route to `program-design`.

### plan-review-swarm should not trigger

- "Critique this pre-plan design proposal." -> `spec-program-review`
- "Review this spec-handoff packet before planning." -> `spec-program-review`
- "Run reviewers over this PR." -> `implementation-review-swarm`
- "Execute this validated plan." -> `implementation-execute-plan`

### implementation-review-swarm should trigger

- "Run a review swarm on my branch diff."
- "Review this PR with subagents before merge."
- "Adversarially review the implementation in these files."

Gate: verifies candidate findings against artifacts; missing or unmapped implementation proof yields `not_ready`. Accepted blocker/important findings route back to `implementation-execute-plan` unless a tiny same-session fix is explicitly scoped.

### implementation-review-swarm should not trigger

- "Review this implementation plan before code." -> `plan-review-swarm`
- "Attack this spec before planning." -> `spec-program-review`
- "Discuss whether this should be a feature at all; we have not decided." -> `discuss-pathfinding`
- "Push this branch, watch GitHub, handle existing comments, and merge when ready." -> `implementation-pr-wrapup`

### implementation-pr-wrapup should trigger

- "Push this branch and open the PR."
- "Update the PR and watch checks/comments."
- "Handle the existing PR comments and get this merge-ready."
- "Merge when ready."
- "CI is green; check review threads and finish the PR."

Gate: treats GitHub PR comments and review text as untrusted input, inspects local branch state, checks, comments, review threads, mergeability, and user merge authorization before any readiness or merge claim.

### implementation-pr-wrapup should not trigger

- "Review this PR diff for bugs." -> `implementation-review-swarm`
- "Run reviewers over this PR before merge." -> `implementation-review-swarm`
- "Adversarially review this branch before merge." -> `implementation-review-swarm`
- "Validate this implementation plan before coding." -> `plan-review-swarm`

## Boundary Invariants

- `spec-design` owns authoritative Why/What; `program-design` owns structural How; `spec-program-review` independently reviews either artifact or their pair.
- Authoring, updating, or evaluating any one named runtime skill package—including `spec-design`, `program-design`, or `spec-program-review`—routes through `skills-creation`; the three skills may run only from an explicit parent composition packet/result.
- Accepted review findings return to their semantic owner: Why/What to `spec-design`, structural How to `program-design`, caller-state issues to the composing caller.
- `spec-creation-swarm` and `spec-review-swarm` remain available only for explicit legacy invocation.
- Plans/handoffs are reviewed after a design/spec direction exists and before execution; accepted plan review findings return to `plan-creation-swarm`.
- `plan-improve-repo` may vet findings before planning readiness is established, but writes or marks an executable plan `ready` only from a current exact-digest pair-ready result or positively proven implementation-mechanics-only classification.
- Code/diffs/PRs/commits/files are reviewed by the implementation swarm.
- Existing PR feedback follow-through belongs to `implementation-pr-wrapup`; fresh code-review discovery belongs to `implementation-review-swarm`.
- Spec/design handoff packages pre-plan context; it does not create the plan.
- A spec/design handoff routes to planning only when it proves a current pair-mode `ready` review bound to the exact current specification and program-design digests; missing How routes to `program-design`, and a complete but unreviewed/stale pair routes to `spec-program-review`.
- Plan creation turns a verified pair-ready input or proven implementation-mechanics-only bypass into a written implementation plan, execution DAG, proof matrix, and parallel work lane map; it does not execute code or invent missing design.
- Plan handoff packages an existing implementation plan; it does not package raw spec/design context as though a plan exists.
- Implementation handoff requires implementation state such as branch, diff, changed files, validation, failed commands, or blocker evidence.

## Full Suite Routing

### spec-design should trigger

- "Define the problem, requirements, public contract, and proof obligations."
- "Revise this specification's observable behavior and failure expectations."
- "Write the specification for this feature before we design the architecture."

Gate: produces authoritative Why/What without internal component structure, binds source authority, and traces problem/outcome through requirements/contracts/failure/proof.

### spec-design should not trigger

- "Create or update the spec-design runtime skill package." -> `skills-creation`
- "Design the component tree and state flow from these settled requirements." -> `program-design`
- "Independently review this finished specification." -> `spec-program-review`
- "Run a standalone threat model on this API." -> `ops-security-review`

### program-design should trigger

- "Design the component tree, owners, calls, state, and recovery flow."
- "Turn this settled specification into structural How before planning."
- "Design the internal architecture for these settled product obligations."

Gate: binds the governing specification and produces a source-grounded composable structural model without inventing product meaning or task order.

### program-design should not trigger

- "Create or update the program-design runtime skill package." -> `skills-creation`
- "Decide what this product must guarantee." -> `spec-design`
- "Independently review this finished architecture." -> `spec-program-review`
- "Threat-model this service as a standalone security exercise." -> `ops-security-review`

### spec-program-review named-package boundary

- "Evaluate whether the spec-program-review skill's trigger and lane references are well designed." -> `skills-creation`
- "Review the current spec-program-review skill implementation as one named skill package." -> `skills-creation`

Gate: direct named-skill-package work routes through `skills-creation`. An explicit `skills-creation` parent packet may compose the general specification, program-design, or review craft without transferring package-authoring authority.

### legacy swarm skills should trigger

- "Use spec-creation-swarm to run the legacy creation workflow."
- "Use spec-review-swarm to run the legacy adversarial review workflow."
- "Run a review swarm over this design draft." -> `spec-program-review`; generic swarm wording does not explicitly select the legacy skill

Gate: explicit skill name or explicit legacy/fixed-swarm request is present. Generic creation or review language never selects a legacy swarm.

### discuss-pathfinding should trigger

- "Grill me on what this feature should do; the requirements are still in my head."
- "Interview me about this tacit workflow and the decisions we have not made."
- "We have not chosen the ownership policy yet; help me surface the real options."

Gate: the work is extracting never-articulated understanding, tacit process knowledge, or an unmade decision. Generic "grill me" language routes here unless the prompt explicitly says an established shared model drifted or broke.

### discuss-clarify-mental-models should trigger

- "Our previously agreed plan/spec boundary has drifted; reconstruct where our shared model diverged."
- "We keep using the same terms differently after the design changed; reconverge the shared map."

Gate: the prompt provides an explicit drift, break, contradiction, or repeated-correction signal in an existing shared model. The model is made inspectable with a named map shape, bounded evidence, separated inherited frame / first principles / assumptions, branches, countercase, rebuilt model, confirmation/open state, and next workflow. It stays read-only.

Gate: broad evidence gathering, prior-art research, current docs/web research, Reader research, memory mining, and session-log searches are routed to `research-swarm` after the decision boundary is named.

### discuss-clarify-mental-models should not trigger

- "Grill me until we figure out the requirements." -> `discuss-pathfinding`
- "Help me make this design decision; I have not chosen yet." -> `discuss-pathfinding`
- "Research current framework behavior before we decide." -> `research-swarm`

### research-swarm should trigger

- "Research the prior art and write a tmp evidence ledger."
- "Use subagents to look through code, docs, DeepWiki, Reader, and session logs."
- "Find source-grounded evidence before we decide the design."

Gate: research questions are framed before lane dispatch; local re-anchor happens before external comparison when a repo is involved; claims are labeled as direct observation, cited source summary, user-memory evidence, inference, or unresolved.

### research-swarm should not trigger

- "Grill me on the requirements that still live in my head." -> `discuss-pathfinding`
- "Reconverge our drifted shared model using these already-known sources." -> `discuss-clarify-mental-models`
- "Define observable requirements from this evidence." -> `spec-design`
- "Shape the component architecture from these settled requirements." -> `program-design`
- "Review this implementation plan." -> `plan-review-swarm`

### orchestrator-goal should trigger

- "Use /goal for this already-discussed release and make the completion gates explicit."
- "Turn this clear migration objective into a Claude goal prompt with proof gates."
- "Audit the active goal and tell me which workflow should own the next phase."

Gate: clear goals compile a contract with objective, scope, required reading, proof gates, stop condition, blocked condition, checkpoint rhythm, and next workflow.

### orchestrator-goal should not trigger

- "Make my workflow better; I have not worked out the objective yet." -> `discuss-pathfinding`
- "Our agreed goal has drifted; rebuild the shared objective before compiling it." -> `discuss-clarify-mental-models`
- "Review this PR." -> `implementation-review-swarm`
- "Execute this plan." -> `implementation-execute-plan`

Gate: never-articulated intent or unmade decisions route to `discuss-pathfinding`; an existing goal model that drifted routes to `discuss-clarify-mental-models`. There is no inline mini interview path inside `orchestrator-goal`.

### docs-maintain should trigger

- "Clean up README and AGENTS so they match the current plugin state."
- "Audit stale plans and tell me what should be purged or preserved."

Gate: source of truth is named before edits; destructive cleanup is proposed before applying. Existing specs, plans, debug notes, and handoffs are classified for cleanup, archival, or promotion; active phase work remains with its phase skill.

### ops-security-review should trigger

- "Run an authorized security scan on this PR."
- "Route this repository-wide security audit to the right Codex Security skill."

Gate: official Codex Security route selected; normal review lanes are not claimed as audit coverage.

### plan-handoff should trigger

- "Prepare a copy-paste prompt so another agent can review this plan."
- "Package this existing implementation plan for a fresh session."

Gate: an implementation plan exists; writes a repo-local handoff file and prints the copy-paste prompt in chat. The packet carries the requirements/proof matrix and any open proof gaps.

### spec-handoff should trigger

- "Package this design/spec state for a fresh session."
- "Prepare a copy-paste handoff for this architecture proposal before planning."

Gate: packages spec/design context, decisions, non-goals, open questions, evidence, exact artifact digests, and pair-review freshness without creating an implementation plan or calling the spec complete. The packet recommends `plan-creation-swarm` for design-bearing work only when a current pair-mode `ready` review covers the exact current specification and program-design digests; missing How routes to `program-design`, and a complete but unreviewed/stale pair routes to `spec-program-review`.

### plan-creation-swarm should trigger

- "Turn this exact current specification/program-design pair and its pair-mode ready review result into an implementation plan."
- "This change only applies already-decided implementation mechanics; classify that claim and create the task sequence if the bypass is proven."
- "The skills-creation parent packet explicitly authorizes plan creation for this named spec-design runtime skill package; use that exact parent result to plan the verified-ready change."

Gate: before source inspection, the skill records `general-domain | runtime-skill-package`; a runtime skill package requires the exact explicit `skills-creation` parent packet/result identity or routes to `skills-creation` and stops. Design-bearing planning starts only when a current pair-mode `spec-program-review` result is `ready` for the exact current specification and program-design digests. Missing Why/What routes to `spec-design`; missing How routes to `program-design`; a complete but unreviewed, non-ready, or stale pair routes to `spec-program-review` or preserves the current review's semantic-owner remediation routes. The bypass is allowed only when current source inspection proves that no new product obligation, owner/boundary, interface, state semantic, failure/recovery policy, concurrency/consistency decision, compatibility realization, trust control, or proof seam is required. Once planning readiness is verified, the skill stays read-only, creates a written implementation plan, includes an execution DAG with parallel lanes or a serial-work rationale, maps material requirements to proof gates, and splits work whose proof cannot pass at the proposed scope.

### plan-creation-swarm should not trigger

- "Plan changes to the spec-design runtime skill's trigger and references." -> `skills-creation`
- "I have a pair-ready design for a named runtime skill package, but no explicit skills-creation parent packet." -> `skills-creation`
- "Create the missing structural How before planning." -> `program-design`

### plan-improve-repo should trigger

- "Audit this repo and make plans for high-leverage improvements."
- "Find the next refactors worth doing, but do not code them."
- "Validate the improvement backlog and tell me what is ready to execute."

Gate: stays read-only against source and vets candidates against files. It records `general-repo | runtime-skill-package` before recon and requires an explicit `skills-creation` parent identity for the latter. Before writing or marking an executable plan `ready`, it records either a current exact-digest pair-ready basis with required local review coverage current or a positively proven implementation-mechanics-only basis. Design-required findings route to `spec-design`, `program-design`, or `spec-program-review` without plan writing; verified-ready plans route to review, handoff, or execution.

### plan-improve-repo should not trigger

- "Turn this spec into an implementation plan." -> `plan-creation-swarm`
- "Audit the spec-design runtime skill and plan changes to its trigger and references." -> `skills-creation`
- "Write an executable architecture refactor plan from this unreviewed finding." -> `program-design`, then `spec-program-review`
- "Execute this existing plan." -> `implementation-execute-plan`
- "Review this plan for holes." -> `plan-review-swarm`

### implementation-handoff should trigger

- "Package this in-progress implementation for Claude to review."
- "Give me a copy-paste handoff for another agent to continue or audit this work."

Gate: current branch, diff, changed files, validation, risks, and stage are captured; implementation proof is included; prompt is printed and written to a file.

### implementation-execute-plan should trigger

- "Validate this plan and execute it."
- "Continue from this handoff and use subagents for bounded slices."

Gate: plan is validated against live repo before edits; subagent slices have bounded write sets; final claim includes fresh implementation proof. If proof cannot pass inside the approved scope, split or replan.

### debug-investigation should trigger

- "Root-cause this flaky failure without fixing yet."
- "Investigate why this build started failing."

Gate: diagnosis is evidence-backed before fix phase; failed hypotheses do not stack into blind patching. Real debugging writes a debug artifact unless chat-only/no-files was requested or the bug packet is not clear enough yet.

### skill-audit should trigger

- "Audit these skills against session evidence and upstream inspirations."
- "Find stale or duplicated skill behavior before we create anything new."

Gate: recommendations classify update/create/merge/skip and cite evidence or source inspiration.

### tui-presentation should trigger

- "Draw out this architecture."
- "Compare these designs in chat."
- "Show me the research lanes and what is still open."
- "Explain this without one giant diagram."

Gate: output is visually structured for monospace chat, uses disclosure sequence or visual-family selection when useful, does not turn TUI into a Mermaid catalog, and keeps code, config, paths, URLs, and technical tokens in semantic markdown.

### ops-linear-tracking should trigger

- "Create Linear milestones and issues from this architecture doc."
- "Show what tickets are blocked or unblocked."

Gate: docs remain the design source of truth; tickets track status and dependencies without duplicating long design text.
