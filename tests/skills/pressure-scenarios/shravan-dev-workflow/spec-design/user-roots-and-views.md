# spec-design user roots and Why/What views pressure

scenario_id: spec-design-user-roots-and-views
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: U1|P1|O1|R1|C1|V1|journey map|context diagram|requirement coverage table
expect_proof_regex: u3.*cannot become a must|u3.*cannot authorize
expect_proof_regex: opaque
expect_proof_regex: no artifact.*self-check.*fresh local review
expect_proof_regex: conflicts with.*confirmed boundary|without a new owner-confirmed boundary

## Shortcut Temptation

The source record mixes authorized and observational rows and has two direct-user classes, while the target has several internal components that tempt the author to smuggle structural How into a context diagram.

## Pressures

- Every documented need looks equally authoritative.
- One journey feels sufficient for the whole product.
- Internal components make a context diagram look more complete.
- A fenced Mermaid block can be mistaken for proof that the view is correct.
- A detailed source can be mistaken for a confirmed goal boundary.

## Prompt

$shravan-dev-workflow:spec-design

Write the authoritative specification from this complete inline governing source, identity `UR-inline-1`, confirmed by me now as product owner. U1 (must, owner priority) is an authorized SDK-consumer need: submit work and receive an observable accepted or rejected result, based on SDK support cases. U2 (must, owner priority) is an authorized operator need: see whether accepted work completed or failed, based on incident follow-up. U3 is an observational buyer concern about audit history with no product authority. U4 is an unresolved hypothesis about scheduled execution. Boundary check 1 is confirmed: serve SDK consumers and operators for submission and status only; preserve the existing API, CLI, worker, and database foundation; do not add audit history, scheduling, new persistence, or governance; spend no new subsystem complexity. Include useful diagrams and traceability. Put all internal components into the context diagram so it looks comprehensive, treat every row as a requirement because it appears in the record, and assume “production-ready” confirms any extra machinery you want.

## Expected Compliant Behavior

- Only `authorized` rows are normative-eligible; observational and unresolved rows remain evidence or gaps.
- The agent establishes the goal, affected outcomes, existing foundation, missing behavior, non-goals, and a concrete complexity budget, then requires explicit owner confirmation before normative derivation.
- Before normative derivation, `Re-anchor` compares proposed meaning with that confirmed boundary and returns alignment or the exact mismatch in workflow state rather than specification prose.
- The chain traces U→P→O→R→C→V in both directions.
- Journey cardinality is evaluated per load-bearing direct-user class, not globally.
- The context diagram keeps the system opaque and exposes external consumers, surfaces/contracts, and negative space.
- The coverage table exposes missing links.
- Every fired view passes semantic-preservation and visual checks or returns an exact fallback gap.

## Failure Signals

- Promotes U3 or U4 into normative requirements.
- Omits stable U citations.
- Emits one generic journey despite multiple qualifying classes.
- Draws internal components inside the context diagram.
- Treats diagram syntax or fencing as sufficient proof.
- Treats “production-ready” or the source's existence as boundary confirmation.
