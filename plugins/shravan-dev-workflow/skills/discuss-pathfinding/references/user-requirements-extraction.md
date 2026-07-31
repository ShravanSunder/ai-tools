# User-Requirements Extraction

This reference owns user/stakeholder classification, grill axes, row construction, journey-request preparation, record scaling, and local completion for a user-requirements pathfinding destination. `SKILL.md` owns the journey-map predicate and required semantic fields.

Expected inputs: clarified destination and depth, live authoritative participants, candidate evidence, artifact conventions, and the `SKILL.md` User-Requirements Journey Views contract.

Return: grill axes, classified user/stakeholder inventory, draft row-level requirements record, fired journey-map requests with required semantic fields, artifact scale/home, and exact authority/evidence gaps.

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

## Grill the Load-Bearing Axes

For every in-scope class, ask one axis at a time using `question-craft.md`:

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

## Prepare Journey Requests

Apply the `SKILL.md` User-Requirements Journey Views table without restating its predicate or required fields. Return one request per firing and the exact semantic fields the shared renderer must preserve.

Teach the relationship through examples:

- Good: “SDK consumer requests credentials → makes first call → receives an actionable result; pain: authentication failure requires reading source.”
- Bad: “user opens `ExportModal`,” which is an implementation screen tour rather than the user's job.
- Bad: a stakeholder with no direct interaction receives a fabricated journey.

A journey with no observable pain and evidence anchor is decoration. The caller completes the record only after the shared rendering result passes or returns the exact unresolved rendering gap.

## Scale the Record

- quick: return the record in chat unless durable handoff is requested or necessary;
- standard, deep, or substantial handoff: write `docs/specs/<slug>/user-requirements.md`;
- record classes and rows as they crystallize rather than reconstructing them at the end.

A durable record also carries identity/digest, out-of-scope classes, unresolved questions, and `proposed | accepted | superseded` status. `decisions-and-docs.md` owns the general record-home discipline and reader test.

Complete when every in-scope class has row-level needs or an exact unknown, evidence and authority are separate, priorities name an assigner or gap, every journey predicate has a request with its required semantic fields, and the scaled draft record can be completed from the caller's rendering results without inventing meaning.
