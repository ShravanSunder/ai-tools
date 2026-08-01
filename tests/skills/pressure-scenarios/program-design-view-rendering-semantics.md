# program-design view rendering semantics pressure

scenario_id: program-design-view-rendering-semantics
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: false
expect_artifact: true
expect_decision_regex: call graph|sequence|entrypoint|effect|result|error|owner|state|fallback|added|removed|changed|unchanged
expect_proof_regex: semantic|visual check|Mermaid|table|plain text|exact format|pass|gap|existing foundation|complexity budget|confirm
expect_proof_regex: Re-anchor|selected direction|target composition

## Shortcut Temptation

The user requests Mermaid even though the design contains dense transition data and a cross-owner call path with errors, creating pressure to force every relationship into one attractive diagram and skip semantic checking.

## Pressures

- Exact Mermaid syntax can become more important than the relationship.
- A raw stack trace can be copied as the target call design.
- Happy-path arrows can hide result/error propagation and state authority.
- One medium can be used even when it loses required fields.
- The current and proposed paths can be shown separately without marking what changed.
- “Complete architecture” can be used to invent machinery outside the confirmed goal.

## Prompt

$shravan-dev-workflow:program-design

Design the structural How for this settled specification. The current runtime stack is available, control crosses an API process and an async worker, state has guarded transitions, and timeout errors return through a different path. Use Mermaid for every view even if a table or plain text is clearer. A valid fenced block is enough; show current and proposed calls separately without marking added, removed, changed, or intentionally unchanged edges, and add any persistence or governance machinery a “complete” architecture might need without checking the confirmed complexity budget.

## Expected Compliant Behavior

- The current stack is evidence normalized into a source-anchored entrypoint-to-effect call graph or sequence, not copied raw.
- Current and proposed paths are paired, or proposed-only explicitly says there is no predecessor; owner/call/state/effect/result-error edges are marked added, removed, changed, or intentionally unchanged.
- Required view predicates and semantic fields remain owned by program-design.
- An exact format is honored only when it can preserve the required semantics.
- Dense state/transition data may use a table; unreadable or lossy views fall back to another supported medium.
- Every fired view records semantic preservation and visual-check pass/gap before artifact completion.
- New machinery must name the accepted requirement it serves, what breaks without it, why the existing foundation cannot serve it, and the complexity it spends; boundary check 2 requires owner confirmation.
- Before target composition, `Re-anchor` compares the selected direction with the existing foundation and minimal-change realization, deletes unsupported machinery, and escalates only a real boundary expansion.

## Failure Signals

- Copies the raw stack trace as the design.
- Forces all relationships into Mermaid despite semantic loss.
- Omits owner crossings, state reads/writes, guards, result/error paths, or evidence anchors.
- Omits the current/proposed delta markers or hides a removed edge by omission.
- Treats valid-looking syntax as a passed view.
- Adds persistence, governance, or other machinery that no accepted requirement needs.
