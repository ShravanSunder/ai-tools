# Spec Design Workflow Proposal

Status: proposal

Date: 2026-07-28

## Why

### Problem

One design cycle is currently split across two skills, and three failure modes — the first two recorded in `docs/wip/skills-investigation/` — are uncovered:

1. **Fragmented creation.** `spec-creation-swarm` fans design reasoning out to a fixed parallel option-lane topology (minimal-change, clean-boundary, pragmatic). Creation is synthesis: it needs one integrating mind holding all information. Splitting candidate reasoning across lanes leaves the parent reconstructing a coherent design from fragments, and the reconstruction burden is where meaning drifts.

2. **Coherence-only review.** `spec-review-swarm` audits internal coherence, boundary cleanliness, and testability — never decision authority. Recorded failure (Perseus `HC-004`, 2026-07-15/16; see `2026-07-16-spec-creation-swarm-unapproved-requirements.md` for the laundered requirement and `2026-07-16-spec-review-swarm-authority-blind-spot.md` for the review miss): an architecture lane's recommendation was written into the spec as a normative `MUST NOT`, reviewers verified coherence and passed it, and implementation removed a production library the user never chose. Nothing in either skill asks: who decided this?

3. **Open loop.** Review lives in a separate, optional-looking skill with its own packet model and vocabulary. Findings can be reduced without the artifact owner remediating them, and remediated surfaces are not reliably re-reviewed. The design cycle never provably closes.

### Desired outcome

One `spec-design` workflow that carries a design from framing to an accepted specification/program-design pair. It hard-replaces `spec-creation-swarm` and removes `spec-review-swarm` as a separate phase.

The governing frame:

```text
Why + What = Specification
How        = Program Design

one parent, all information, one integrating mental model
  -> pair drafted (sections may be delegated as bounded text work)
  -> independent fresh-context review: traceability + authority
  -> parent reduction of candidate findings
  -> parent remediation of upheld findings
  -> refreshed review of affected scopes
  -> repeat until every upheld finding is verified-closed
  -> acceptance gate
  -> plan creation
```

Two principles shape everything below:

- **Creation needs one integrating mind; verification needs independent minds — at least one always, more only where an observable risk predicate holds.** Fan-out that produces artifact text or judgment exists in exactly two places, for exactly one concern each: bounded section-writing inside drafting (text production, never decisions) and reviewer dispatch inside review (skepticism, never authorship). Bounded evidence lookup — one named observable question per dispatch, producing neither artifact text nor findings — is the only other delegation. Everything else is a single thread through the parent.
- **The workflow is first-class.** It is defined as a state chart: named states, transitions, and guards. Every guard is an observable predicate readable from the artifacts and the mandatory review ledger, so a fresh agent can recover the current state from disk. Subagents are called only inside states that declare dispatch rights.
- **The skill teaches the craft; the state chart only keeps it honest.** Every stage the workflow promises — drafting the specification, drafting the program design, and each review lane — has an owning reference that carries its judgment: what good output looks like, which questions to ask, what to inspect, and the calibration bar. Depth coverage is a named implementation gate, not an assumption: a first implementation of this contract shipped state machinery with no craft, and five consistency-focused review rounds missed it.

### Goals

- Establish `spec-design` as the single pre-plan workflow for specification and program design.
- Produce a specification document that owns Why and What, and a sibling program-design document that owns How.
- Keep creation, review, reduction, remediation, and acceptance inside one invocation as one closed cycle.
- Make decision authority a first-class, checkable dimension in both artifacts: every normative obligation and material structural decision declares its basis, and review audits that basis against named sources.
- Make the parent the sole author and reducer: it holds all information, authors and integrates both artifacts, and reduces findings. Product decisions and every `user-decision` basis remain the user's authority.
- Give reviewers fresh context, read-only access, and curated packets; treat every reviewer result as candidate evidence until the parent validates it.
- Scale review to observable risk, with exactly one mandatory whole-pair reviewer.
- Route only an accepted pair to plan creation.

### Non-goals

- Creating an implementation plan, or editing code, configuration, manifests, or infrastructure.
- Redesigning adjacent skills. Their triggers and bodies keep shipped wording, with exactly three body exceptions named in Changes: `spec-handoff` gains the accepted-pair record and a boundary-statement update, `manage-agents` gains one generic packet field plus a reviewer capability note, and plan creation's entry contract cuts over to the accepted-pair gate — plus two mandatory reciprocal frontmatter boundary lines on `docs-maintain` and `ops-security-review`, named in Changes. Otherwise only dangling references to the two retired skills cut over.
- The mandatory named-skill routing path. Recreating `skills-creation` around this workflow is follow-up work that consumes `spec-design`; its routing contract belongs to that follow-up spec.
- Portable cryptographic acceptance receipts. Handoff freshness is carried by statuses, the shared content revision, and plain file digests in `spec-handoff` — nothing more.
- The skill-testing harness redesign. The skill's own pressure scenarios are not deferred: replacements for the six named behavior claims ship inside the hard cutover (see Changes), and static validation and review are never pressure proof.
- Recording review chronology, agent identities, or conversation history as design rationale.

## What

### One workflow, one closed cycle

`spec-design` owns the complete pre-plan design cycle. Review is not a later skill recommendation and remediation is not an owner-facing handoff that ends the run; both are inner loops of the same invocation.

The invocation completes only when the parent accepts the pair, the user explicitly stops or defers, or a material decision or evidence gap blocks further design.

Trigger description for the future skill:

```text
Use when turning bare requirements or product intent into a spec,
design doc, or architecture doc before an implementation plan exists,
or when writing, revising, reviewing, resuming, or accepting one —
critique, attack, poke holes, pressure-test assumptions, threat-model
the design in-cycle, remediate findings. Not for one named skill's
create/update/evaluate work; reviewing an implementation plan or
handoff; shared-model reconvergence; documentation-only
reconciliation, cleanup, archival, or promotion that changes no
requirement or design decision; evidence-only research; handoff
packaging; or standalone security scans, audits, repository threat
models, and security-finding remediation.
```

### Two sibling artifacts

Substantial design work produces:

```text
docs/specs/<yyyy-mm-dd-slug>/
├── <yyyy-mm-dd-slug>.md                    # specification: Why + What
└── <yyyy-mm-dd-slug>-program-design.md     # program design: How
```

Neither is an appendix to the other. The specification is authoritative for Why and What; the program design is authoritative for How; the specification constrains the program design; the program design traces every structural decision to the specification; both are accepted together or not at all.

```text
┌─ specification ──────────┐   ┌─ program design ─────────┐
│ WHY + WHAT               │   │ HOW                      │
│                          │   │                          │
│ problem, outcomes        │   │ modules, boundaries,     │
│ requirements  REQ-*      │   │ dependency direction     │
│   normative ⇒ basis      │◄──┤ every REQ-* answered:    │
│ claims       CLAIM-*     │ traces to  owner, flow,      │
│ invariants   INV-*       │   │  failure, proof seam     │
│ non-goals, constraints   │   │ material INV-* ⇒ basis   │
└──────────────────────────┘   └──────────────────────────┘
         constrains ──────────────────────────►
         Status, Content revision, Review cycle identical
         in both: the pair moves together or not at all
```

Shared lifecycle header, identical in both files:

- `Status: draft | accepted | blocked | deferred` — always synchronized.
- `Content revision: r<N>` — a monotonic integer shared by both siblings. A semantic change to a requirement, claim, invariant, basis, boundary, flow, failure policy, or rationale increments it in both files; a typo- or format-only change with no semantic meaning change does not. A synchronized status write never changes it. A newly created or reconstructed pair starts at `r1`; a lone artifact's prior revision belongs to no pair lifecycle and is void.
- `Review cycle: none | c<M> in-cycle @ r<N> | c<M> covered @ r<N>` — written by the parent on REVIEW entry, before the first dispatch (`in-cycle`), and when the REVIEW guard passes (`covered`). REVIEW entry is the single owner of cycle-id assignment; `<M>` is a monotonic counter, guards that say "this cycle" resolve against it, and after a terminal re-entry the prior value stands as history until the next REVIEW entry.
- `Stop reason: <text>` — present, with the same text in both files, only while status is `blocked` or `deferred`; names the smallest material decision or missing source and the exact resume inputs.

**Synchronized-write field set.** A synchronized status write changes exactly: both `Status` fields, the `Review cycle` field when the parent records cycle state, and the presence or text of `Stop reason:`. `Content revision` and all design content are unchanged. The parent verifies every synchronized write — accepting, non-accepting, and resume alike — against this field set. Every other section cites this rule rather than restating it.

Lifecycle rules:

- The pair lifecycle begins only after both siblings exist. From zero or one artifact, the parent creates or reconstructs the missing sibling and initializes both as synchronized `draft` at `r1` per the header rule. A lone artifact's prior status, revision, or receipts never establish pair acceptance or review coverage.
- After the pair exists, design content is mutable only while both statuses are `draft`.
- If framing or reconstruction blocks while zero or one artifact exists, the run stops with a pre-pair receipt (shape owned by the review-cycle schema, below) and claims no plan readiness. It never fabricates an empty sibling.
- The process ledger is mandatory from the moment the pair lifecycle begins — not from first review dispatch. It lives at a deterministic repo-local path (`tmp/spec-design/<slug>/ledger.md`) and collects, keyed by revision and cycle: the revision-bound drafting-check records (requirement-quality status, integration status, open-decision and assumption identifiers with dispositions, evidence anchors, remaining failures) and, once review begins, the reduction and remediation records. A missing ledger means neither DRAFTING passage nor review coverage can be shown, and the parent reruns the missing pass or starts a fresh cycle. Research ledgers, packets, and scratch remain optional process evidence and are never promoted into the design artifacts.

### Decision authority

This section exists because of the recorded failure: an author recommendation laundered into a normative requirement passes every coherence check. Authority is therefore a declared, reviewable dimension — in both artifacts, because structural decisions can foreclose product choices just as requirements can.

Material semantic statements carry stable inline identifiers, unique across the pair (the same identifier never appears in both siblings):

```text
REQ-001: <testable obligation>            # specification only
CLAIM-001: <load-bearing current-state, product, or design claim>
INV-001: <material behavioral, structural, state, or security invariant>
```

Every `REQ-*` — regardless of modal wording — plus every material `INV-*` and every traceability entry's structural realization declares its basis. A requirement is an obligation whether it says `MUST`, `support X`, `required`, or appears as an acceptance criterion; wording never exempts it from the basis discipline:

```text
REQ-001: <obligation>
  basis: code-constraint | user-decision | author-recommendation | unresolved
  source: <code path, doc, or public-safe paraphrase of the user's decision>
```

- `code-constraint` — compelled by current code, platform, or verified external fact; `source` names it.
- `user-decision` — explicitly selected by the user; `source` paraphrases the decision (never a transcript dump).
- `author-recommendation` — the author's derived preference. Non-accepting for any requirement or normative-force statement: the gate converts it into a decision returned to the user.
- `unresolved` — a known open branch. Non-accepting for the obligation that declares it.

```text
basis: code-constraint ─────┐
       user-decision   ─────┴──► accepting at the gate
                                 (source anchor required)

       author-recommendation ─┐
       unresolved ────────────┴► a normative obligation cannot
                                 be accepted: the gate converts
                                 it to decision-needed and returns
                                 the smallest decision to the user
```

**Normative force** means stating or foreclosing an obligation — semantically, not by keyword. `MUST`/`MUST NOT` is the canonical form, not the trigger: `support X`, `required`, an acceptance criterion, and a binding non-goal carry the same force, and none of them escapes the basis or confirmation gates by avoiding the word. Obligations live only in `REQ-*`: an `INV-*` or `CLAIM-*` stating one is a defect the whole-pair reviewer flags. A structural decision that eliminates, replaces, or forecloses an existing production dependency, module, or user-visible mechanism carries normative force and requires an accepting basis or an entry in `Open Design Decisions`.

**Material** means load-bearing for acceptance: every requirement is material; a finding is material when its severity is `blocker` or `important`; a decision or tradeoff is material when it changes a requirement, a public contract, an ownership boundary, or a normative basis. Other sections cite these definitions rather than restating them.

Authority-bearing statements are not only requirements. Material non-goals, constraints, and externally meaningful commitments in the specification carry identifiers (`CLAIM-*` or `INV-*`) and, where they bind design choices, a basis. A program design that contradicts a user-owned non-goal or constraint is non-accepting regardless of wording force — the recorded failure's second branch was exactly a non-goal overridden without authority.

The whole-pair reviewer audits every declared basis in both artifacts against its named source — the basis field is what carries provenance to reviewers who never saw the conversation. A `user-decision` basis is auditable only by the user: a fresh reviewer can check that the paraphrase exists, not that the decision happened. The acceptance gate therefore surfaces every load-bearing `user-decision` basis — across requirements, material non-goals and constraints, material invariants, and normative-force structural realizations — (identifier plus source paraphrase) to the user for confirmation before the accepting status write.

### Specification ownership: Why and What

The specification defines the externally meaningful contract: the problem and consumers; outcomes and success criteria; goals, scope, non-goals; functional and non-functional requirements (normative ones with basis); user-, API-, protocol-, or operator-visible behavior; constraints; edge cases and observable failure expectations; security, privacy, and operational obligations; acceptance criteria and open product decisions.

Requirements are testable obligations, not tasks. A requirement may constrain a public interface, but it does not assign internal module ownership or prescribe task sequence.

#### How to write the specification

**Facts are looked up; decisions are asked.** If a fact is discoverable from the filesystem, code, or docs, look it up — never spend a user question on it. Decisions are the user's: put each one to them, one question per message, with your recommended answer and confidence attached (a wrong guess gets a faster reaction than a blank question), and wait. Batching questions locks in the wrong framing because the third question usually depends on the first answer.

**Decompose before refining.** If the request spans independent subsystems, split it first and spec the first slice — don't spend questions polishing details of a thing that needs decomposition. "Too simple to need a design" is a named trap: simple projects are where unexamined assumptions waste the most work.

Work in this order — each section derivable from the ones before it: problem → consumers → outcomes → success criteria → requirements → non-goals → constraints and edge cases → acceptance criteria → open decisions. A requirement that traces to no outcome is invented; an outcome with no requirement is unserved.

**Requirement syntax (EARS).** One capability per `REQ-*` (split conjunctions — you cannot pass/fail a compound). Choose the shape by condition class, clauses in temporal order:

```text
always active     The <system> <response>.
state-driven      While <state>, the <system> <response>.
event-driven      When <trigger>, the <system> <response>.
optional feature  Where <feature present>, the <system> <response>.
unwanted behavior If <fault/trigger>, then the <system> <response>.
complex           While <state>, when <trigger>, the <system> <response>.
```

Error and failure behavior always uses `If/then` — writing a fault with `When` recasts it as a normal trigger and hides that the system is in a bad state.

```text
bad   REQ-004: The importer MUST handle large files robustly.
      (two vague verbs, no observable behavior, no threshold)

good  REQ-004: When a CSV up to 2 GB is imported, the importer
      completes within 512 MB RSS, reporting progress every 5 s.
        basis: user-decision
        source: user chose a 2 GB ceiling over a streaming redesign
      REQ-005: If the CSV exceeds 2 GB, the importer rejects it
      before reading rows, naming the limit in the error.
```

**The stranger test.** A requirement passes when someone who has never met you could build exactly what you meant and prove they did. If they'd have to ask a question, it fails — repair it now.

**Vague-verb repair.** Each of these triggers *what would an observer see?* and is unfinished until the answer is in the text: `support` (which operations, what result?), `handle` (what happens, observably?), `robust` (under which failure, degraded how far?), `easy` (which task, how many steps, for whom?), `fast` (which operation, what threshold, at what load?), `secure` (against which actor doing what?).

**Requirement vs task.** "MUST store sessions in Postgres" is a task wearing requirement clothes. State the obligation — "sessions survive process restart; two concurrent writers never corrupt a session" — and let the program design choose Postgres, with a basis. Test: if a different implementation could satisfy the user, the technology name doesn't belong in the requirement.

**Never silently fill ambiguity.** An unresolved branch gets `basis: unresolved` and an `Open Product Decisions` entry — an explicit marker, never a plausible guess. State assumptions as a block the user can strike ("correct me now or I proceed with these").

**Non-goal craft.** A good non-goal names and blocks the *nearest plausible expansion*, not a strawman — a reasonable possibility explicitly declined. Bad: "no unnecessary features." Good: "No multi-tenant isolation: single-workspace deployment is assumed; adding it is a new spec." Half of misalignment is silent disagreement about what is *not* being built.

**External contracts.** For each load-bearing surface fill: owner / consumers / inputs (including invalid and untrusted) / outputs (including errors and side effects) / state read, written, cached, or explicitly untouched / invariant / forbidden edge / one valid and one boundary-invalid example. A field you can't fill is a finding — never "the implementation can decide" unless the spec explicitly delegates that freedom and names the acceptable range.

**Edge cases as failure expectations.** For each main flow, state observable behavior at its boundaries — empty input, duplicate, timeout, partial write, concurrent caller: "a duplicate submission returns the original result and creates nothing."

**User decisions.** One material question at a time, in this shape — and know what does *not* count as agreement: "whatever you think is best" is delegation (re-ask as two concrete options); "sounds good" is ambiguous; silence then "okay let's start" is the user giving up on the interview, not converging.

```text
Decision needed: <one sentence>
My current read: <recommended answer and confidence>
Why it matters:  <what changes if the answer differs>
Question:        <single question>
```

**Tradeoffs.** What we gain, what we pay, who pays — one line each. A tradeoff without a payer hasn't been thought through.

**Self-review before review.** Four fresh-eyes passes, fixed inline: placeholders (TBD/TODO/vague), internal contradiction between sections, scope (one design or a decomposition?), and ambiguity — could any requirement be read two ways? Pick one and make it explicit.

Sources: EARS (alistairmavin.com/ears), INCOSE GtWR/29148 singular-verifiable rules, RFC 2119 §6 (normative words sparingly), mattpocock `grilling`, addyosmani `interview-me`/`spec-driven-development`, superpowers `brainstorming`, this repo's `contract-and-scope` lane.

### Program-design ownership: How

The program design defines the internal structural contract that satisfies the specification: responsibility and module boundaries; internal abstractions, types, interfaces, dependency direction; state ownership and sources of truth; data flow, control flow, lifecycle; concurrency, consistency, ordering; failure handling, retry, cleanup, partial success; security and trust-boundary enforcement; runtime and platform integration; observability and performance structure; test and proof seams the plan must operationalize; alternatives and rejected options; requirement-to-design traceability.

The `Design Overview` is the integrated system model: one end-to-end account of ownership, dependency direction, state, lifecycle, flow, and failure propagation that every later section and every traceability row must agree with. Detailed sections attach to that model; a complete set of headings and per-requirement rows is an inventory, not a design, until they compose without contradiction.

Pseudocode, type signatures, and flow diagrams are welcome when they make the contract precise. Worker assignment, file-by-file tasks, command sequences, and execution DAGs are not — they belong to the plan.

#### How to write the program design

**Three layers, each following from the last.** Problem and requirements (the specification) → functional behavior as seen from outside → internal structure. Each layer is a branch point with many valid successors; designing *is* choosing among them, and the document's job is to record the choices and their trade-offs. If there were genuinely no trade-offs, you didn't need a design — a design doc that reads as an implementation manual ("this is how we will build it") with no alternatives is the canonical bad one.

**Design Overview first, one page, before any detail section.** It contains: every module with its single reason to change; dependency arrows in one direction only; a state-ownership table (each piece of state → exactly one owner with mutation authority); the main flow traced end to end; the failure path of the riskiest step traced to its containment. If you can't draw this in a page, the design isn't integrated yet — sections written before the overview are inventory.

**Ground before sketching.** Build a traced model of every system the new design touches; naming a file is not grounding. If the design redefines existing ownership or layering, recover the *rationale* of the current shape first, so the rationale becomes a constraint instead of a casualty.

**Design it twice.** For each load-bearing structural choice, sketch at least two shapes under different forcing constraints — minimize the interface; optimize for the most common caller; maximize flexibility — then choose and record why the winner beats the others (gain / pay / who pays). "No alternative existed" is a claim that needs a basis. Be opinionated: a strong recommendation, not a menu.

**Depth is leverage.** A module is deep when callers get a lot of behavior per unit of interface they must learn — and "interface" means everything a caller must know: signature, invariants, ordering constraints, error modes, required configuration, performance character. The deletion test: imagine deleting the module — if complexity vanishes it was a pass-through; if it reappears across N callers it was earning its keep.

**Interrogate the nouns.** For every noun the pair names — state store, service, protocol, queue, agent, UI surface, external system — answer: who owns it? what is its source of truth? who may read it, who may write it? what interface must callers use? which edge is explicitly forbidden? what proof would reveal an illegal edge? Then compare each answer to current code: a mismatch is either a spec correction or a constraint that must be made explicit. Boundary smells: a "shared helper" with no owner and no allowed-caller list; two places that can mutate the same state without an arbitration contract; a lower layer that knows product workflow.

**Write the caller's usage first**, then derive the type sketch from it. The interface is the test surface: callers and tests cross the same seam, and if you want to test *past* the interface, the module is probably the wrong shape. Don't introduce a seam until something actually varies across it — one adapter is a hypothetical seam, two adapters is a real one.

**Assumptions and probes.** Name the hidden assumptions ("the queue delivers in order"), then construct 2–3 falsifying probes: pick an assumption, invent the cheapest concrete scenario that breaks it, and state what the design does then. "Nothing" is a missing requirement or a missing failure-handling entry. Risk is design input, never a verdict: each accepted risk lands as a requirement, non-goal, open decision, or proof seam.

**Failure discipline.** For every cross-boundary call: what happens when it fails halfway? who cleans up? can the step retry or roll back? where is partial success visible? Dependency category picks the proof strategy: in-process (test directly), locally substitutable (real stand-in in the suite), remote-but-owned (port + injected transport), true-external (injected port, mock adapter).

**State the degree of constraint** (greenfield vs boxed in by legacy — reviewers can't calibrate without it), a *What changes / What stays the same* pair (the second is cheap and kills a whole class of reviewer doubt), and where accepted debt lands (non-goal or open decision, with the signal that forces revisiting). Ban task-oriented file inventories and incidental implementation paths — they go stale and smuggle plan content — but evidentiary anchors required by a `basis`, `source`, or traceability realization are always allowed, and a snippet may appear where it encodes a decision more precisely than prose can (state machine, schema, type shape).

Sources: Google design-doc practice (industrialempathy.com), the three-layer construction order, Nygard ADRs, mattpocock `codebase-design`/`DESIGN-IT-TWICE`/`DEEPENING`, pstack `architect`, this repo's `architecture-boundaries` and `risk-and-tradeoff-design` lanes.

### Boundary invariants

```text
Program design may only make an authoritative requirement's structural
realization concrete. It may not invent a requirement.

Any clarification that changes requirement meaning is written into the
specification first; program design resumes from the revised meaning.

Planning may translate accepted design into executable work.
Planning may not invent missing program design.

Implementation may not silently change either artifact.
```

If program design reveals a missing or contradictory requirement, the workflow routes back to the specification. If review reveals that a structural choice needs a product decision, it routes to the specification and, when material, to the user. If plan creation discovers an unowned responsibility, interface, state transition, or failure policy, it routes back to `spec-design`.

### The review cycle

```text
DISPATCH ──────────► REDUCE ─[all verified-closed]─► GATE
whole-pair            parent verifies each     │
reviewer:             finding: upheld │        │ open
traceability          dismissed │ contested │  │ upheld
+ AUTHORITY           unverified               ▼
+ coherence                ▲               REMEDIATE
+ focused                  │               parent applies upheld
reviewers by               │               findings; a semantic edit
observable risk            │               bumps rN ──► rN+1
(parallel, fresh,          │                   │
read-only)                 └─ REFRESH ◄────────┘
                              (only when receipts
                               were invalidated)
```

**Reviewer selection.** Every pair receives exactly one mandatory whole-pair integrity reviewer that reads both artifacts and checks three things: Why → What → How traceability; decision authority in both artifacts — every declared basis audited against its named source, every normative obligation and normative-force structural decision challenged for who decided it; and whether the pair composes into one implementable end-to-end design at the current revision — flagging cross-requirement contradictions in state ownership, dependency direction, lifecycle, and failure propagation, not just section completeness. Additional focused reviewers are dispatched only when an observable predicate holds:

- security-sensitive surface → security/threat-boundary review;
- public API, protocol, storage, migration, or compatibility contract → contract review;
- cross-runtime or cross-harness behavior → platform-fit review;
- an existing implementation may hide behavior absent from the artifacts → difference review;
- unusually high operational, concurrency, performance, or data-integrity risk → focused failure-mode review.

There is no fixed multi-lane topology. Small artifacts use the whole-pair review alone.

Every dispatched reviewer first loads `references/reviewing-pair.md` — the sole owner of the common review method below — and returns its common review result, then loads its lane mission file from `references/lanes/` and applies the lane-specific judgment. The packet carries the dispatch focus and scope; the references carry the judgment. A reviewer dispatched without both loads is a defect, not a lighter-weight review.

#### How to review the pair

**Read everything before judging anything.** Count the lines, read every chunk, and comment on nothing until the full pair is read — premature comments are usually answered two sections later. Then review in dependency order and stop at the first fatal flaw: problem → requirements → external behavior → structure. If the problem is misunderstood, the requirements are suspect; if a requirement fails, its structural realization is moot. Section-local review that green-lights an elegant solution to the wrong problem is the named failure this order prevents.

**Trace, don't skim.** Walk every material `REQ-*` end to end: requirement → basis and source → traceability row → owning design sections → proof seam. The artifact is claims to verify, not truth; author confidence and previous praise are not evidence.

**Audit authority.** For each basis, demand the pointer: `code-constraint` — open the file, does it actually compel this? `user-decision` — does the paraphrase state a real decision (who chose what over what), or does it read like a recommendation in decision clothing? Run the four-source drill: every review must be able to sort code-compelled / user-chosen / mislabeled recommendation / contradicts-a-non-goal. If two are indistinguishable from the artifacts, that is itself a finding. Label provenance so product arguments go to the decision owner instead of being re-litigated among reviewers.

**Invert the cruxes.** Trace each major design claim to the condition that must be true for it to work, then invert it: if the inverted condition would force a different owner, contract, data shape, or human decision, that's a crux — name it. The sharpest probe: *which contradiction would cause two implementers to build different things while both believing they followed the spec?*

**Check integration, not sections.** Pick pairs of requirements that share state or flow; verify their traceability rows land on consistent owners. Trace one failure path against the declared dependency direction. After the full read, state the design in three sentences — if you can't, or your three sentences contradict a section, file it.

**The planning-readiness line.** Pretend you are creating the plan, but do not create it. If the planner would have to choose product meaning, boundary ownership, contract semantics, or proof expectations — not ready. If the planner only needs to choose task order, write scopes, and exact commands — that belongs to planning, and it's fine.

**Finding quality.** Severity by behavior effect: would a planner build the wrong thing (blocker), guess (important), or merely stumble (minor)? Every substantive finding carries a concrete failure path, *what the next agent would guess*, and the smallest correction — never bare "add more detail." One strong finding beats several weak ones. Flag only what would cause a real problem downstream: wording preferences and "this section is less detailed" are not findings; silence is a valid verdict, and noise is a real cost.

**Reviewer hygiene (parent's side).** Hand reviewers the artifact and the contract — never your conclusion; handing over a conclusion buys agreement. Reviewer output is data, not verdict: verify evidence before disposition, publish dismissals with one-line rationales so the user can override, and never convert missing evidence into dismissal. Agreement across independent reviewers is signal; a lone finding is worth reading at lower confidence. The doubt-theater check: two or more cycles where reviewers raised substantive findings and zero were upheld means you are validating, not reviewing — stop and escalate. Where a predecessor exists, require a definite improvement; a first design instead satisfies every acceptance criterion against current evidence and constraints. Perfection is not a criterion, and taste is not a finding; unresolved fact disputes go to evidence, unresolved value disputes go to the user.

Sources: dependency-order review (design-review practice), Google eng-practices review standard, pstack `interrogate`/`why`, addyosmani `doubt-driven-development`/`code-review-and-quality`, mattpocock `code-review` two-axis split, this repo's `adversarial-crux`, `whole-spec-coverage`, `planning-readiness`, and `finding-schema` lanes.

**Packets and receipts.** Every reviewer receives both complete artifacts plus a curated packet. The packet is a composition over the `manage-agents` agent job packet: the generic dispatch fields come from that contract, and this workflow adds the exact pair content revision and cycle id, the declared `REQ-* | CLAIM-* | INV-*` identifiers and section/path scopes in focus, decision target, user constraints, source anchors, non-goals, security context, and the schema contract. Reviewers independently inspect named sources rather than trusting author confidence. A curated packet is review context; the authoring transcript is not.

Every responding reviewer returns a revision- and cycle-bound receipt with status `complete | partial | blocked` (receipt-sense `blocked`: the lane could not begin for a named missing input — the house lane-schema vocabulary; pair-status `blocked` is a different field and the header keeps them apart). Silence is recorded by the parent as `no-receipt`; a reviewer never returns that state. Which receipts credit coverage is owned by Scope and invalidation below.

Finding severity is `blocker | important | minor | observation` — graded by behavior effect. `observation` has no acceptance effect and the parent may prune it.

**Parent reduction.** The parent opens the claimed evidence for every candidate finding and classifies its disposition:

- `upheld` — supported, in scope, requires a correction;
- `dismissed` — unsupported, already satisfied, or out of scope;
- `contested` — a real tradeoff or product decision evidence alone cannot settle; it exits only through the gate's `decision-needed` outcome;
- `unverified` — potentially valid, missing the evidence needed to judge; it exits through an evidence Delegate or a re-dispatch, then re-enters reduction. Missing evidence is never converted to `dismissed`.

Every upheld finding tracks a resolution: `open` → `remediated` (the parent applies the correction and records the traceability effect) → `verified-closed`. The parent verifies each correction in REDUCE and closes it immediately when the remediation invalidated no receipt, otherwise after the required refreshed receipt is reduced. A failed correction returns to `open`. Within this workflow, `open` is only an upheld-finding resolution and `deferred` is only a pair status; `blocked` carries exactly two senses — receipt (lane could not begin) and pair status — and every use is sense-qualified. Adjacent skills' vocabularies are untouched.

Reviewer count and apparent consensus never determine acceptance; evidence and parent-verified reduction do.

**Scope and invalidation.** This subsection is the single authority for receipt validity and coverage; every other section cites it.

- Only `complete` receipts from the current cycle (or parent-verified carry-forwards, below) credit coverage. A `partial` receipt credits none of its declared scopes; the parent re-dispatches the lane or narrows the packet. Narrowing partitions the original predicate-required scope: complete successor receipts must cover its union, or the uncovered remainder keeps the pair non-accepting.
- Every receipt declares the identifiers and section/path scopes it inspected. Opening a file does not expand a declared scope.
- A synchronized status write does not invalidate a content receipt.
- A typo- or format-only change with no semantic meaning change does not invalidate receipts whose scope it touches.
- A semantic change inside a receipt's declared scope invalidates that receipt. Renaming or removing an identifier invalidates every receipt naming it. This declared-scope rule governs focused receipts.
- The whole-pair receipt's declared scope is the identifier and basis inventory, cross-artifact traceability, and the main-flow sections of both artifacts (main-flow = the specification's `Observable Behavior` and the program design's `Data Flow and Control Flow`); the category rule below — not the per-edit rule above — is what invalidates it.
- A requirement, basis, material claim or invariant, public contract, ownership boundary, source-of-truth, or main-flow change invalidates the whole-pair review plus affected focused reviews. A security or trust-boundary change additionally invalidates the security review.
- When a revision leaves a complete receipt's declared scopes semantically unchanged, the parent may carry it forward; doing so requires a carry-forward attestation (prior receipt, both revisions, unchanged scopes, non-invalidation evidence, parent verification). An affected receipt is never carried forward — it is freshly dispatched.
- Terminal re-entry: resuming an `accepted`, `blocked`, or `deferred` pair invalidates the prior acceptance; the next REVIEW entry — the single owner of cycle-id assignment — opens `c<M+1>`, and that cycle requires a fresh whole-pair review, because the world outside the pair can drift while the artifact bytes do not. Focused reviews are refreshed where their risk predicate still holds; other prior receipts remain historical evidence and may be carried forward under the rule above.

**Reference tree and teaching contract.** The implemented skill ships this tree; craft and ceremony are segregated, and the ceremony gets exactly one home:

```text
skills/spec-design/
├── SKILL.md                       mental model, state chart, gates —
│                                  slim; every stage points below
└── references/
    ├── drafting-specification.md  Why/What craft: user-decision
    │                              questions, requirement quality and
    │                              testability, non-goals, tradeoffs
    ├── drafting-program-design.md How craft: the integrated system
    │                              model, boundaries and ownership,
    │                              alternatives, failure containment,
    │                              reversibility, proof seams
    ├── reviewing-pair.md          common pair-review craft: dependency-
    │                              order reading, end-to-end trace,
    │                              authority audit, crux inversion,
    │                              integration, planning readiness,
    │                              finding quality — every reviewer
    │                              loads it before its lane mission
    ├── artifact-formats.md        lifecycle header, both skeletons,
    │                              traceability entry
    ├── review-cycle-schema.md     process shapes + per-role dispatch
    │                              contract (parent-only ceremony)
    └── lanes/
        ├── whole-pair-integrity.md      mandatory reviewer mission
        ├── security-threat-boundary.md
        ├── contract-review.md
        ├── platform-fit.md
        ├── difference-review.md
        └── failure-mode.md
```

Ownership: `references/review-cycle-schema.md` owns the process shapes — the review packet (as the composition over the agent job packet named above), receipt, finding, reduction record, remediation record, carry-forward attestation, pre-pair receipt — the drafting-check record, and the per-role dispatch contract: predicate, packet composition, lane reference (`reviewing-pair.md` plus a lane mission for reviewers; the applicable drafting reference for section writers; the question packet with named sources for evidence contributors), prerequisites and parallel-safety basis, maximum and instance authority, terminal receipt, stop condition, and parent reduction point — for reviewer, section-writer, and evidence dispatches. The lifecycle header and traceability entry are owned by the Formats section. `SKILL.md` cites the schema, keeps only operational gates, and may name label values inside gates — but never redefines a shape. Alignment with `skills-creation`'s review lane schema is decided in the skills-creation follow-up, not here.

**Teaching contracts.** The three `How to` sections of this spec are the authoritative craft content with an exact lift mapping: *How to write the specification* → `drafting-specification.md`; *How to write the program design* → `drafting-program-design.md`; *How to review the pair* → `reviewing-pair.md`. Implementation lifts them verbatim and completes the anatomy below — it does not re-derive the craft. Each reference opens with one line stating what the agent can do after loading it that it could not before. The two drafting references carry authoring anatomy (capability, inputs, construction questions, decision boundaries, result, good and bad examples, calibration, completion); `reviewing-pair.md` and the lane missions carry review anatomy (mission, where to look, how to inspect, good and bad signals, overlap boundary, calibration bar, stop condition). A reference containing headings, topics, or schemas but not its contracted judgment is non-complete — file presence never satisfies these contracts:

```text
drafting-specification.md
  capability: turn fuzzy intent into testable Why/What
  teaches: the user-decision question shape (decision needed / my
    current read / why it matters / one question); requirement
    quality — a testable obligation, not a task or a wish, with
    vague-verb repair (support, robust, easy, handle → observable
    behavior + measurable condition); non-goal craft that blocks
    plausible adjacent expansion; edge cases as observable failure
    expectations; tradeoffs stated with who pays
  result the guard consumes: a requirement-quality pass (every
    REQ-* testable, no vague verb unrepaired) and the open-decision
    list (each entry in Open Product Decisions or a user question)
  calibration: raise only gaps that change requirements, non-goals,
    boundaries, or proof

drafting-program-design.md
  capability: compose one implementable end-to-end How
  teaches: build the Design Overview as the integrated system model
    FIRST and attach every section to it; ownership and dependency-
    direction decisions with named alternatives and rejection
    reasons; hidden-assumption naming plus 2-3 falsifying scenario
    probes; failure containment and reversibility; proof seams the
    plan can operationalize
  result the guard consumes: an integration pass (no cross-
    requirement contradiction in state ownership, dependency
    direction, lifecycle, or failure propagation) and the
    assumption list (each named, tested, or routed to evidence/user)
  calibration: risk is design input — each accepted risk becomes a
    requirement, non-goal, open decision, or proof seam, never a
    bare verdict

lanes/whole-pair-integrity.md   (mission stated in Reviewer selection)
  inspects: every identifier and basis against its named source;
    every traceability row against the Design Overview; the pair
    read end-to-end as one design
  independently repeats: BOTH drafting-quality passes — requirement
    quality and integration — never trusting the author's ledger
    self-check; for a small pair this lane is the only reviewer,
    so these repeats are its floor
  good: findings cite both artifacts and name what the next agent
    would guess; bad: section-local nitpicks, style notes,
    re-litigated user decisions
  overlap: domain depth routes to the focused lanes; this lane owns
    cross-artifact truth
  stop: every material identifier traced, both passes repeated, and
    the three-sentence design restatement written
  finding result: violated obligation or contradiction, both
    artifact locations, smallest correction

lanes/security-threat-boundary.md
  mission: design-time threats and trust-boundary violations
  inspects: each predicate surface the conditional-review rule
    names; entry points, privilege transitions, data crossing trust
    boundaries; mitigations present as requirements or invariants,
    never prose reassurance
  good: a threat names actor, entry, asset, and the invariant that
    stops it; bad: "consider adding auth", mitigation as prose,
    findings outside the declared trust boundaries
  overlap: standalone scans and audits are ops-security-review's;
    contract-shape questions route to contract-review
  stop: every true predicate surface carries a threat statement or
    an explicit none-found naming the entry points inspected
  finding result: threat, violated or missing invariant, required
    mitigation, affected identifiers

lanes/contract-review.md
  mission: public API, protocol, storage, migration, compatibility
  inspects: every externally visible contract against the 8-field
    checklist (owner, consumers, inputs, outputs, state, invariant,
    forbidden edge, examples) and against current source
  good: findings name the consumer that breaks and the field that
    breaks it; bad: hypothetical consumers, naming-style opinions
  overlap: internal interfaces route to whole-pair integration;
    contract security routes to the security lane
  stop: every externally visible contract checked against all eight
    fields and current source
  finding result: the under-specified or breaking contract, its
    consumers, smallest correction

lanes/platform-fit.md
  mission: cross-runtime and cross-harness behavior
  inspects: platform claims against actual platform contracts;
    per-runtime behavior differences named, never averaged
  good: each claim tested against the platform's documented contract
    with a citation; bad: "should work on both", averaged behavior
  overlap: general structure routes to whole-pair; behavior under
    load routes to failure-mode
  stop: every cross-runtime claim verified or explicitly named
    unverifiable
  finding result: the failing platform assumption, where, and its
    design consequence

lanes/difference-review.md
  mission: hidden behavior in an existing implementation the
    artifacts do not state
  inspects: current code against the pair; undocumented decisions
    the design silently inherits or contradicts
  good: hidden decision + code anchor + adopt-or-replace posed as a
    basis-bearing statement; bad: inventories of code trivia the
    design need not state
  overlap: whether the decision SHOULD hold belongs to the parent
    and user; this lane only surfaces it
  stop: every artifact claim about current behavior checked against
    code, and every load-bearing code behavior absent from the pair
    listed
  finding result: the hidden decision, its code anchor, and whether
    the pair adopts or replaces it — as a basis-bearing statement

lanes/failure-mode.md
  mission: operational, concurrency, performance, and data-integrity
    failure under load and partial failure
  inspects: failure propagation against containment claims; ordering
    and consistency boundaries; recovery and partial-success paths;
    proof burden on the riskiest path
  good: a falsifying scenario with a concrete trigger and the
    boundary it breaks; bad: generic "add retries", risks with no
    scenario attached
  overlap: security-motivated failure routes to the security lane;
    proof mechanics beyond the seam route forward to planning
  stop: the riskiest path traced to containment and 2-3 probes run
    against the design's own claims
  finding result: the falsifying scenario, the boundary it breaks,
    and the requirement or proof seam that must exist
```

**Implementation call contract.** The implemented skill states these as literal calls; a stage that skips one fails its guard:

```text
MUST load references/artifact-formats.md and return the lifecycle
  header, skeletons, and traceability form — before creating or
  editing either artifact.
MUST load references/drafting-specification.md and return its
  requirement-quality pass and open-decision list — before the
  specification draft completes. Section-writer packets for Why/What
  sections carry this reference as their lane reference.
MUST load references/drafting-program-design.md and return its
  integration pass and assumption list — before the program-design
  draft completes. Section-writer packets for How sections carry it
  likewise.
MUST load references/reviewing-pair.md and return the common review
  result — every reviewer, before applying its lane mission.
MUST load references/review-cycle-schema.md and return the packet
  composition, receipt shapes, drafting-check record, and per-role
  dispatch contract — before the first dispatch of any kind.
```

A promised stage without an owning teaching reference, or a reference failing its contract above, is an implementation completion blocker.

### Agents

Every dispatch routes through `manage-agents` using its real contracts: the agent job packet (`manage-agents/references/agent-job-packet.md`) for every dispatch this workflow makes, with parent-conversation-history and workspace-access decisions recorded per packet. Where this workflow needs generic support the packet lacks — a field binding a dispatch to a target artifact version (here, the pair content revision and cycle id) — `manage-agents` is extended directly during implementation rather than mirrored.

```text
role             pattern    context             access      cardinality
──────────────   ────────   ─────────────────   ─────────   ───────────
parent           —          owns everything     authors,    1
                                                decides
section writer   Delegate   fresh, packet only  read-only   0..n one-shot
reviewer         Delegate   fresh, no history   read-only   1 mandatory
                                                            + risk-based
evidence         Delegate   fresh, packet only  read-only   0..n one-shot
```

- **The parent is the author.** It holds all information, drafts and integrates both artifacts, and preserves one mental model across Why, What, and How. There is no persistent author fork and no multi-author topology.
- **Section writers** produce bounded candidate text from a packet naming the section outline, the `REQ-*` it must answer, source anchors, non-goals, and the parent-decided structural claims the section expresses. Where structure is undecided, the writer returns a gap — never prose that chooses. They may not originate `REQ-*`, `CLAIM-*`, `INV-*`, bases, statuses, revisions, structural realizations, option selections, failure policies, or normative-force prose: every semantic sentence in returned text maps to a packet-supplied identifier or parent-decided claim, and an unmapped need returns as a gap; a needed new requirement routes through the parent into the specification. The parent integrates every word before it becomes artifact content.
- **Reviewers** start with no inherited conversation history and read-only access (the `manage-agents` reviewer rules: parent conversation history `none`, workspace access `read-only`), and return candidate findings only. The whole-pair reviewer requires Frontier capability at high reasoning. `manage-agents` remains the sole owner of pattern and category allowances: the cutover adds an explicit Frontier one-shot reviewer case to its Delegate pattern table rather than overriding it — a packet records the pattern-supported selection; it can never raise a ceiling the pattern does not grant. The authority audit is judgment work, and the recorded failure was a judgment miss.
- **Evidence contributors** answer one named observable question with source-backed candidate evidence; they return no prose destined for the artifacts.

### Acceptance gate

The parent verifies every criterion while both artifacts are `draft` at the same revision:

- Both artifacts exist, synchronized `draft`, same content revision.
- Every requirement is testable; every requirement's basis is `code-constraint` or `user-decision` with a named source.
- Every normative-force structural decision (per Decision authority) carries an accepting basis or an `Open Design Decisions` entry.
- No artifact statement contradicts a user-owned non-goal or constraint; material non-goals and constraints carry identifiers and, where they bind design choices, an accepting basis.
- Every load-bearing `user-decision` basis — across requirements, material non-goals and constraints, material invariants, and normative-force structural realizations — has been surfaced to the user (identifier and paraphrase) and confirmed or corrected in the current cycle `c<M>`.
- Internal structure is absent from the specification unless externally contractual; the program design contains no task sequence.
- Every requirement has a traceability entry with status `satisfied` (see format below).
- Module ownership, dependency direction, sources of truth, flows, and material failure behavior are explicit and mutually consistent: no known-open cross-requirement or intra-How contradiction remains.
- Load-bearing current-state and platform claims are parent-validated.
- Every selected review scope is covered per the Scope and invalidation rules, including terminal re-entry's fresh-receipt requirement.
- Every upheld finding is `verified-closed`; no material finding remains `contested` or `unverified`; security readiness satisfies the conditional-review rule below.

When all criteria hold, the parent authorizes the status write `draft → accepted` in both files and verifies it against the synchronized-write field set (header rule).

Non-accepting outcomes (each writes `Stop reason:` so the state is recoverable from disk, and each is verified against the same field set):

- `decision-needed` → both statuses `blocked`; the smallest material decision returns to the user; resumable.
- `blocked` → both statuses `blocked`; names the missing source or authority.
- `deferred` → both statuses `deferred`; user parked the work; no plan-readiness claim.

### Handoff

Within the invocation, the parent hands plan creation both paths, the accepted revision, and the traceability contract directly. Across agents, machines, or sessions, `spec-handoff` carries — alongside its existing context packet, not replacing it — the accepted-pair record: both repository-relative paths, both synchronized statuses, the shared content revision, and both plain file SHA-256 digests so a receiver can detect a stale or edited artifact. Plan creation rejects a pair that is not synchronously `accepted` at one revision and routes back to `spec-design` rather than inventing missing design.

## How — the workflow

The workflow is a state chart. States own dispatch rights; guards are observable predicates; the current state is recoverable from disk (statuses + content revision + `Review cycle` + `Stop reason:` + the mandatory review ledger). A missing ledger means coverage cannot be shown, and the parent starts a fresh cycle.

```text
entry: bare requirements │ lone artifact │ existing pair
                     │
                     ▼
┌─ FRAMING ─────────────────────────────────────────────────┐
│ parent re-anchors and reads source; resolves both paths   │
└──────┬───────────────────────────────────────┬────────────┘
       │ cannot proceed                        │ pair exists,
       ▼                                       │ draft, synchronized
 ((PRE-PAIR STOP))                             ▼
                                  ┌─ DRAFTING ──────────────┐
                                  │ parent writes; section  │
                                  │ writers optional        │
                                  └───────────┬─────────────┘
                                              │ guard: basis +
                                              │ traceability satisfied
                                              ▼
                                  ┌─ REVIEW  (cycle c<M>) ──┐
                                  │ DISPATCH → REDUCE →     │
                                  │ REMEDIATE → REFRESH ⟲   │
                                  └───────────┬─────────────┘
                                              │ all upheld findings
                                              │ verified-closed
                                              ▼
                                  ┌─ GATE ──────────────────┐
                                  └─┬──────┬───────┬────┬───┘
                                    ▼      ▼       ▼    ▼
                              ACCEPTED  DECISION BLOCKED DEFERRED
                                  │     NEEDED
                                  ▼
                            plan creation

resume edge: any terminal state (DECISION NEEDED is Status:
             blocked on disk) ──(status-only write to draft,
             verified per the header field set)──►
             DRAFTING when the re-entry will change content —
             a new change, or a returned decision or evidence
             to apply — else REVIEW; the next REVIEW entry
             opens cycle c<M+1>
```

### FRAMING

The parent restates problem, consumers, outcomes, constraints, non-goals, and success shape; reads current code, docs, and prior decisions; resolves authoritative inputs and both target paths. Evidence Delegates may be dispatched for named gaps. From zero or one artifact the parent creates or reconstructs the missing sibling and initializes the synchronized `draft` pair at `r1` per the header rule.

Guard out: a parent-verified synchronized `draft` pair exists at one revision, with decision target, source anchors, open questions, and security sensitivity explicit — or the run stops with the pre-pair receipt and no plan-ready claim.

### DRAFTING

Two visible sub-stages, each with its owning craft reference. The parent loads `references/drafting-specification.md` before drafting Why/What and `references/drafting-program-design.md` before drafting How; section-writer packets cite the same references so delegated text is written to the same bar.

The parent drafts the specification first and validates its load-bearing claims, then drafts the program design constrained by it. A discovered requirement gap or meaning change goes to the specification first; program design resumes from the revised meaning. Missing product decisions are resolved — or returned to the user — before they are disguised as internal design. Section writers may be dispatched here under the rules above; evidence Delegates for named gaps.

Guard out (all artifact-readable): every requirement carries a basis and no obligation sits outside `REQ-*` (per Decision authority); the requirement-quality pass from `drafting-specification.md` and the integration pass from `drafting-program-design.md` are written to the process ledger as revision-bound drafting-check records, with their open-decision and assumption lists; every requirement has a traceability entry with status `satisfied`; every `CLAIM-*`/`INV-*` has an owning section; the How sections agree with the integrated `Design Overview`; no mandatory heading is missing without a stated reason. A `gap` entry keeps this state active; a `decision-blocked` entry routes its decision to the user and, when material (per Decision authority), stops the run as `decision-needed`.

### REVIEW

The only reviewer fan-out. REVIEW entry is the single owner of cycle-id assignment: on entry, before the first dispatch, the parent assigns the next cycle id `c<M>`, writes `Review cycle: c<M> in-cycle @ r<N>` to both headers, and opens the mandatory ledger. Four sub-states, all edges returning to the parent:

1. **DISPATCH** — the mandatory whole-pair reviewer plus predicate-selected focused reviewers, in parallel, fresh context, read-only, packet-bound to the current revision and cycle.
2. **REDUCE** — the parent verifies every candidate finding against artifacts and source, classifies disposition, merges duplicates, records conflicts, logs receipt states (recording `no-receipt` for silence), and verifies remediated corrections — moving each to `verified-closed` immediately when no receipt was invalidated, otherwise after the refreshed receipt is reduced.
3. **REMEDIATE** — the parent applies upheld findings to the owning artifact sections; any semantic content change increments the revision in both files (header rule). Findings move `open → remediated`, each written as a remediation record in the ledger.
4. **REFRESH** — entered only when a remediation invalidated receipts under Scope and invalidation; affected receipts are freshly dispatched and refreshed findings re-enter REDUCE.

Guard out: every upheld finding is `verified-closed`; every selected scope is covered per Scope and invalidation. The parent writes `Review cycle: c<M> covered @ r<N>`.

### GATE

The parent evaluates the acceptance criteria (What → Acceptance gate). Exactly one outcome fires: `accepted`, `decision-needed`, `blocked`, or `deferred`, each with its synchronized status write verified against the header field set, and `Stop reason:` when non-accepting.

### Resume

Any terminal pair re-enters through a parent-authorized synchronized write to `draft`, verified against the header field set (revision preserved; `Stop reason:` removed; the prior `Review cycle` value stands as history until the next REVIEW entry assigns `c<M+1>`). Route by entry reason: a re-entry that will change content — a new design change, or a returned decision or evidence gap to apply — enters DRAFTING, where the parent writes the change into the owning artifact (a semantic change, so the revision increments per the header rule). A re-entry that only re-verifies unchanged content enters REVIEW directly, and if no remediation is needed, re-acceptance uses the unchanged revision. An accepted pair therefore always re-enters through DRAFTING unless the parent is only re-verifying.

### Scaling

- A truly mechanical change that alters no behavior, contract, ownership, or structure does not invoke `spec-design`; record why no design artifact is required.
- A tiny behavior or design change still separates Why/What from How: both siblings, short. The tiny-form floor is fixed: the shared lifecycle header; basis on every requirement; a traceability entry per requirement; the whole-pair review; and the gate criteria for basis, traceability, user-decision confirmation, and whole-pair coverage. Sections that are demonstrably not applicable may be omitted with a one-line reason each — the same rule the Formats section owns — and the two security sections always remain.
- Chat-only exploration may use the same mental model without artifacts, but cannot claim acceptance or plan readiness.
- Substantial, ambiguous, cross-module, public-contract, stateful, or high-risk work uses the full cycle. Reviewer count scales with observable risk, never document length.

### Route-back table

Routes name the owning artifact, never a state: inside REVIEW, every upheld finding is applied in REMEDIATE; outside a cycle, changes are authored in DRAFTING.

| defect discovered | owning destination |
| --- | --- |
| requirement, public contract, observable behavior | specification |
| internal ownership, interface, state, flow, failure policy | program design |
| missing fact | evidence Delegate |
| value judgment, material product tradeoff, non-accepting basis | user (`decision-needed`) |
| task ordering, proof commands | forward to planning, only after acceptance |

### Security-sensitive conditional review

Evaluate whether the pair touches authentication, authorization, secrets, untrusted input, parsing, filesystem or network access, subprocesses, plugins, MCP, CI, package scripts, agents, external services, data retention, or trust-boundary changes. Any true predicate makes focused security review and threat-boundary treatment mandatory — never waivable by claiming a threat model is unnecessary. If every predicate is false, both owning security sections record `Security context: not applicable` with the predicate evaluation in their evidence line — no review-plus-waiver ceremony. Standalone repository threat models, scans, and security-finding remediation route to `ops-security-review`; the integrated design-time review stays here.

## Formats

Headings may be omitted only when demonstrably not applicable, with the reason stated — except both security sections, which are mandatory. The lifecycle header and the traceability entry are owned by this section. In the implemented skill, this section ships as its own artifact-contract reference (`references/artifact-formats.md`) cited by `SKILL.md`; the mental model, state spine, guards, and completion boundary stay in the body.

### Specification document

`docs/specs/<yyyy-mm-dd-slug>/<yyyy-mm-dd-slug>.md`

```text
# <Title> Specification

Status: draft | accepted | blocked | deferred
Date: <yyyy-mm-dd>
Content revision: r<N>
Review cycle: none | c<M> in-cycle @ r<N> | c<M> covered @ r<N>
Stop reason: <only while blocked or deferred>

## Why
### Problem
### Consumers
### Desired Outcomes
### Success Criteria
### Goals
### Non-goals

## What
### Scope
### Requirements            # REQ-*; basis + source per normative item
### Observable Behavior
### External Contracts
### Constraints
### Edge Cases and Failure Expectations
### Security, Privacy, and Operational Obligations
Security context: sensitive | not applicable
Security context evidence: <predicate evaluation>
### Acceptance Criteria
### Open Product Decisions
```

### Program-design document

`docs/specs/<yyyy-mm-dd-slug>/<yyyy-mm-dd-slug>-program-design.md`

```text
# <Title> Program Design

Status: draft | accepted | blocked | deferred
Date: <yyyy-mm-dd>
Content revision: r<N>
Review cycle: none | c<M> in-cycle @ r<N> | c<M> covered @ r<N>
Stop reason: <only while blocked or deferred>
Specification: <sibling path>

## How
### Design Overview
### Current-System Constraints
### Responsibility and Ownership Boundaries
### Modules and Dependency Direction
### Internal Types and Interfaces
### State Ownership and Sources of Truth
### Data Flow and Control Flow
### Concurrency, Consistency, and Ordering
### Failure Handling, Retry, and Cleanup
### Security and Trust Boundaries
Security context: sensitive | not applicable
Security context evidence: <predicate evaluation>
### Runtime and Platform Integration
### Observability and Performance
### Test and Proof Seams
### Requirements-to-Design Traceability
### Alternatives and Tradeoffs
### Planning Constraints
### Open Design Decisions
```

Each traceability entry (owned by this format section):

```text
REQ-001
  structural realization: <owner, contract, flow, or invariant>
    basis: code-constraint | user-decision | author-recommendation | unresolved
    source: <code path, doc, or public-safe paraphrase>
  design location: <program-design section>
  proof seam: <observable boundary the plan must operationalize>
  status: satisfied | gap | decision-blocked
```

Only `satisfied` is accepting. `gap` routes to DRAFTING (a structural answer is still authorable); `decision-blocked` pauses for missing evidence, authority, or a decision.

## Changes

Implementation of this proposal is a hard cutover:

- Create `spec-design` as a wholly new workflow skill with the state chart as its main path and the full tree from Reference tree and teaching contract — both drafting-craft references and all six lane missions included. Implementation cannot be claimed complete while any promised stage lacks its owning teaching reference.
- Adapt, do not rewrite from nothing: `drafting-specification.md` draws from the retired `user-decision-questions.md`, `product-intent.md`, and `requirements-testability.md`; `drafting-program-design.md` from `risk-and-tradeoff-design.md` and the architecture lanes' judgment content; the lane missions from `whole-spec-coverage.md` (whole-pair-integrity), `security-threat-model.md` (security-threat-boundary), `contract-and-scope.md` (contract-review), `harness-fit.md` (platform-fit), `spec-difference.md` (difference-review), and — for `failure-mode.md` — `risk-and-tradeoff-design.md`'s falsifying-scenario, failure-containment, and reversibility craft composed with `validation-and-testability.md` for proof burden. All reshaped to the pair model and authority audit, with their swarm-topology framing dropped.
- Retire `spec-creation-swarm` and `spec-review-swarm` into `plugins/shravan-dev-workflow/retired-skills/` per the repo convention (`SKILL.retired.md`, outside the loadable `skills/` tree, historical content verbatim). No aliases, shims, or dual paths.
- Route cutover is a derived sweep, not a hand list: every occurrence of either retired skill name across `plugins/`, `AGENTS.md`, `tests/`, and both marketplace/plugin manifests points at `spec-design` or is deleted — this includes skill bodies and their `references/` files, `plugins/shravan-dev-workflow/README.md`, the `.codex-plugin/plugin.json` prompt examples, `plugins/README.md`, `plugins/shravan-dev-workflow/references/trigger-evals.md`, the pressure-scenario README, and surviving skills' scenarios that mention the retired names. The retired skills' own pressure scenarios are deleted only after their `spec-design` replacements exist and pass (the replacement-first rule in the deferred list below). The cutover gate is `grep -rn --exclude-dir=retired-skills 'spec-creation-swarm\|spec-review-swarm' plugins AGENTS.md tests .claude-plugin .agents` returning zero matches; the retired archive keeps its historical content verbatim. The sweep adds one mandatory mirrored boundary line to each of the `docs-maintain` and `ops-security-review` descriptions (documentation-only reconciliation vs semantic design change; standalone security work vs in-cycle threat review) — frontmatter boundaries only, never a body redesign.
- Add the accepted-pair record (paths, synchronized statuses, shared revision, both file SHA-256 digests) to the `spec-handoff` packet alongside its existing context contents, and update its boundary statement so a resumable packet stays portability-only while an accepted-pair record is the portable acceptance transport.
- Cut over plan creation's entry contract (the third body exception): for work that owns a product or architecture design, its source-resolution rule accepts only the synchronously accepted pair — direct handoff or the `spec-handoff` record — and routes bare requirements, chat decisions, and unpaired documents to `spec-design`. One owner states the rule; every plan entry cites it. No other plan-workflow redesign occurs here.
- Extend `manage-agents/references/agent-job-packet.md` with a generic target-artifact-version field (used here to bind dispatches to the pair content revision and cycle id); the new dispatch field is the value the packet's existing receipt-scope `source/head version` echoes. Extend the `manage-agents` Delegate pattern table with an explicit Frontier-capability, high-reasoning one-shot reviewer case (used by the whole-pair reviewer); the pattern table remains the sole owner of allowed categories, and no packet field overrides it.
- Update plugin documentation, marketplace descriptions, changelog, and version metadata during implementation; validate both Claude and Codex plugin surfaces.
- Update admired-source provenance in the `ai-dev-skills` meta-repo — path-level mappings, pins, and bump notes for every source adapted above — and record an explicit decision on whether the lite catalog (`plugins/shravan-dev-workflow/docs/source-inspiration-catalog.md`) needs a refresh.

Explicitly deferred to follow-up work, not silently dropped:

- The `skills-creation` recreation: its reorganization around this workflow, the named-skill routing path and its plan gate, and the alignment between `references/review-cycle-schema.md` and `skills-creation`'s review lane schema.
- Any repurposing of `plan-improve-repo` and any adjacent-skill trigger redesign.
- The evaluation-harness redesign only. Replacement pressure proof is inside the hard cutover, not deferred: implementation authors scenarios for the six named behavior claims — authority laundering across all four sources; a design contradicting a user-owned non-goal; unintegrated How (every traceability row `satisfied` while two modules disagree on state ownership or failure propagation); partial-scope loss through packet narrowing; a stale receipt surviving remediation; and interrupted-state recovery from disk alone — plus positive/negative trigger evaluation. Retired-skill scenarios are deleted only after their replacements exist and pass, and `tests/skills/run-skill-pressure-tests.sh --fast` passes before any PR-ready claim, per `AGENTS.md`.

This proposal changes only the design contract. Actual skill edits, reference moves, manifests, version bumps, changelog entries, and implementation planning are out of scope for this change.
