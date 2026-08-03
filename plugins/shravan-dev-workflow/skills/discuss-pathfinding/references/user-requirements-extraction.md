# User-Requirements Extraction

This reference owns user/stakeholder classification, requirement questions, row construction, useful user-job sequence inputs, record scaling and identity, the goal boundary, and local completion for a user-requirements pathfinding destination.

Expected inputs: clarified destination and depth, participant and source identities, claimed decision authority, candidate evidence, file-permission boundary, and artifact conventions.

Return: requirement questions, classified user/stakeholder inventory, draft row-level requirements record, useful user-job sequence inputs, verified record identity and permitted home, confirmed requirements boundary or the exact owner decision needed, refusal/fallback result, and exact authority/evidence gaps.

## Classify Users and Stakeholders

Inspect these classes independently:

- end users performing the external job;
- developer users consuming an API, CLI, SDK, or extension;
- customers or buyers affected by value, policy, procurement, or outcome even when they never operate the surface;
- operators administering or recovering the surface;
- downstream agents acting as consumers.

Name the distinguishing behavior and affected outcome. Preserve customers and buyers as stakeholders when they never touch the surface; keep their needs and constraints without fabricating a direct-user journey. Resolve persona requests into behavioral, evidence-backed classes. Demographic and empathy-map templates are out of scope.

Good: “SDK consumer making a first authenticated call” and “buyer accountable for audit readiness” remain separate classes.

Bad: one generic “users” bucket, or erasing the buyer because no journey map applies.

## Ask the Questions That Define the Requirement

For every in-scope class, use `question-craft.md` to ask related questions together when they can be answered from the same current context. Keep dependent or unrelated questions for a later turn:

1. Job and outcome: what is the class hiring the surface to accomplish, in its own terms?
2. Pain and evidence: where is the missed outcome observable, and what usage data, ticket, observation, quotation, or other anchor supports it?
3. Authority: who can authorize the desired product meaning, and what governing source or current confirmation carries that authority?
4. Priority: which needs are must, should, or could, and who assigned that priority?
5. Negative space: which users or stakeholders are deliberately out of scope, and why?

“Wants it faster” remains a symptom until the blocked job and observable boundary are named. “Everything is must” remains an unresolved priority choice; force the tradeoff or return the missing priority owner.

## Construct Rows

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

Evidence and authority are separate. Usage, tickets, observation, and quotations can establish an `observational` need without authorizing it. An authorized owner choice or binding governing source makes a row `authorized` without proving prevalence. `advisory` rows are recommendations. `unresolved` rows remain hypotheses. Only `authorized` rows are normative-eligible downstream; never silently promote another state.

Classify each row in mixed-authority records. A document-level label never replaces row authority.

## Establish Authority Or Return The Gap

Do not infer authority from participation. Binding authority comes from an explicit decision-owner statement or a governing source whose scope covers the need; record its evidence anchor. An interviewee may supply strong observational evidence without owning product meaning.

If the user declines extraction, return `extraction declined`, the authoritative sources already available, the rows or evidence established so far, and the remaining owner/evidence gaps. Do not select a specification readiness label; `spec-design` owns that decision after it classifies the complete source inventory.

Stop this stage when every row has an evidenced authority state and any missing authority is an exact owner decision rather than an inferred answer.

## Capture User-Job Sequence Inputs

Capture sequence only when a direct-user job's steps, transitions, or pain relationship materially help the human confirm or correct the need. Return the class, user-worded steps or transitions, observed pain and evidence, desired observable difference, and cited U rows. Pathfinding may use a non-normative conversational sequence map to clarify an ambiguity; `spec-design` alone decides whether the durable specification needs a journey view and owns its normative rendering.

Teach the relationship through examples:

- Good: “SDK consumer requests credentials → makes first call → receives an actionable result; pain: authentication failure requires reading source.”
- Bad: “user opens `ExportModal`,” which is an implementation screen tour rather than the user's job.
- Bad: a stakeholder with no direct interaction receives a fabricated sequence.

A high priority alone does not make a need sequence-shaped. Keep stakeholder needs and constraints without fabricating interaction.

## Confirm The Goal Boundary

Before specification handoff, build a compact requirements boundary from the stabilized rows:

```text
primary customer, developer, contract, or library goal
affected classes and the outcome that matters to each
existing behavior or foundation that should be reused
actual missing capabilities or observable differences
allowed and protected system or capability surface at the clearest authoritative altitude
explicit non-goals
acceptable complexity: expected change shape and machinery that requires renewed approval
unresolved owner choices or evidence gaps
```

Existing foundation means observable current behavior or capabilities the owner expects to reuse; do not design internal architecture here. Missing pieces name the outcome gap, not every feature a complete platform might have. Establish allowed and no-touch systems or capability areas. Ask which repositories, packages, forks, or modules may change when the owner already has such a limit or when leaving it open could materially expand the work. Record that answer as an implementation boundary, not as product behavior and not as permission to invent internal structure. Otherwise preserve the higher-level boundary for `program-design` to realize. The agent may propose a provisional boundary for the owner to correct, but it remains provisional until confirmed. Useful acceptable-complexity guidance names the expected change shape and the additions that require renewed approval. “Production-ready and complete” is not useful guidance because it cannot reject expansion.

Challenge an addition by asking which U row it serves and what user-visible or contract outcome fails without it. Keep an unconfirmed expansion as an owner decision.

Show this same current model to the authorized owner for explicit confirmation or correction. Silence, generic assent, and the agent's own restatement do not confirm it. Return an unconfirmed record with the exact decision needed; do not call it ready for specification design.

Keep every boundary item visible even when its answer is still unknown. Name the missing observable behavior, permitted and protected systems, non-goals, and acceptable complexity separately; do not hide several unknowns inside one general scope question. An unresolved item stays in the record as an exact owner question.

## Scale the Record

- quick: return the record in chat unless a durable handoff is requested and files are allowed;
- standard, deep, or substantial handoff: write `docs/specs/<slug>/user-requirements.md` when files are allowed; otherwise return the complete record in chat;
- record classes and rows as they crystallize rather than reconstructing them at the end.

A durable record uses its path as its inspectable identity. An in-chat record returns its complete text and uses a session or message anchor only when the host exposes one. Assign U identifiers once within that record: reordering or correcting preserves the identifier; splitting creates new identifiers and marks the old row superseded. Carry out-of-scope classes, unresolved questions, and the subject-matter goal boundary in the record; keep confirmation state in the returned result. `decisions-and-docs.md` owns the general record-home discipline and reader test.

Complete when every in-scope class has row-level needs or an exact unknown, evidence and authority are separate, priorities name an assigner or gap, useful sequence inputs are captured without forcing a view, the record has a stable identity at a permitted destination, the requirements boundary and acceptable complexity are explicit, and the result carries owner confirmation of that same boundary or the exact decision still needed.
