# Skills Creation and Spec-Design Workflow Retrospective

Date: 2026-08-02

## Purpose

This is a blameless but accountable retrospective on the work that produced the active `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review` workflow changes merged in PR #37. It uses `skills-creation` as the evaluation lens: trigger, main path, depth, and proof.

This document is evidence intake, not authority to change `skills-creation`. Any follow-up skill edit still requires `skill-audit` placement and a separately authorized, single-skill `skills-creation` run.

## Evidence Reviewed

- The coordination envelope and child contracts under `docs/wip/skills-authoring/2026-07-31-user-focused-requirements-update/`.
- The scope-inflation, requirements-fidelity, human-document, missing-call-path, and artifact-fluff reports under that folder's `sources/` directory.
- The active `skills-creation`, `discuss-pathfinding`, `spec-design`, `program-design`, `spec-program-review`, and `discuss-clarify-mental-models` sources.
- `docs/changelog/2026-07-31-user-requirements-and-design-views.md` and `docs/changelog/2026-08-01-review-feedback-remediation.md`.
- The PR #37 commit sequence and merged `master` state.
- The stored Pathfinding, Spec Design, Program Design, Spec/Program Review, and drift-interrupt pressure scenarios.

The originating application artifacts and full private transcripts are not committed here. Public source reports retain the behavior-level evidence, so the causal sequence is high confidence while some exact edit timing remains unknown.

## Original Goal

Replace the poorly flowing legacy spec swarms with a small workflow that preserves fidelity and makes the human-agent mental model inspectable before planning:

```text
unwritten user intent
  -> Pathfinding confirms requirements and the boundary
  -> Spec Design defines authoritative Why/What
  -> Program Design defines structural How
  -> Spec/Program Review tests both without accepting them
  -> planning starts from the confirmed pair
```

Success meant a human could express what they wanted, see whether the agent understood it, correct the model, and inspect ownership, call paths, state, failure behavior, tradeoffs, and proof without reading internal workflow ceremony.

The legacy skills remained provenance. The change was workflow decomposition and improvement, not deletion of useful prior art and not another swarm.

## Impact

- Design and implementation were delayed while the workflow expanded and was then reduced.
- Requirements, specification, and program-design artifacts accumulated duplicated boundaries, process prose, and unnecessary machinery.
- User attention moved from the product model to digests, status labels, receipts, reviewer counts, and invented infrastructure.
- Reviewers spent effort completing contracts around mechanisms whose existence had not been justified.
- Excess reviewer sessions contributed to a reproduced file-descriptor failure.
- Static validation made the contract look mature while full behavior proof remained absent.
- The user repeatedly had to restore the goal, protect the Why/What versus How boundary, and ask what sections or mechanisms were for.

The main trust cost was making the user manage the workflow when the workflow was supposed to help the agent manage the design.

## Timeline

1. The initial proposal mixed specification, program design, orchestration, review, and process state. The user rejected the collapsed identity and required separate skills with one clear spine.
2. Useful requirements, research, sectioning, and review behavior were recovered from the retired spec creation and review swarms.
3. `skills-creation` review found real trigger, teaching-owner, call-site, and proof gaps. Those fixes helped, but the effort increasingly optimized for satisfying the authoring framework.
4. Customer-eval work expanded from running scenarios on an existing harness into persistence, run identity, retention, certification, and governance.
5. Observability work expanded from three diagram-led documents into a broader telemetry platform before the run/turn/tool and browser/backend models were aligned.
6. Review findings became requirements. Every invented mechanism created more ownership, failure, and proof findings.
7. Simplification then failed in the opposite direction: removing unnecessary How also removed accepted Why/What, narrowing six skill contracts to one while all current documents agreed with the same wrong scope.
8. Human review exposed opaque headings, workflow metadata, duplicated prose, weak progressive disclosure, and diagrams without visible current-to-proposed call-path deltas.
9. The workflow was reduced around boundary checks, requirement preservation, current/proposed call paths, proportional review, deletion-first reduction, reader reconstruction, and Re-anchor checkpoints.
10. PR #37 merged those source and static-proof changes. Full model pressure testing remained deferred.

## Causal Model

```text
product boundary not firmly confirmed
  -> artifact production begins
  -> reviewers inspect proposed machinery as if it is required
  -> candidate concerns become requirements
  -> added mechanisms create more completeness questions
  -> references, schemas, lanes, receipts, and status metadata grow
  -> static checks validate the expanded contract
  -> workflow completeness replaces product understanding
```

The wrong review question was “What contract is missing around this mechanism?” The correct first question was “Which confirmed requirement needs this mechanism, and can it be deleted?”

## What Worked in `skills-creation`

### Trigger

- One named skill per run prevented the final implementation from becoming a vague mega-skill.
- Trigger-only descriptions clarified the routing boundary among unwritten meaning, Why/What, structural How, independent review, and document maintenance.
- Model-invocable versus user-invocable behavior kept discovery separate from workflow procedure.

### Main Path

- Requiring a mental model and visible spine exposed that the early proposal had many sections but no clear human journey.
- The leading-word model produced `Re-anchor`, which retrieves a concrete goal comparison instead of inviting hollow “still on track” agreement.
- The deletion test gave authors and reducers a way to remove words, components, and findings that changed no behavior or reader decision.
- Strong completion criteria rejected empty claims such as “coverage intact,” “reviewed,” or “diagram included.”

### Depth

- The teaching-owner rule separated procedure that changes behavior from schemas that only describe output shape.
- The call grammar made references and subagent lanes name their predicate, work, return, authority, and consumer.
- Progressive disclosure kept the all-run spine visible while moving detailed authority, call-path, rendering, and review mechanics to owned references.

### Proof

- `skills-creation` separates static validation, behavior proof, and shipping status.
- Pressure scenarios captured the relevant rationalizations: “this is obvious,” “the files agree,” “the reviewer found it,” “more completeness is safer,” and “I can verify later.”
- Platform and public-safety validation caught stale metadata and private local paths before merge.

## Where `skills-creation` Amplified the Failure

`skills-creation` did not require the product-level overengineering, but the workflow amplified it when the parent had not confirmed the domain boundary.

### Local skill success displaced the cross-skill user goal

Each run named one skill and one reusable behavior. Without an early coordination envelope, locally coherent improvements could still make the full user workflow worse. The one-skill discipline needed a caller-owned product goal and complexity budget above it.

### Review gates rewarded completion of the proposed shape

Early lane predicates were broad. Failure, security, proof, platform, and navigation reviewers naturally found missing contracts in the machinery they were given. They did not own the question of whether that machinery should exist.

Fresh reviewers and exact snapshots improved independence, but receipt and freshness mechanics normalized a certification mindset. Digests, ledgers, and status metadata then leaked from internal review state into design prose and, in one case, into proposed product infrastructure.

### Shape sometimes preceded teaching

Some proposals specified packet fields, labels, and receipts before teaching how a promised stage should reason. `skills-creation` later closed this with the rule that every promised stage needs a teaching owner and every shape-only reference needs a named consumer.

### Static proof was cheaper than behavior proof

Contract tests could prove that required phrases, routes, labels, and references existed. They could not prove that an agent under pressure would preserve six requirements, reject an attractive governance mechanism, stop after repeated correction, or keep reviewer advice candidate-only.

## Parent-Agent Execution Failures

- Authoring began before the product model and complexity budget were confirmed.
- Repeated corrections were treated as local edits instead of evidence that the mental model had broken.
- Reviewer output was promoted by confidence or repetition instead of reduced against the accepted requirement, observable failure, existing foundation, and smallest correction.
- The parent asked how to complete invented mechanisms before asking whether they should exist.
- A How-only simplification was allowed to rewrite accepted Why/What.
- Diagrams were counted as present without testing whether a human could trace current and proposed behavior.
- Internal workflow state was allowed into human-facing artifacts.
- Reviewer sessions accumulated faster than concrete unresolved risks.

These were judgment failures. Better skill wording adds defenses, but the parent still owns understanding, finding verification, reduction, and the stop when the model breaks.

## Why Reviewers Went Off the Rails

Reviewers had candidate-only authority, but their assignments began after questionable machinery already existed. Their bounded job was to find missing contracts, so adding completeness was locally rational.

The parent failed to apply four questions before accepting findings:

```text
Which confirmed requirement does this serve?
What observable outcome fails without it?
Can the mechanism be deleted instead of completed?
Does the smallest correction remain inside the boundary and complexity budget?
```

Multiple reviewers often inherited the same proposed system boundary. Their agreement repeated one assumption; it did not independently authorize that assumption.

## Why Ceremony Emerged

```text
exact review identity
  -> digest and snapshot records
  -> freshness and invalidation rules
  -> status and acceptance metadata
  -> ledgers and receipts
  -> durable prose explaining workflow state
```

Each step had a plausible local rationale. The failure was letting the chain escape its internal review role. Snapshot identity can answer what a reviewer read; it cannot prove that the artifact still represents accepted intent, and it is not product architecture without a product requirement.

## Why Call Paths and Readability Were Weak

Early Program Design teaching selected call views mainly for cross-owner or asynchronous behavior. Same-owner synchronous changes could therefore omit a visible path. Proposed sequences could also appear without a paired current path, forcing humans to mentally diff prose, tables, and diagrams.

The workflow rewarded component, interface, failure, and proof coverage more strongly than reader reconstruction. It produced formal headings, repeated purpose sections, completion checklists, and ownership recitals with low attention yield.

The corrected standard is not minimum word count. Every element must help a human confirm, correct, decide, trace, simulate failure, verify proof, or find an authoritative home.

## Proof and Its Limits

### Confirmed source and static proof

- PR #37 merged into `master` as merge commit `924b717` with head `25a1c81` included in its ancestry.
- The initial release validation reported 42 deterministic tests passing, TypeScript passing, four skill validators passing, Claude plugin validation passing, manifest/YAML parsing passing, and `git diff --check` passing.
- The remediation validation reported 43 deterministic tests passing, TypeScript passing, Claude plugin validation passing, `git diff --check` passing, and a zero-result public-safety scan over the changed evidence folder.
- Current source contains boundary check 1, accepted-requirements preservation, Re-anchor checks, material current/proposed call-path deltas, proportional review, reader reconstruction, and external authorization for a second focused lane.

### Behavior evidence

- A local post-merge canary for `discuss-clarify-mental-models-drift-interrupt` produced the required Re-anchor comparison, exact mismatch, read-only stop, full reconstruction fields, and no artifact. The run recorded one passing scenario.
- This is one behavior canary for one skill. It is not system-wide proof.

### Remaining proof gaps

- Full model pressure testing was explicitly deferred and remains incomplete.
- The Pathfinding pressure scenario combines an interactive interview with completed-record expectations in one non-interactive run.
- The Pathfinding scenario's proof regex can match words supplied by its own prompt, so it is not currently causally discriminating.
- Stored scope-inflation, requirements-fidelity, call-path, fluff, and reviewer-advice scenarios are proof designs until executed successfully against current source.
- Static review receipts and merged Git history do not prove live workflow behavior.

## Corrections Already Merged in PR #37

- Pathfinding produces a user-requirements record and `goal-boundary model (boundary check 1)` with users/stakeholders, evidence/authority, priorities, existing foundation, missing behavior, non-goals, decisions, and a complexity budget.
- Spec Design owns Why/What, accepted-requirements recovery, traceability, Why/What views, and a Re-anchor before normative derivation.
- Program Design owns structural How, starts from the current system and minimal-change alternative, Re-anchors before target composition, requires applicable current/proposed call-path deltas, and performs boundary check 2.
- Spec/Program Review runs one mode-complete reviewer first, reduces findings before follow-up, uses at most one focused lane by default, and requires external authority for a second focused lane.
- Parent reduction binds an accepted finding to an accepted requirement and observable failure, tests deletion before addition, and returns scope expansion to the owner.
- Requirement preservation reports each stable identity or enumerated group as `covered`, `owner-authorized supersession`, or `gap`; “coverage intact” is insufficient.
- Reader reconstruction, deletion, plain headings, progressive disclosure, and process-metadata exclusion are part of authoring and review.
- Diagram rendering has one shared runtime owner, and unavailable rendering produces an explicit proof gap.
- Exact digest strings were removed from durable design contracts; freshness is semantic and process metadata stays in workflow state.
- The legacy creation and review swarms remain retired provenance.

## Follow-up Work

1. Run bounded live pressure tests for scope inflation, six-to-one requirements loss, current/proposed call paths, reader fluff, reviewer-advice promotion, and repeated correction.
2. Split or repair the Pathfinding pressure scenario so prompt text cannot satisfy assertions and interviewing is distinct from completed artifact production.
3. Add a parent-reduction scenario where several reviewers recommend completing an unnecessary mechanism; passing behavior deletes it or returns an owner decision.
4. Add a preservation scenario where all current artifacts are consistently narrowed; passing behavior recovers the last owner-accepted requirement set.
5. Use `skill-audit` to decide whether `skills-creation` needs a small cross-run goal-relevance gate before review dispatch or whether the caller-owned coordination envelope is sufficient.
6. Keep agent-resource discipline with `manage-agents`; do not add a generic reviewer cap to the design skills.

## Prevention Rules

1. Confirm the goal, existing foundation, actual missing behavior, non-goals, and complexity budget before normative design.
2. Re-anchor before requirements derivation, target architecture composition, and finding acceptance.
3. Admit a mechanism only when it names the accepted requirement, failure without it, insufficiency of the existing foundation, and complexity spent.
4. Treat every reviewer finding as a hypothesis; parent acceptance requires evidence and the smallest in-bound correction.
5. Delete unnecessary How before completing its contracts; never delete accepted Why/What to simplify How.
6. After the same concept is corrected twice, stop patching and rebuild the shared model.
7. Keep requirements, specification, program design, review result, plan, and implementation proof distinct and linked.
8. Keep receipts, acceptance state, and freshness metadata out of durable design prose.
9. For material runtime behavior, show current and proposed call paths, all four edge dispositions, state/effects, and result/error propagation.
10. Use one complete reviewer first and focused review only for a concrete residual risk.
11. Apply the human deletion test without using brevity as the goal.
12. Report static validation, executed behavior proof, and remaining gaps separately.

## Retrospective Verdict

`skills-creation` was necessary to turn an incoherent proposal into four distinct, teachable workflows. Its four-surface model, visible spine, teaching-owner rule, leading words, deletion test, parent reduction, and proof honesty directly improved the final system.

The failure was an interaction: weakly confirmed user boundaries and weak parent reduction met an authoring workflow that made exhaustive reviews, exact snapshots, schemas, and receipts easier to optimize than proportional product understanding. `skills-creation` amplified ceremony; it did not independently cause the product-scope detours. Parent judgment remained the final control and failed repeatedly.

Current disposition: retain `skills-creation`; do not redesign it from this retrospective alone. Treat proportionality, cross-run goal fidelity, and live pressure proof as the remaining investigation.
