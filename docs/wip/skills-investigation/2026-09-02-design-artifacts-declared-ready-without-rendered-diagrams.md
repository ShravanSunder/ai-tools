# 2026-09-02-design-artifacts-declared-ready-without-rendered-diagrams

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: Private design
  session summarized here without raw transcript excerpts. Assignment identity:
  `2026-09-02-design-diagram-failure-intake`.
- Related repo or workflow: `shravan-dev-workflow` design cycle using
  `orchestrator-design`, `spec-design`, `program-design`, and
  `spec-program-review`; inspected output was an Agent VM Requirements,
  Specification, Program Design, and proof-architecture set.
- Date observed: 2026-09-01 through 2026-09-02.
- Publication baseline: `ai-tools` `master` at
  `3f3dfb69273bd720795f434491622ff96c160131`.

## What Went Wrong

- Observed behavior: A substantial three-artifact design cycle returned
  `ready` after producing 234 lines of Requirements, 494 lines of
  Specification, 877 lines of Program Design, and 102 lines of separate proof
  architecture. The 1,707-line set contained 22 fenced plain-text structures
  and no Mermaid diagram or embedded rendered image. The documents therefore
  made a reviewer reconstruct the core topology, call sequences, cancellation
  lifecycle, and trust boundaries from long prose, tables, and text outlines.
- Observed behavior: Required-view predicates clearly fired. The Specification
  described multiple consumers and observable surfaces. The Program Design
  described more than three components, changed cross-owner call paths, nested
  cancellation and approval lifecycle, untrusted processes and credentials,
  multiple failure/recovery cases, and requirement-to-proof relationships.
- Observed behavior: The authoring/review flow treated fenced text, tables, and
  exhaustive prose as adequate view coverage, then reported that independent
  review and remediation made the design ready. The resulting status hid a
  reader-comprehension failure that the owner immediately detected when trying
  to review the documents.
- Expected behavior: Every fired view predicate should produce the smallest
  inspectable visual that answers its reader question, preserve the required
  semantic fields, receive a real visual check, and block `locally-ready` or
  `ready` when that evidence is missing. A long design should begin with a
  visual spine that lets a reviewer understand the system before reading
  detailed contracts.
- Cost of the failure: The owner could not efficiently review or challenge the
  design; the `ready` result was unreliable; review effort was shifted from the
  author to the human; later planning or implementation could inherit
  misunderstood ownership, call, cancellation, or trust relationships; and a
  second design pass became necessary despite an already expensive review
  cycle.

### Concrete relationships that needed visuals

The artifacts should have made at least these reader questions visually
answerable:

1. Requirements or Specification context: who are the operator, Hermes agent,
   security/runtime owners, and Tool Portal consumers; which observable
   surfaces do they use; and what remains outside the product boundary?
2. Tool VM CLI behavior: how does a direct call differ from `hintDeny` and
   `hintRequiresApproval`, and why are those hints route-local rather than Tool
   VM containment?
3. Program Design topology: which component owns configuration, catalog
   compilation, advisory classification, approval presentation, Tool VM
   execution, and the execute-code bridge?
4. PR1 sequence: how does `tool_portal_call` reach the configured executable in
   the current leased Tool VM and return success, denial, approval, or an
   execution error?
5. PR2 sequence and lifecycle: how does model-written Python call Tool Portal
   through the parent Hermes process, and how are nested calls and approvals
   cancelled when `execute_code` ends?
6. Trust boundary: which process owns session/profile authority, private UDS,
   SSH and lease identity, and backend routing; what authority is deliberately
   absent from the Tool VM child?

## Evidence To Collect

- Relevant transcript excerpts: Preserve the private session evidence showing
  the initial `ready` claim, the owner's wall-of-text review failure, the
  author's admission that required predicates fired, and the rationalization
  that fenced text and tables were treated as sufficient views. Do not copy the
  raw transcript into this public repository.
- Files, commands, or logs: Preserve a private snapshot or content hashes for
  the four inspected Agent VM artifacts. At intake time, `wc -l` reported
  `234`, `494`, `877`, and `102` lines respectively. A fenced-block search found
  22 `~~~text` blocks and no Mermaid fenced block.
- Files, commands, or logs: Inspect the design artifacts in a renderer capable
  of showing Mermaid or embedded images. The current evidence proves absence
  of rendered-diagram source and excessive density, but it does not yet record
  a destination-level visual inspection receipt for an improved version.
- Existing skill or instruction that should have prevented it:
  `plugins/shravan-dev-workflow/skills/spec-design/SKILL.md` says to apply the
  Required Why/What Views predicates and, for every firing, return the selected
  medium, fallback, semantic-preservation, and visual-check result. Its
  completion blockers prohibit `locally-ready` when an applicable view lacks
  required fields, a passed rendering result, or a separate normative home.
- Existing skill or instruction that should have prevented it:
  `plugins/shravan-dev-workflow/skills/program-design/SKILL.md` requires the
  same per-view rendering evidence, says read-only/chat-only work must produce
  the view rather than merely describe it, and explicitly blocks
  `locally-ready` when a substantial design with contested ownership or
  cross-owner control remains prose-only.
- Existing skill or instruction that should have prevented it:
  `plugins/shravan-dev-workflow/shared-references/diagram-rendering-and-fallbacks.md`
  says that prose labeled as a diagram is bad, source inspection alone is not a
  visual pass, and every fired view must either pass semantic and visual checks
  or return an exact blocking gap.
- Existing skill or instruction that should have prevented it:
  `plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md` requires a
  reviewer to name each applicable diagram's reader question and compare its
  visible owners, direction, state/effect, normal/error behavior, and changed
  edges with the written design. Its completion blockers prevent `ready` when
  an applicable diagram has not been checked for usefulness and agreement.
- Existing skill or instruction that should have prevented it:
  `plugins/shravan-dev-workflow/skills/orchestrator-design/SKILL.md` allows
  `ready` after the three current artifacts have one ready independent review
  or parent-verified remediation. It relies on phase receipts and does not
  independently validate required-view evidence, so an invalid author/reviewer
  receipt can propagate to the terminal result.

### Rationalizations to pressure-test

The failure was not caused by a total absence of diagram instructions. It was
enabled by interpretations that turned strong intent into weak execution:

- A fenced text outline was counted as a structural view even when it did not
  provide the scanability expected from a rendered topology or sequence.
- A Markdown table was treated as sufficient merely because it was structured,
  even when topology, time, direction, or containment was load-bearing.
- “Choose the medium” was interpreted as permission to default to plain text
  without first proving that the repository lacked a working Mermaid or image
  rendering path.
- Semantic completeness was allowed to substitute for reader usability: the
  information existed somewhere in the text, so the artifact was treated as
  reviewable.
- The review checked design meaning but failed to treat missing required-view
  evidence as a terminal readiness blocker.
- The orchestrator trusted the phase and review result instead of detecting
  that the returned view-verification claim lacked inspectable receipts.

### Evidence gaps

- The exact author and reviewer return packets, including their per-view
  predicate decisions and claimed rendering receipts, are not stored in these
  durable artifacts. They should be recovered from private session evidence
  before assigning the failure to one phase exclusively.
- It is not yet proven whether the repository had a usable Mermaid renderer or
  Markdown preview at authoring time. This affects the correct fallback, not
  whether the view obligation existed.
- No controlled pressure test has yet compared the current skills against a
  1,000-line, semantically correct, zero-rendered-diagram design.
- No evidence yet establishes whether a deterministic lint can infer predicate
  firing reliably. A lint can cheaply detect zero diagram anchors or missing
  view receipts, but semantic predicate selection still requires model
  judgment.

## Initial Classification

- Status: investigate
- Likely owner: Existing `spec-design` and `program-design` required-view
  completion contracts, with defense-in-depth in `spec-program-review` and
  receipt validation in `orchestrator-design`. The shared rendering reference
  likely owns a narrower fallback loophole. This is an investigation result,
  not authorization to edit any skill.
- Candidate outcome: update existing skill. Do not create a new diagram skill;
  the current owners and predicates already exist.
- Severity: serious. The workflow returned a false readiness signal for a
  substantial design and made the human absorb avoidable comprehension cost.

### Smallest likely guardrail improvements to evaluate

These are audit candidates, not implementation commitments:

1. Require an explicit per-artifact required-view manifest before authoring or
   review: view, fired/not-fired basis, reader question, required semantic
   fields, destination anchor, chosen medium, and visual-check receipt.
2. State that ordinary prose, a table, or fenced plain text does not satisfy a
   topology, sequence, state, failure, or trust-boundary predicate merely by
   containing the facts. It satisfies the predicate only when that medium was
   deliberately selected under the fallback contract and visibly preserves
   the relationship better than the alternatives.
3. Require an attempted repository preview or available Mermaid renderer
   before falling back from Mermaid for load-bearing topology, sequence, flow,
   or state in durable Markdown. Record the actual rendering failure.
4. Add a density/orientation rule: when a substantial artifact introduces
   three or more actors, components, execution targets, or boundary crossings,
   place the smallest integrated orientation visual before detailed contracts.
5. Make zero rendered diagrams plus one or more fired visual predicates an
   automatic `needs-revision`, even if prose and tables are semantically
   complete.
6. Require `spec-program-review` to reject a `ready` result unless each fired
   view has a visible artifact anchor and verified receipt, rather than merely
   reviewing diagrams that happen to exist.
7. Have `orchestrator-design` validate the presence and shape of required-view
   receipts before accepting `locally-ready` or review `ready`; it should not
   redo semantic judgment.

## Next Step

- What evidence is still missing: Recover the private phase/review return
  packets; identify which fired predicates were recorded, skipped, or falsely
  passed; verify the repository rendering path available during the session;
  and run a fresh-context pressure scenario against the current skill package.
- Who or what should inspect it next: Route this intake through
  `skill-audit` to classify the exact owner and smallest update set. If an
  update is admitted, route each named skill change through `skills-creation`
  and add a pressure scenario whose input is a correct but very long design
  containing only prose, tables, and fenced text. The expected result is
  `needs-revision`, with missing visual orientation and per-view rendering
  receipts named explicitly.
