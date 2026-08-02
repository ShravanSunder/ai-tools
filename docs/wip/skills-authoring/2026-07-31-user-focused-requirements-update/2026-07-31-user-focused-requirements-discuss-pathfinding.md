# Run A — discuss-pathfinding User-Requirements Extraction

Date: 2026-07-31
Status: proposed; pending `skills-creation` review
Classification: behavior-changing update to one named skill
Target skill: `discuss-pathfinding`
Authoring basis: user-directed intent
Proof posture: static and manual proof in this changeset; pressure scenarios authored but model execution deferred by explicit user direction as an accepted behavior-proof gap

## Promise and Success

This update helps agents reliably extract evidenced, priority-bearing user and stakeholder needs when product meaning is unwritten and must become a trustworthy input to a future specification.

Success means a human can express requirements in their own terms and see those requirements reflected back clearly enough to correct misunderstandings before specification design. The run distinguishes direct user classes from affected stakeholders, captures row-level evidence and authority without promoting hypotheses, forces priority tradeoffs, captures user-job sequence only when it clarifies the need, and returns an appropriately scaled record that `spec-design` can consume without copying its format. Before handoff, the authorized owner confirms a compact boundary covering the goal, existing foundation, actual missing pieces, non-goals, and complexity budget.

## Trigger Surface

Keep the skill both model- and user-invocable. Use this literal frontmatter:

```yaml
description: Use when user or stakeholder requirements, user needs, behavioral personas, tacit process knowledge, domain terms, or design decisions are unwritten and must be extracted from someone's head or an unmade decision through interview or grilling, especially "grill me", "interview me", "think through with me", or "help me figure out what I actually want". Not for maintaining settled content in an existing artifact, repairing a drifted shared model, gathering evidence from artifacts, authoring authoritative Why/What from settled sources, defining internal structural How, in-chat visuals with no extraction request, or independent review of a drafted specification, program design, or plan.
```

Preserve the adjacent boundaries:

- written evidence gathering belongs to `research-swarm`;
- drifted shared understanding belongs to `discuss-clarify-mental-models`;
- authoring authoritative Why/What from settled sources belongs to `spec-design`;
- internal component and call design belongs to `program-design`;
- an in-chat visual with no extraction request belongs to `tui-presentation`;
- maintaining or reformatting settled content in an existing artifact belongs to `docs-maintain`.

True prompts include “gather user requirements for checkout,” “interview SDK users about first-call friction,” and “interview me to extract the checkout journey, then add it to the user-requirements record.” Near misses include “what do users complain about in support tickets?” and “the journey is accepted; render it into the existing record without changing meaning.”

## Main-Path Surface

Add one observable branch during destination classification. The branch owns extraction and record completion; specification view selection remains downstream in `spec-design`.

```text
IF the destination includes user requirements for future specification or product work, load `references/user-requirements-extraction.md` and return the grill axes, classified user/stakeholder inventory, draft row-level requirements record, user-job sequence inputs when they clarify a need, record identity verification, boundary model plus explicit owner-confirmation result or exact owner decision needed, and unresolved authority/evidence gaps.
```

Extend the durable-record step and completion blockers so a substantive user-requirements destination cannot finish without either the scaled record or the exact unresolved owner/evidence gap. Block handoff to specification design unless the same current boundary model has explicit owner confirmation. When confirmation is absent, return the exact owner decision needed and do not present the record as ready. The existing chat-only bright line overrides depth and handoff defaults: never create a file when the user requested chat-only or no files.

After the requirements rows stabilize and before returning them for specification design, perform boundary check 1. Ask only the questions needed to establish:

```text
primary customer, developer, contract, or library goal
affected classes and the outcome that matters to each
existing behavior or foundation that should be reused
actual missing capabilities or observable differences
explicit non-goals
complexity budget: expected change shape and machinery that requires renewed approval
unresolved owner choices or evidence gaps
```

Show the compact model to the authorized owner and ask them to confirm or correct it. Reuse an explicit current confirmation of the same model; do not infer confirmation from silence or from the agent's own restatement. The ordinary step-7 strike list may proceed with clearly disclosed, non-gating assumptions, but boundary check 1 is the specification-handoff gate and requires a concrete owner confirmation or correction. The subject-matter boundary and complete U-row set belong in the requirements record because later design depends on them. Confirmation state belongs in the returned result, not in a `Status: Accepted` line or review narrative. Downstream simplification may change structural How while preserving this accepted requirements set; removing or superseding a confirmed U row requires explicit owner authority.

## Depth Surface

Create `references/user-requirements-extraction.md` as the teaching owner for eliciting the boundary: what to ask, how to distinguish foundation from missing behavior, good and bad complexity budgets, and when confirmation blocks handoff. It receives the clarified destination, participant and source identities, claimed decision authority, candidate evidence, pathfinding depth, file-permission boundary, and artifact conventions. It returns the classified inventory, row records, user-job sequence inputs when useful, verified record identity, boundary model plus explicit owner-confirmation result or exact owner decision needed, refusal/fallback result, and exact gaps. Run B's `authority-and-problem-framing.md` owns whether that returned boundary and requirements record are acceptable or recoverable for specification work.

### Classification

Inspect these classes independently:

- end users performing the external job;
- developer users consuming an API, CLI, SDK, or extension;
- customers or buyers affected by value, policy, procurement, or outcome even when they never operate the surface;
- operators administering or recovering the surface;
- downstream agents acting as consumers.

Good classification names distinguishing behavior and the affected outcome. Bad classification uses “users” as one bucket or erases a buyer because no journey map applies. Behavioral personas are allowed; demographic or empathy-map templates are out of scope.

### Row Contract

Each need row carries:

```text
stable identifier: U1, U2, ...
affected user or stakeholder class
need or outcome in that class's terms
evidence anchor and evidence type
authority state: authorized | observational | advisory | unresolved
priority: must | should | could
priority assigner
hypothesis state when unresolved
```

The need/outcome and why it matters are the row's human meaning; evidence, authority, and priority qualify that meaning rather than replacing it. Contract or library work names the developer/consumer job and the compatibility, reliability, or integration consequence that makes the need important.

Evidence and authority are separate. Usage, tickets, observation, and quotations can establish evidence without granting product-decision authority. An authorized owner choice or binding governing source can make a row `authorized` without proving current prevalence. `observational` rows have evidence but no normative authority; `advisory` rows are recommendations; `unresolved` rows remain hypotheses. Only `authorized` rows are normative-eligible. Mixed-authority records classify each row, not only the whole document.

Hypotheses remain visible and non-normative. They cannot authorize requirements, acceptance, or a ready result.

### Authority and Refusal

Do not infer authority from participation. Establish binding authority from an explicit decision-owner statement or a governing source whose scope covers the need; record the evidence anchor for that authority. An interviewee may supply valuable observational evidence without being the product decision owner. When binding authority is absent, keep the row `observational`, `advisory`, or `unresolved` and return the exact owner decision needed.

If the user declines requirements extraction, return `extraction declined`, the authoritative sources already available, the rows or evidence established so far, and the remaining owner/evidence gaps. Do not select `locally-ready`, `decision-needed`, or `evidence-blocked`; `spec-design` owns that decision after it classifies the complete source inventory. Stop this stage when every row has an evidenced authority state and the refusal/fallback result, when applicable, names what downstream classification can and cannot rely on.

### Jobs, Pain, and Priority

Ask for the job the class is trying to complete, the observable pain or missed outcome, the evidence, and the desired difference. “Wants it faster” is incomplete until the blocked job and observable boundary are named. “Everything is must” is not prioritization; ask who assigns priority and force the tradeoff or return the unresolved choice.

Name out-of-scope users or stakeholders and why the work does not serve them.

### Goal Boundary and Complexity Budget

The goal boundary is the reduction layer between collected needs and design. It distinguishes the requested outcome from plausible adjacent work. Existing foundation means observable behavior, current capabilities, or named systems the owner expects to reuse; it does not require pathfinding to design internal architecture. Actual missing pieces describe the gap that must be closed, not every capability a complete platform might someday need.

The complexity budget is qualitative unless the domain supplies a meaningful quantity. It names the expected change shape and the additions that would reopen scope. Good: “add current V2 customer scenarios, synthetic truth, assertions, and two runner seams; no persistence, certification, or cross-run governance.” Bad: “production-ready and complete,” which gives later authors no boundary against expansion.

Challenge proposals that do not serve a captured need. Ask which U row the addition serves and what user-visible or contract-relevant outcome fails without it. Record an unconfirmed expansion as an owner decision, not as another requirement.

### User-Job Sequence Inputs

Capture sequence only for a direct-user job whose steps, transitions, or pain relationship materially help the human confirm or correct the need. A stakeholder with no direct interaction keeps need rows and constraints but receives no fabricated sequence. A high priority by itself does not make a need sequence-shaped.

Good input: “SDK consumer requests credentials → makes first call → receives an actionable result; pain: authentication failure requires reading source.” Bad input: “user opens `ExportModal`,” which is a screen tour or internal structure rather than the user's job. Return the class, user-worded steps/transitions, observed pain and evidence, desired observable difference, and cited U rows to `spec-design`; that skill alone decides whether a journey map is required and renders it.

### Artifact Scale

- quick: return the record in chat unless a durable handoff is requested and files are allowed;
- standard, deep, or substantial handoff: default to `docs/specs/<slug>/user-requirements.md` only when files are allowed; otherwise return the complete record in chat;
- record classes and rows as they crystallize rather than reconstructing them from memory at the end.

Every returned record has a record-scoped identity. Assign U identifiers once within that record; reordering or correcting a row preserves its identifier, while a split creates new identifiers and marks the old row superseded by them. A durable record exposes its path; an in-chat record returns its complete text and uses a session/message anchor only when the host exposes one. The durable record also carries out-of-scope classes and unresolved questions. Row authority and supersession remain explicit through the row fields and identity lifecycle above. `decisions-and-docs.md` retains the reader test and general record-home discipline.

When the specification artifact exists, expose the top-down `requirements -> specification -> program design` chain as a compact link or breadcrumb. Do not add a paragraph that re-explains each artifact's role.

Complete when every in-scope class has row-level needs or an exact unknown, evidence and authority are separate, priorities name an assigner or gap, useful user-job sequence inputs are captured without forcing a view, stable identities are present, the goal boundary and complexity budget are present, the owner has confirmed or corrected the boundary, and the scaled record is returned at a permitted destination. Without owner confirmation, return the record plus the exact boundary decision needed; do not present it as ready for specification design.

## Shared Interfaces

`discuss-pathfinding` owns elicitation and the full record shape and returns it intact. Run B `spec-design` owns the acceptance and recovery contract for boundary check 1, this record, the accepted requirements set, or an equivalent source, including source precedence and whether an inspectable location is needed for human verification. `spec-design` separately classifies the source in its governing-source inventory. Equivalent sources do not have to imitate this document format.

## Proof Surface

Add deferred pressure scenarios for direct users, developer users, customer stakeholders, operators, declined extraction, already-authoritative sources, mixed-authority participants, forced priority, non-sequential must-priority needs, stable identity updates, chat-only standard/deep runs, non-load-bearing classes, artifact scaling, a vague “production-ready” complexity budget, a proposed platform expansion with no U-row consequence, and a downstream How simplification that attempts to delete five of six confirmed requirement groups. Add static checks that the trigger, authority/refusal behavior, record fields, identity lifecycle, boundary-check fields, the boundary-confirmation exception to ordinary strike-list continuation, accepted-requirements preservation, `spec-design` consumer boundary, file-permission override, and completion boundary exist. Manually inspect one complete in-chat record and one durable record for stable identity, readable traceability, and a confirmed goal boundary without workflow status prose. By explicit user direction, do not run model pressure tests in this changeset; report behavior proof as a user-accepted deferred gap.

## Implementation Boundary

Expected changed homes: `discuss-pathfinding/SKILL.md`, new `references/user-requirements-extraction.md`, including boundary check 1, `docs/diagram-vocabulary.md`, trigger/UI metadata if stale, static tests, deferred scenarios, version, and changelog. Hard-cut over the current pathfinding-owned User-Requirements Journey Views table, renderer call, rendering completion blocker, journey-request return, and stale maintainer-index row to the user-job sequence inputs consumed only by `spec-design`; after the cutover the vocabulary names no pathfinding-owned or pathfinding-rendered journey view. Do not change question-craft ownership, change general pathfinding depth, alter other skills' triggers, or change retired skills in this run.
