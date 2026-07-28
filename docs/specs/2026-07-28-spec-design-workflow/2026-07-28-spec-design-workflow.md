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

- **Creation needs one integrating mind; verification needs independent minds — at least one always, more only where an observable risk predicate holds.** Fan-out exists in exactly two places, and for exactly one concern each: bounded section-writing inside drafting (text production, never decisions) and reviewer dispatch inside review (skepticism, never authorship). Everything else is a single thread through the parent.
- **The workflow is first-class.** It is defined as a state chart: named states, transitions, and guards. Every guard is an observable predicate readable from the artifacts and the mandatory review ledger, so a fresh agent can recover the current state from disk. Subagents are called only inside states that declare dispatch rights.

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
- Redesigning adjacent skills. Their triggers and bodies keep shipped wording, with exactly three body exceptions named in Changes: `spec-handoff` gains the accepted-pair record and a boundary-statement update, `manage-agents` gains one generic packet field plus a reviewer capability note, and plan creation's entry contract cuts over to the accepted-pair gate. Otherwise only dangling references to the two retired skills cut over.
- The mandatory named-skill routing path. Recreating `skills-creation` around this workflow is follow-up work that consumes `spec-design`; its routing contract belongs to that follow-up spec.
- Portable cryptographic acceptance receipts. Handoff freshness is carried by statuses, the shared content revision, and plain file digests in `spec-handoff` — nothing more.
- Pressure scenarios and the skill-testing system (explicitly deferred; static validation and review are not pressure proof).
- Recording review chronology, agent identities, or conversation history as design rationale.

## What

### One workflow, one closed cycle

`spec-design` owns the complete pre-plan design cycle. Review is not a later skill recommendation and remediation is not an owner-facing handoff that ends the run; both are inner loops of the same invocation.

The invocation completes only when the parent accepts the pair, the user explicitly stops or defers, or a material decision or evidence gap blocks further design.

Trigger description for the future skill:

```text
Use when writing, revising, reviewing, resuming, or accepting a spec,
design doc, or architecture doc before an implementation plan exists,
even with no document yet — critique, attack, poke holes, pressure-test
assumptions, remediate findings. Not for one named skill's
create/update/evaluate work, reviewing an implementation plan or
handoff, shared-model reconvergence, docs housekeeping, evidence-only
research, handoff packaging, or standalone security review and
security-finding remediation.
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
- `Review cycle: none | c<M> in-cycle @ r<N> | c<M> covered @ r<N>` — written by the parent when the cycle's first reviewer dispatches (`in-cycle`) and when the REVIEW guard passes (`covered`). `<M>` is a monotonic cycle counter; guards that say "this cycle" resolve against it.
- `Stop reason: <text>` — present, with the same text in both files, only while status is `blocked` or `deferred`; names the smallest material decision or missing source and the exact resume inputs.

**Synchronized-write field set.** A synchronized status write changes exactly: both `Status` fields, the `Review cycle` field when the parent records cycle state, and the presence or text of `Stop reason:`. `Content revision` and all design content are unchanged. The parent verifies every synchronized write — accepting, non-accepting, and resume alike — against this field set. Every other section cites this rule rather than restating it.

Lifecycle rules:

- The pair lifecycle begins only after both siblings exist. From zero or one artifact, the parent creates or reconstructs the missing sibling and initializes both as synchronized `draft` at `r1` per the header rule. A lone artifact's prior status, revision, or receipts never establish pair acceptance or review coverage.
- After the pair exists, design content is mutable only while both statuses are `draft`.
- If framing or reconstruction blocks while zero or one artifact exists, the run stops with a pre-pair receipt (shape owned by the review-cycle schema, below) and claims no plan readiness. It never fabricates an empty sibling.
- The review ledger is mandatory from the first reviewer dispatch: it lives at a deterministic repo-local path (`tmp/spec-design/<slug>/ledger.md`) and collects the reduction and remediation records keyed by cycle id. A missing ledger means coverage cannot be shown, and the parent starts a fresh cycle. Research ledgers, packets, and scratch remain optional process evidence and are never promoted into the design artifacts.

### Decision authority

This section exists because of the recorded failure: an author recommendation laundered into a normative requirement passes every coherence check. Authority is therefore a declared, reviewable dimension — in both artifacts, because structural decisions can foreclose product choices just as requirements can.

Material semantic statements carry stable inline identifiers, unique across the pair (the same identifier never appears in both siblings):

```text
REQ-001: <testable obligation>            # specification only
CLAIM-001: <load-bearing current-state, product, or design claim>
INV-001: <material behavioral, structural, state, or security invariant>
```

Every normative requirement, every material `INV-*`, and every traceability entry's structural realization declares its basis:

```text
REQ-001: <obligation>
  basis: code-constraint | user-decision | author-recommendation | unresolved
  source: <code path, doc, or public-safe paraphrase of the user's decision>
```

- `code-constraint` — compelled by current code, platform, or verified external fact; `source` names it.
- `user-decision` — explicitly selected by the user; `source` paraphrases the decision (never a transcript dump).
- `author-recommendation` — the author's derived preference. Non-accepting for any normative obligation: the gate converts it into a decision returned to the user.
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

**Normative** means a `MUST`/`MUST NOT` obligation. Normative obligations live only in `REQ-*`: an `INV-*` or `CLAIM-*` stating a normative obligation is a defect the whole-pair reviewer flags. A structural decision that eliminates, replaces, or forecloses an existing production dependency, module, or user-visible mechanism carries normative force and requires an accepting basis or an entry in `Open Design Decisions`.

**Material** means load-bearing for acceptance: every requirement is material; a finding is material when its severity is `blocker` or `important`; a decision or tradeoff is material when it changes a requirement, a public contract, an ownership boundary, or a normative basis. Other sections cite these definitions rather than restating them.

Authority-bearing statements are not only requirements. Material non-goals, constraints, and externally meaningful commitments in the specification carry identifiers (`CLAIM-*` or `INV-*`) and, where they bind design choices, a basis. A program design that contradicts a user-owned non-goal or constraint is non-accepting regardless of wording force — the recorded failure's second branch was exactly a non-goal overridden without authority.

The whole-pair reviewer audits every declared basis in both artifacts against its named source — the basis field is what carries provenance to reviewers who never saw the conversation. A `user-decision` basis is auditable only by the user: a fresh reviewer can check that the paraphrase exists, not that the decision happened. The acceptance gate therefore surfaces the full inventory of normative `user-decision` obligations (identifier plus source paraphrase) to the user for confirmation before the accepting status write.

### Specification ownership: Why and What

The specification defines the externally meaningful contract: the problem and consumers; outcomes and success criteria; goals, scope, non-goals; functional and non-functional requirements (normative ones with basis); user-, API-, protocol-, or operator-visible behavior; constraints; edge cases and observable failure expectations; security, privacy, and operational obligations; acceptance criteria and open product decisions.

Requirements are testable obligations, not tasks. A requirement may constrain a public interface, but it does not assign internal module ownership or prescribe task sequence.

### Program-design ownership: How

The program design defines the internal structural contract that satisfies the specification: responsibility and module boundaries; internal abstractions, types, interfaces, dependency direction; state ownership and sources of truth; data flow, control flow, lifecycle; concurrency, consistency, ordering; failure handling, retry, cleanup, partial success; security and trust-boundary enforcement; runtime and platform integration; observability and performance structure; test and proof seams the plan must operationalize; alternatives and rejected options; requirement-to-design traceability.

The `Design Overview` is the integrated system model: one end-to-end account of ownership, dependency direction, state, lifecycle, flow, and failure propagation that every later section and every traceability row must agree with. Detailed sections attach to that model; a complete set of headings and per-requirement rows is an inventory, not a design, until they compose without contradiction.

Pseudocode, type signatures, and flow diagrams are welcome when they make the contract precise. Worker assignment, file-by-file tasks, command sequences, and execution DAGs are not — they belong to the plan.

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

**Packets and receipts.** Every reviewer receives both complete artifacts plus a curated packet. The packet is a composition over the `manage-agents` agent job packet: the generic dispatch fields come from that contract, and this workflow adds the exact pair content revision and cycle id, the declared `REQ-* | CLAIM-* | INV-*` identifiers and section/path scopes in focus, decision target, user constraints, source anchors, non-goals, security context, and the schema contract. Reviewers independently inspect named sources rather than trusting author confidence. A curated packet is review context; the authoring transcript is not.

Every responding reviewer returns a revision- and cycle-bound receipt with status `complete | partial | not-started` (`not-started` means the lane could not begin for a named missing input). Silence is recorded by the parent as `no-receipt`; a reviewer never returns that state. Which receipts credit coverage is owned by Scope and invalidation below.

Finding severity is `blocker | important | minor | observation` — graded by behavior effect. `observation` has no acceptance effect and the parent may prune it.

**Parent reduction.** The parent opens the claimed evidence for every candidate finding and classifies its disposition:

- `upheld` — supported, in scope, requires a correction;
- `dismissed` — unsupported, already satisfied, or out of scope;
- `contested` — a real tradeoff or product decision evidence alone cannot settle; it exits only through the gate's `decision-needed` outcome;
- `unverified` — potentially valid, missing the evidence needed to judge; it exits through an evidence Delegate or a re-dispatch, then re-enters reduction. Missing evidence is never converted to `dismissed`.

Every upheld finding tracks a resolution: `open` → `remediated` (the parent applies the correction and records the traceability effect) → `verified-closed`. The parent verifies each correction in REDUCE and closes it immediately when the remediation invalidated no receipt, otherwise after the required refreshed receipt is reduced. A failed correction returns to `open`. Within this workflow, `open` is only an upheld-finding resolution, `deferred` is only a pair status, and `blocked` is only a pair status (receipts use `not-started`); adjacent skills' vocabularies are untouched.

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
- Terminal re-entry: resuming an `accepted`, `blocked`, or `deferred` pair opens a new cycle `c<M+1>` and requires a fresh whole-pair review from that cycle, because the world outside the pair can drift while the artifact bytes do not. Focused reviews are refreshed where their risk predicate still holds; other prior receipts remain historical evidence and may be carried forward under the rule above.

**Schema ownership.** The implemented skill owns one reference, `references/review-cycle-schema.md`, which owns these shapes: the review packet (as the composition over the agent job packet named above), receipt, finding, reduction record, remediation record, carry-forward attestation, and pre-pair receipt. It also owns the per-role dispatch contract — lane, packet composition, authority ceiling, receipt, and parent reduction point — for reviewer, section-writer, and evidence dispatches. The lifecycle header and the traceability entry are owned by the Formats section of this contract. `SKILL.md` cites the schema, keeps only operational gates, and may name label values inside gates — but never redefines a shape. Alignment with `skills-creation`'s review lane schema is decided in the skills-creation follow-up, not here.

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
- **Section writers** produce bounded candidate text from a packet naming the section outline, the `REQ-*` it must answer, source anchors, non-goals, and the parent-decided structural claims the section expresses. Where structure is undecided, the writer returns a gap — never prose that chooses. They may not mint `REQ-*`, `basis`, status, or revision values; a needed new requirement routes through the parent into the specification. The parent integrates every word before it becomes artifact content.
- **Reviewers** start with no inherited conversation history and read-only access (the `manage-agents` reviewer rules: parent conversation history `none`, workspace access `read-only`), and return candidate findings only. The whole-pair reviewer additionally requires Frontier capability at high reasoning — dispatched as a Delegate, but above the Delegate pattern's default capability ceiling; the packet records this floor. The authority audit is judgment work, and the recorded failure was a judgment miss.
- **Evidence contributors** answer one named observable question with source-backed candidate evidence; they return no prose destined for the artifacts.

### Acceptance gate

The parent verifies every criterion while both artifacts are `draft` at the same revision:

- Both artifacts exist, synchronized `draft`, same content revision.
- Every requirement is testable; every normative requirement's basis is `code-constraint` or `user-decision` with a named source.
- Every normative-force structural decision (per Decision authority) carries an accepting basis or an `Open Design Decisions` entry.
- No artifact statement contradicts a user-owned non-goal or constraint; material non-goals and constraints carry identifiers and, where they bind design choices, an accepting basis.
- Every normative `user-decision` obligation has been surfaced to the user (identifier and paraphrase) and confirmed or corrected in the current cycle `c<M>`.
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
             to apply — else REVIEW, as a fresh cycle c<M+1>
```

### FRAMING

The parent restates problem, consumers, outcomes, constraints, non-goals, and success shape; reads current code, docs, and prior decisions; resolves authoritative inputs and both target paths. Evidence Delegates may be dispatched for named gaps. From zero or one artifact the parent creates or reconstructs the missing sibling and initializes the synchronized `draft` pair at `r1` per the header rule.

Guard out: a parent-verified synchronized `draft` pair exists at one revision, with decision target, source anchors, open questions, and security sensitivity explicit — or the run stops with the pre-pair receipt and no plan-ready claim.

### DRAFTING

The parent drafts the specification first and validates its load-bearing claims, then drafts the program design constrained by it. A discovered requirement gap or meaning change goes to the specification first; program design resumes from the revised meaning. Missing product decisions are resolved — or returned to the user — before they are disguised as internal design. Section writers may be dispatched here under the rules above; evidence Delegates for named gaps.

Guard out (all artifact-readable): every normative obligation carries a basis and no normative obligation sits outside `REQ-*` (per Decision authority); every requirement has a traceability entry with status `satisfied`; every `CLAIM-*`/`INV-*` has an owning section; the How sections agree with the integrated `Design Overview`; no mandatory heading is missing without a stated reason. A `gap` entry keeps this state active; a `decision-blocked` entry routes its decision to the user and, when material (per Decision authority), stops the run as `decision-needed`.

### REVIEW

The only reviewer fan-out. On entry the parent assigns cycle id `c<M>`, writes `Review cycle: c<M> in-cycle @ r<N>` to both headers, and opens the mandatory ledger. Four sub-states, all edges returning to the parent:

1. **DISPATCH** — the mandatory whole-pair reviewer plus predicate-selected focused reviewers, in parallel, fresh context, read-only, packet-bound to the current revision and cycle.
2. **REDUCE** — the parent verifies every candidate finding against artifacts and source, classifies disposition, merges duplicates, records conflicts, logs receipt states (recording `no-receipt` for silence), and verifies remediated corrections — moving each to `verified-closed` immediately when no receipt was invalidated, otherwise after the refreshed receipt is reduced.
3. **REMEDIATE** — the parent applies upheld findings to the owning artifact sections; any semantic content change increments the revision in both files (header rule). Findings move `open → remediated`, each written as a remediation record in the ledger.
4. **REFRESH** — entered only when a remediation invalidated receipts under Scope and invalidation; affected receipts are freshly dispatched and refreshed findings re-enter REDUCE.

Guard out: every upheld finding is `verified-closed`; every selected scope is covered per Scope and invalidation. The parent writes `Review cycle: c<M> covered @ r<N>`.

### GATE

The parent evaluates the acceptance criteria (What → Acceptance gate). Exactly one outcome fires: `accepted`, `decision-needed`, `blocked`, or `deferred`, each with its synchronized status write verified against the header field set, and `Stop reason:` when non-accepting.

### Resume

Any terminal pair re-enters through a parent-authorized synchronized write to `draft`, verified against the header field set (revision preserved; `Stop reason:` removed; a new cycle `c<M+1>` begins). Route by entry reason: a re-entry that will change content — a new design change, or a returned decision or evidence gap to apply — enters DRAFTING, where the parent writes the change into the owning artifact (a semantic change, so the revision increments per the header rule). A re-entry that only re-verifies unchanged content enters REVIEW directly, and if no remediation is needed, re-acceptance uses the unchanged revision. An accepted pair therefore always re-enters through DRAFTING unless the parent is only re-verifying.

### Scaling

- A truly mechanical change that alters no behavior, contract, ownership, or structure does not invoke `spec-design`; record why no design artifact is required.
- A tiny behavior or design change still separates Why/What from How: both siblings, short. The tiny-form floor is fixed: the shared lifecycle header; basis on every normative obligation; a traceability entry per requirement; the whole-pair review; and the gate criteria for basis, traceability, user-decision confirmation, and whole-pair coverage. Sections that are demonstrably not applicable may be omitted in the tiny form without per-heading justification (the two security sections always remain).
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

- Create `spec-design` as a wholly new workflow skill with the state chart above as its main path and `references/review-cycle-schema.md` owning the shapes enumerated in Schema ownership.
- Remove `spec-creation-swarm` and `spec-review-swarm`. No aliases, shims, or dual paths.
- Route cutover is a derived sweep, not a hand list: every occurrence of either retired skill name across `plugins/`, `AGENTS.md`, `tests/`, and both marketplace/plugin manifests points at `spec-design` or is deleted — this includes skill bodies and their `references/` files, `plugins/shravan-dev-workflow/README.md`, the `.codex-plugin/plugin.json` prompt examples, `plugins/README.md`, `plugins/shravan-dev-workflow/references/trigger-evals.md`, the pressure-scenario README, and surviving skills' scenarios that mention the retired names. The retired skills' own pressure scenarios are deleted; authoring replacements is deferred with the testing system. The cutover gate is `grep -rn 'spec-creation-swarm\|spec-review-swarm' plugins AGENTS.md tests .claude-plugin .agents` returning zero matches.
- Add the accepted-pair record (paths, synchronized statuses, shared revision, both file SHA-256 digests) to the `spec-handoff` packet alongside its existing context contents, and update its boundary statement so a resumable packet stays portability-only while an accepted-pair record is the portable acceptance transport.
- Cut over plan creation's entry contract (the third body exception): for work that owns a product or architecture design, its source-resolution rule accepts only the synchronously accepted pair — direct handoff or the `spec-handoff` record — and routes bare requirements, chat decisions, and unpaired documents to `spec-design`. One owner states the rule; every plan entry cites it. No other plan-workflow redesign occurs here.
- Extend `manage-agents/references/agent-job-packet.md` with a generic target-artifact-version field (used here to bind dispatches to the pair content revision and cycle id); the new dispatch field is the value the packet's existing receipt-scope `source/head version` echoes. Record alongside it that a dispatch may declare a capability floor above its pattern's default, as `spec-design`'s whole-pair reviewer does (Frontier, high reasoning, under the Delegate pattern).
- Update plugin documentation, marketplace descriptions, changelog, and version metadata during implementation; validate both Claude and Codex plugin surfaces.

Explicitly deferred to follow-up work, not silently dropped:

- The `skills-creation` recreation: its reorganization around this workflow, the named-skill routing path and its plan gate, and the alignment between `references/review-cycle-schema.md` and `skills-creation`'s review lane schema.
- Any repurposing of `plan-improve-repo` and any adjacent-skill trigger redesign.
- Pressure scenarios, the evaluation harness, and rollout claims that depend on them. Future skill implementation may advance as source-only; it cannot be claimed rollout-complete until the pressure-proof gate closes, per `AGENTS.md`'s requirement to add scenarios and run `tests/skills/run-skill-pressure-tests.sh --fast` before rollout. The future scenarios must cover these named behavior claims: authority laundering across all four sources; a design contradicting a user-owned non-goal; unintegrated How (every traceability row `satisfied` while two modules disagree on state ownership or failure propagation); partial-scope loss through packet narrowing; a stale receipt surviving remediation; and interrupted-state recovery from disk alone.

This proposal changes only the design contract. Actual skill edits, reference moves, manifests, version bumps, changelog entries, and implementation planning are out of scope for this change.
